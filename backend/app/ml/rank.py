"""
Ranks all 11 sectors by their model's current predicted probability
of outperformance — this is what powers the main dashboard (Slide 5/9).
"""

from app.data.snapshot import get_features
from app.features.engineering import detect_regime
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
    features = get_features(use_snapshot=False)
    any_sector_df = next(iter(features.values()))
    latest_macro = any_sector_df.iloc[-1]

    regime = detect_regime(latest_macro)

    def direction(value: float) -> str:
        if value > 0.001:
            return "up"
        elif value < -0.001:
            return "down"
        return "flat"

    return {
        "regime": regime,
        "indicators": {
            "gdp_growth": direction(latest_macro["gdp_roc"]),
            "inflation": direction(latest_macro["inflation_roc"]),
            "interest_rate": direction(latest_macro["rate_change"]),
        },
    }