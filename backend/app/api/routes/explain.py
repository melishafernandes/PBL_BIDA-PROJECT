from fastapi import APIRouter, HTTPException
from app.ml.explain import explain_sector

router = APIRouter(prefix="/api/sectors", tags=["explain"])

@router.get("/{sector}/shap")
def shap_explanation(sector: str):
    try:
        return explain_sector(sector)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"No trained model for sector '{sector}'")