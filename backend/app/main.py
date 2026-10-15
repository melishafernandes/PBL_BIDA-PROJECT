from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.models import user_profile  # noqa: F401 - import so the table gets registered
from app.models import user  # noqa: F401 - import so the table gets registered
from app.api.routes import profile, regime, sectors, explain, backtest, auth, market

# Create all DB tables on startup if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(title="InvestIQ API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(regime.router)
app.include_router(sectors.router)
app.include_router(explain.router)
app.include_router(backtest.router)
app.include_router(market.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "InvestIQ backend is running"}