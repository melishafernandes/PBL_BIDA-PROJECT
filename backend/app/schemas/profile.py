from pydantic import BaseModel
from typing import Optional

class ProfileCreate(BaseModel):
    experience: str
    risk_tolerance: str
    investment_horizon: str
    market: str
    gender: Optional[str] = None
    monthly_income_range: Optional[str] = None
    monthly_expenses_range: Optional[str] = None
    interest: Optional[str] = None

class ProfileResponse(ProfileCreate):
    id: int

    class Config:
        from_attributes = True