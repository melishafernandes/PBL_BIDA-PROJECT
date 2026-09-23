import pandas as pd
from app.data.fred_client import get_gdp, get_inflation, get_interest_rate
from app.data.yahoo_client import get_all_sectors_history
from app.data.cache import cached

def _to_weekly_returns(price_df: pd.DataFrame) -> pd.Series:
    price_df = price_df.copy()
    price_df.index = price_df.index.tz_localize(None)
    weekly_close = price_df["Close"].resample("W-FRI").last()
    return weekly_close.pct_change()

def _weekly_close(price_df: pd.DataFrame) -> pd.Series:
    price_df = price_df.copy()
    price_df.index = price_df.index.tz_localize(None)
    return price_df["Close"].resample("W-FRI").last()

def build_macro_features(weekly_index: pd.DatetimeIndex) -> pd.DataFrame:
    gdp = get_gdp()
    inflation = get_inflation()
    rate = get_interest_rate()

    gdp.index = pd.to_datetime(gdp.index)
    inflation.index = pd.to_datetime(inflation.index)
    rate.index = pd.to_datetime(rate.index)

    # Reindex EACH series independently so one series' missing dates
    # don't inject NaNs into the others before forward-filling.
    gdp_aligned = gdp.reindex(weekly_index, method="ffill")
    inflation_aligned = inflation.reindex(weekly_index, method="ffill")
    rate_aligned = rate.reindex(weekly_index, method="ffill")

    macro = pd.DataFrame({
        "gdp": gdp_aligned,
        "inflation": inflation_aligned,
        "interest_rate": rate_aligned,
    })

    macro["gdp_roc"] = macro["gdp"].pct_change(52)  # ~1 year lookback, since India's GDP series is annual
    macro["inflation_roc"] = macro["inflation"].pct_change(4)
    macro["rate_change"] = macro["interest_rate"].diff(4)

    return macro[["gdp_roc", "inflation_roc", "rate_change"]]

@cached(key="sector_features")
def build_sector_features(period: str = "5y") -> dict[str, pd.DataFrame]:
    raw = get_all_sectors_history(period)
    benchmark_returns = _to_weekly_returns(raw["_benchmark"])

    # Build a shared weekly index (from the benchmark) so macro data is fetched
    # ONCE for the whole request, not once per sector. This is both faster and
    # far more reliable, since a single FRED hiccup no longer takes out most sectors.
    shared_weekly_index = _weekly_close(raw["_benchmark"]).index
    macro = build_macro_features(shared_weekly_index)

    features = {}
    for sector, price_df in raw.items():
        if sector == "_benchmark":
            continue

        weekly_returns = _to_weekly_returns(price_df)
        df = pd.DataFrame({"return": weekly_returns})

        df["rolling_return_4w"] = df["return"].rolling(4).mean()
        df["rolling_vol_4w"] = df["return"].rolling(4).std()

        close = _weekly_close(price_df)
        df["ma_4w"] = close.rolling(4).mean()
        df["ma_12w"] = close.rolling(12).mean()

        df["excess_return_next_week"] = (df["return"] - benchmark_returns).shift(-1)
        df["outperformed_next_week"] = (df["excess_return_next_week"] > 0).astype(int)

        df = df.join(macro)
        df = df.dropna()

        if df.empty:
            print(f"  WARNING: '{sector}' produced no usable rows after cleaning — skipping it for this request.")
            continue

        features[sector] = df

    return features
def detect_regime(macro_row: pd.Series) -> str:
    if macro_row["gdp_roc"] > 0 and macro_row["inflation_roc"] < 0.02 and abs(macro_row["rate_change"]) < 0.25:
        return "Stable Growth Regime"
    elif macro_row["gdp_roc"] < 0:
        return "Contraction Regime"
    elif macro_row["inflation_roc"] > 0.02:
        return "Inflationary Regime"
    else:
        return "Mixed Regime"
