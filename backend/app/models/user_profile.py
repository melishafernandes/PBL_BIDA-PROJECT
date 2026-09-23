from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)
    experience = Column(String, nullable=False)
    risk_tolerance = Column(String, nullable=False)
    investment_horizon = Column(String, nullable=False)
    market = Column(String, nullable=False)
    gender = Column(String, nullable=True)
    monthly_income_range = Column(String, nullable=True)
    monthly_expenses_range = Column(String, nullable=True)
    interest = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())