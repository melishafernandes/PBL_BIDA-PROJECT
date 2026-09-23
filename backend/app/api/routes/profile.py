from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps_auth import get_current_user
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.profile import ProfileCreate, ProfileResponse

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.post("", response_model=ProfileResponse)
def create_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if existing:
        for field, value in profile.model_dump().items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    db_profile = UserProfile(**profile.model_dump(), user_id=current_user.id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@router.get("", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        return None
    return profile


@router.put("", response_model=ProfileResponse)
def update_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not existing:
        db_profile = UserProfile(**profile.model_dump(), user_id=current_user.id)
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile

    for field, value in profile.model_dump().items():
        setattr(existing, field, value)
    db.commit()
    db.refresh(existing)
    return existing