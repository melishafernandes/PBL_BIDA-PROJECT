from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
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
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    interest = profile.interest if profile else None
    income_range = profile.monthly_income_range if profile else None

    personalized = apply_personalization(rankings, interest)
    personalized["income_note"] = get_income_note(income_range)

    return personalized