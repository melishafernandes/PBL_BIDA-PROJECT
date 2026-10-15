import time
from concurrent.futures import ThreadPoolExecutor

import pandas as pd
import yfinance as yf

# Preferred source: NSE sector index (not all of these resolve on Yahoo)
INDEX_SYMBOLS = {
    "auto": "^CNXAUTO",
    "pharma": "^CNXPHARMA",
    "metal": "^CNXMETAL",
    "it": "^CNXIT",
    "bank": "^NSEBANK",
    "fmcg": "^CNXFMCG",
    "energy": "^CNXENERGY",
    "realty": "^CNXREALTY",
    "infra": "^CNXINFRA",
}

# Fallback: average of major company stocks (any ticker that fails is skipped)
BASKETS = {
    "auto": ["M&M.NS", "MARUTI.NS", "TATAMOTORS.NS"],
    "pharma": ["SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS"],
    "metal": ["TATASTEEL.NS", "JSWSTEEL.NS", "HINDALCO.NS"],
    "it": ["TCS.NS", "INFY.NS", "WIPRO.NS"],
    "bank": ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS"],
    "fmcg": ["HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS"],
    "energy": ["RELIANCE.NS", "NTPC.NS", "POWERGRID.NS"],
    "realty": ["DLF.NS", "GODREJPROP.NS", "LODHA.NS"],
    "infra": ["LT.NS", "ADANIPORTS.NS", "ULTRACEMCO.NS"],
}

ALIASES = {"banking": "bank", "infrastructure": "infra"}

CACHE_SECONDS = 3600
_cache = {}


def _key(sector):
    k = sector.strip().lower()
    return ALIASES.get(k, k)


def _close_series(symbol):
    try:
        hist = yf.Ticker(symbol).history(period="1mo", interval="1d")
        s = hist["Close"].dropna()
        if s.empty:
            return None
        idx = pd.to_datetime(s.index)
        if idx.tz is not None:
            idx = idx.tz_localize(None)
        s.index = idx.normalize()
        return s[~s.index.duplicated(keep="last")]
    except Exception:
        return None


def _from_index(symbol):
    if not symbol:
        return []
    s = _close_series(symbol)
    if s is None or len(s) < 2:
        return []
    return [round(float(v), 2) for v in s.tolist()]


def _from_basket(tickers):
    series = []
    for t in tickers:
        s = _close_series(t)
        if s is not None and len(s) >= 2:
            series.append(s)
    if not series:
        return []
    df = pd.concat(series, axis=1).sort_index().ffill().dropna()
    if len(df) < 2:
        return []
    avg = (df / df.iloc[0] * 100).mean(axis=1)
    return [round(float(v), 2) for v in avg.tolist()]


def _build(key):
    values = _from_index(INDEX_SYMBOLS.get(key))
    if len(values) >= 2:
        return values
    return _from_basket(BASKETS.get(key, []))


def get_sector_sparklines(sectors):
    now = time.time()
    keys = {s: _key(s) for s in sectors}

    stale = []
    for k in set(keys.values()):
        if k not in _cache or now - _cache[k][0] > CACHE_SECONDS:
            stale.append(k)

    if stale:
        with ThreadPoolExecutor(max_workers=len(stale)) as pool:
            results = list(pool.map(_build, stale))
        for k, values in zip(stale, results):
            if values:
                _cache[k] = (now, values)

    out = {}
    for sector, k in keys.items():
        out[sector] = _cache[k][1] if k in _cache else []
    return out