"""
Trains one RandomForest and one XGBoost classifier PER SECTOR to predict
`outperformed_next_week`. Compares them with time-series cross-validation
(never random-shuffled — financial data leaks badly with random splits),
picks the better model per sector, and saves it to ml/artifacts/.
"""

import json
import joblib
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
from xgboost import XGBClassifier

from app.data.snapshot import get_features

FEATURE_COLUMNS = [
    "rolling_return_4w",
    "rolling_vol_4w",
    "ma_4w",
    "ma_12w",
    "gdp_roc",
    "inflation_roc",
    "rate_change",
]
TARGET_COLUMN = "outperformed_next_week"

ARTIFACTS_DIR = Path(__file__).parent / "artifacts"
ARTIFACTS_DIR.mkdir(exist_ok=True)


def _evaluate(model, X: pd.DataFrame, y: pd.Series) -> float:
    """Mean accuracy across a walk-forward time-series split."""
    n_splits = min(5, max(2, len(X) // 20))  # guard against tiny datasets
    tscv = TimeSeriesSplit(n_splits=n_splits)
    scores = cross_val_score(model, X, y, cv=tscv, scoring="accuracy")
    return float(scores.mean())


def train_sector_model(sector: str, df: pd.DataFrame) -> dict:
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    rf = RandomForestClassifier(
        n_estimators=200, max_depth=5, min_samples_leaf=5, random_state=42
    )
    xgb = XGBClassifier(
        n_estimators=200, max_depth=3, learning_rate=0.05,
        eval_metric="logloss", random_state=42
    )

    rf_score = _evaluate(rf, X, y)
    xgb_score = _evaluate(xgb, X, y)

    best_name, best_model = ("random_forest", rf) if rf_score >= xgb_score else ("xgboost", xgb)
    best_model.fit(X, y)  # final fit on ALL available data for deployment

    model_path = ARTIFACTS_DIR / f"{sector.replace(' ', '_')}.pkl"
    joblib.dump(best_model, model_path)

    return {
        "sector": sector,
        "chosen_model": best_name,
        "random_forest_cv_accuracy": round(rf_score, 4),
        "xgboost_cv_accuracy": round(xgb_score, 4),
        "n_samples": len(df),
        "model_path": str(model_path),
    }


def train_all_sectors() -> list[dict]:
    features = get_features(use_snapshot=True)
    results = []
    for sector, df in features.items():
        print(f"Training models for {sector}...")
        result = train_sector_model(sector, df)
        results.append(result)
        print(f"  -> chosen: {result['chosen_model']} "
              f"(RF={result['random_forest_cv_accuracy']}, "
              f"XGB={result['xgboost_cv_accuracy']})")

    metadata_path = ARTIFACTS_DIR / "training_metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nSaved training metadata to {metadata_path}")

    return results


if __name__ == "__main__":
    train_all_sectors()