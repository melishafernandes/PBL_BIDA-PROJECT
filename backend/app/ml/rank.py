"""
Ranks all 11 sectors by their model's current predicted probability
of outperformance — this is what powers the main dashboard (Slide 5/9).
"""

from app.data.snapshot import get_features
from app.features.macro_snapshot import get_macro_snapshot
from app.ml.explain import explain_sector, FEATURE_COLUMNS


def get_sector_rankings() -> list[dict]:
    features = get_features(use_snapshot=False)
    rankings = []

    for sector, df in features.items():
        result = explain_sector(sector, df)
        latest_volatility = float(df["rolling_vol_4w"].iloc[-1])
        rankings.append({
            "sector": sector,
            "score": result["score"],
            "probability": result["probability"],
            "signal": result["signal"],
            "volatility": round(latest_volatility, 4),
        })
    rankings.sort(key=lambda r: r["score"], reverse=True)
    for i, r in enumerate(rankings, start=1):
        r["rank"] = i

    return rankings


def get_current_regime() -> dict:
    return get_macro_snapshot()