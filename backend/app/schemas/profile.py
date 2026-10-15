from pydantic import BaseModel
from typing import Optional


class ProfileCreate(BaseModel):
    experience: str = "Not specified"
    risk_tolerance: str = "Not specified"
    investment_horizon: str = "Not specified"
    market: str = "India"
    gender: Optional[str] = None
    monthly_income_range: Optional[str] = None
    monthly_expenses_range: Optional[str] = None
    interest: Optional[str] = None


class ProfileResponse(ProfileCreate):
    id: int

    class Config:
        from_attributes = True