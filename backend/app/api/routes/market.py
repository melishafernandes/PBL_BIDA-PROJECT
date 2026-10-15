import time
from concurrent.futures import ThreadPoolExecutor

import yfinance as yf
from fastapi import APIRouter

router = APIRouter(prefix="/api/market", tags=["market"])

INDICES = [
    {"name": "SENSEX", "symbol": "^BSESN"},
    {"name": "NIFTY 50", "symbol": "^NSEI"},
    {"name": "DOW", "symbol": "^DJI"},
    {"name": "FTSE 100", "symbol": "^FTSE"},
    {"name": "Nikkei 225", "symbol": "^N225"},
    {"name": "NASDAQ", "symbol": "^IXIC"},
    {"name": "S&P 500", "symbol": "^GSPC"},
]

CACHE_SECONDS = 300
_cache: dict = {"ts": 0.0, "data": []}


def _fetch_one(item: dict) -> dict | None:
    try:
        hist = yf.Ticker(item["symbol"]).history(period="1mo", interval="1d")
        closes = [float(c) for c in hist["Close"].dropna().tolist()]
        if len(closes) < 2:
            return None
        price, prev = closes[-1], closes[-2]
        change = price - prev
        return {
            "name": item["name"],
            "symbol": item["symbol"],
            "price": round(price, 2),
            "change": round(change, 2),
            "change_pct": round(change / prev * 100, 2),
            "sparkline": [round(c, 2) for c in closes],
        }
    except Exception:
        return None


@router.get("/indices")
def indices():
    now = time.time()
    if _cache["data"] and now - _cache["ts"] < CACHE_SECONDS:
        return {"indices": _cache["data"]}

    with ThreadPoolExecutor(max_workers=len(INDICES)) as pool:
        results = list(pool.map(_fetch_one, INDICES))

    data = [r for r in results if r]
    if data:
        _cache["ts"] = now
        _cache["data"] = data
    return {"indices": data}