from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.beginner import risk_labels
from app.core.sector_companies import get_companies
from app.core.sector_prices import get_sector_sparklines
from app.api.deps_auth import get_current_user
from app.models.user import User
from app.models.user_profile import UserProfile
from app.ml.rank import get_sector_rankings
from app.ml.personalize import apply_personalization, get_income_note

router = APIRouter(prefix="/api/sectors", tags=["sectors"])


@router.get("/ranking")
def ranking(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rankings = get_sector_rankings()
    risk_map = risk_labels(rankings)

    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    interest = profile.interest if profile else None
    income_range = profile.monthly_income_range if profile else None

    personalized = apply_personalization(rankings, interest)
    personalized["income_note"] = get_income_note(income_range)

    items = personalized.get("rankings", [])
    sparklines = get_sector_sparklines([i["sector"] for i in items])
    for item in items:
        item["companies"] = get_companies(item["sector"])
        item["sparkline"] = sparklines.get(item["sector"], [])
        item["risk"] = risk_map.get(item["sector"])

    return personalized