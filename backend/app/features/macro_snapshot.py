import time

import pandas as pd
import requests

from app.data.fred_client import _fetch_with_retry

# Series chosen after checking which ones are still being updated
FRED_RATE = "IRSTCI01INM156N"       # India short-term (call money) rate, monthly
FRED_INFLATION = "FPCPITOTLZGIND"   # India CPI inflation, annual average %
WB_GDP_URL = (
    "https://api.worldbank.org/v2/country/IND/indicator/NY.GDP.MKTP.KD.ZG"
    "?format=json&per_page=20"
)  # India real GDP growth, annual %

KEYS = ["gdp_growth", "inflation", "interest_rate"]

# Arrows compare with a year earlier; smaller changes than this count as "flat".
TOLERANCE = {"gdp_growth": 0.5, "inflation": 0.5, "interest_rate": 0.1}

_cache = {"ts": 0.0, "ttl": 0.0, "data": None}


def _world_bank_gdp():
    try:
        r = requests.get(WB_GDP_URL, timeout=15)
        r.raise_for_status()
        rows = r.json()[1] or []
        return {
            int(x["date"]): float(x["value"])
            for x in rows
            if x.get("value") is not None
        }
    except Exception as e:
        print(f"  Macro snapshot: World Bank GDP fetch failed ({e})")
        return {}


def _fred_annual(series_id):
    try:
        s = _fetch_with_retry(series_id).dropna()
        return {int(ts.year): float(v) for ts, v in s.items()}
    except Exception as e:
        print(f"  Macro snapshot: could not load {series_id} ({e})")
        return {}


def _fred_monthly(series_id):
    try:
        s = _fetch_with_retry(series_id).dropna().copy()
        s.index = pd.to_datetime(s.index)
        return s.sort_index()
    except Exception as e:
        print(f"  Macro snapshot: could not load {series_id} ({e})")
        return pd.Series(dtype=float)


def _annual_entry(data, this_year):
    """Returns (latest value, previous year's value, year label, out_of_date)."""
    if not data:
        return None, None, None, True
    year = max(data)
    return data[year], data.get(year - 1), str(year), (this_year - year) > 1


def _direction(now, before, tol):
    if now is None or before is None:
        return "flat"
    diff = now - before
    if diff > tol:
        return "up"
    if diff < -tol:
        return "down"
    return "flat"


def _round(v):
    return None if v is None else round(v, 2)


def _classify(values, prev, stale):
    if any(v is None for v in values.values()) or any(stale.values()):
        return "Limited data"
    if values["gdp_growth"] < 0:
        return "Contraction Regime"
    # RBI's inflation target is 4% with a tolerance band of 2% either side
    if values["inflation"] > 6:
        return "Inflationary Regime"
    # a big move in short-term rates over the past year
    if prev["interest_rate"] is not None:
        if abs(values["interest_rate"] - prev["interest_rate"]) >= 1.0:
            return "Mixed Regime"
    return "Stable Growth Regime"


def _build():
    today = pd.Timestamp.today().normalize()
    values, prev, as_of, stale = {}, {}, {}, {}

    gdp = _annual_entry(_world_bank_gdp(), today.year)
    values["gdp_growth"], prev["gdp_growth"], as_of["gdp_growth"], stale["gdp_growth"] = gdp

    infl = _annual_entry(_fred_annual(FRED_INFLATION), today.year)
    values["inflation"], prev["inflation"], as_of["inflation"], stale["inflation"] = infl

    rate = _fred_monthly(FRED_RATE)
    if rate.empty:
        values["interest_rate"] = None
        prev["interest_rate"] = None
        as_of["interest_rate"] = None
        stale["interest_rate"] = True
    else:
        last = rate.index[-1]
        older = rate[rate.index <= last - pd.DateOffset(years=1)]
        values["interest_rate"] = float(rate.iloc[-1])
        prev["interest_rate"] = float(older.iloc[-1]) if not older.empty else None
        as_of["interest_rate"] = last.strftime("%b %Y")
        stale["interest_rate"] = (today - last).days > 180

    return {
        "regime": _classify(values, prev, stale),
        "indicators": {k: _direction(values[k], prev[k], TOLERANCE[k]) for k in KEYS},
        "values": {k: _round(values[k]) for k in KEYS},
        "as_of": as_of,
        "stale": stale,
    }


def get_macro_snapshot():
    now = time.time()
    if _cache["data"] is not None and now - _cache["ts"] < _cache["ttl"]:
        return _cache["data"]

    data = _build()
    complete = all(v is not None for v in data["values"].values())
    _cache["ts"] = now
    _cache["ttl"] = 6 * 3600 if complete else 600
    _cache["data"] = data
    return data