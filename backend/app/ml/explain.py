"""
Loads a sector's saved model and produces SHAP explanations —
which features pushed the prediction up (positive contributors)
and which pushed it down (negative contributors), matching
Slide 10 of the deck.
"""

import joblib
import shap
import numpy as np
import pandas as pd
from pathlib import Path

from app.data.snapshot import get_features

ARTIFACTS_DIR = Path(__file__).parent / "artifacts"

FEATURE_LABELS = {
    "rolling_return_4w": "Sector Momentum",
    "rolling_vol_4w": "Volatility",
    "ma_4w": "Short-Term Trend",
    "ma_12w": "Long-Term Trend",
    "gdp_roc": "GDP Growth",
    "inflation_roc": "Inflation",
    "rate_change": "Interest Rate Trend",
}

FEATURE_COLUMNS = list(FEATURE_LABELS.keys())


def load_model(sector: str):
    model_path = ARTIFACTS_DIR / f"{sector.replace(' ', '_')}.pkl"
    if not model_path.exists():
        raise FileNotFoundError(f"No trained model found for '{sector}'. Run train.py first.")
    return joblib.load(model_path)


def explain_sector(sector: str, df: pd.DataFrame | None = None) -> dict:
    """
    Returns the latest prediction for `sector` plus a SHAP breakdown:
    positive_contributors / negative_contributors, each with a % impact,
    sorted by magnitude — ready to feed straight into the dashboard.
    """
    model = load_model(sector)

    if df is None:
        df = get_features(use_snapshot=False)[sector]
        

    latest_row = df[FEATURE_COLUMNS].iloc[[-1]]  # most recent week, as a 1-row DataFrame

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(latest_row)

    # SHAP's return shape varies by version/model type. Normalize it down
    # to a plain 1D array of one value per feature for THIS sample, class "1" (outperforms).
    values = shap_values
    if isinstance(values, list):
        values = values[1]          # older SHAP: list of [class_0_array, class_1_array]
    values = np.asarray(values)

    if values.ndim == 3:
        values = values[0, :, 1]    # (samples, features, classes) -> this sample, all features, class 1
    elif values.ndim == 2:
        values = values[0]          # (samples, features) -> this sample
    # else already 1D: (features,)

    contributions = []
    for feature, value in zip(FEATURE_COLUMNS, values):
        contributions.append({
            "feature": FEATURE_LABELS[feature],
            "impact_pct": round(float(value) * 100, 2),
        })

    positive = sorted([c for c in contributions if c["impact_pct"] > 0],
                       key=lambda c: -c["impact_pct"])
    negative = sorted([c for c in contributions if c["impact_pct"] < 0],
                       key=lambda c: c["impact_pct"])

    probability = float(model.predict_proba(latest_row)[0][1])
    score = round(probability * 100)

    if score >= 70:
        signal = "Strong"
    elif score >= 55:
        signal = "Moderate"
    else:
        signal = "Neutral"

    return {
        "sector": sector,
        "probability": round(probability, 4),
        "score": score,
        "signal": signal,
        "positive_contributors": positive,
        "negative_contributors": negative,
    }


if __name__ == "__main__":
    result = explain_sector("Financials")
    print(f"\n{result['sector']} — {result['signal']} ({result['score']}/100)")
    print("\nPositive Contributors:")
    for c in result["positive_contributors"]:
        print(f"  {c['feature']}: +{c['impact_pct']}%")
    print("\nNegative Contributors:")
    for c in result["negative_contributors"]:
        print(f"  {c['feature']}: {c['impact_pct']}%")