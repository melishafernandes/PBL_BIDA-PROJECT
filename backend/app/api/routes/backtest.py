from fastapi import APIRouter
from app.backtest.engine import run_walk_forward_backtest

router = APIRouter(prefix="/api/backtest", tags=["backtest"])

_cached_result = None

@router.get("")
def backtest():
    global _cached_result
    if _cached_result is None:
        _cached_result = run_walk_forward_backtest()
    return _cached_result