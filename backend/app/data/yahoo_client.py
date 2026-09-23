import yfinance as yf

# NSE sector coverage: raw indices don't have full historical data via Yahoo Finance
# for most sectors (only Bank/IT/Pharma indices have reliable long history), so we use
# tradeable sector ETFs for the rest — real listed instruments have full price history.
#
# NOTE: Media was dropped — no dedicated, liquid, long-history Nifty Media ETF exists
# on Yahoo Finance as of Sept 2026. This is a genuine data-availability gap, not a bug.
SECTOR_ETFS = {
    "Bank": "^NSEBANK",
    "IT": "^CNXIT",
    "Pharma": "^CNXPHARMA",
    "Auto": "AUTOIETF.NS",
    "FMCG": "FMCGIETF.NS",
    "Metal": "METALIETF.NS",
    "Infrastructure": "INFRAIETF.NS",
    "Energy": "ENERGY.NS",
    "Realty": "MOREALTY.NS",
}

BENCHMARK = "^NSEI"  # Nifty 50 — broad Indian market benchmark

def get_sector_history(sector: str, period: str = "5y"):
    ticker = SECTOR_ETFS[sector]
    return yf.Ticker(ticker).history(period=period)

def get_benchmark_history(period: str = "5y"):
    return yf.Ticker(BENCHMARK).history(period=period)

def get_all_sectors_history(period: str = "5y"):
    """Returns {sector_name: DataFrame} for every sector, plus the benchmark."""
    data = {name: get_sector_history(name, period) for name in SECTOR_ETFS}
    data["_benchmark"] = get_benchmark_history(period)
    return data