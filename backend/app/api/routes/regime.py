from fastapi import APIRouter
from app.ml.rank import get_current_regime

router = APIRouter(prefix="/api/regime", tags=["regime"])

@router.get("")
def regime():
    return get_current_regime()