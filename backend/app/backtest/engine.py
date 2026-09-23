"""
Walk-forward backtest: retrains sector models periodically using ONLY data
available up to that point in time, then evaluates predictions on the
following out-of-sample weeks before retraining again. This avoids the
lookahead bias of testing a model on data it was already fit on.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

from app.data.snapshot import get_features
from app.data.yahoo_client import get_benchmark_history
from app.ml.train import FEATURE_COLUMNS, TARGET_COLUMN

RISK_DISCLAIMER = (
    "Past performance does not guarantee future results. These outputs are "
    "informational and not personalized financial advice."
)

# These are DEFAULTS for when we have long history (2+ years). If the shortest-lived
# sector's ETF has less history than this, we scale both down automatically so the
# backtest can still run on whatever data is genuinely available.
DEFAULT_MIN_TRAIN_WEEKS = 104
DEFAULT_RETRAIN_EVERY = 12
MINIMUM_VIABLE_TRAIN_WEEKS = 20  # below this, a backtest isn't meaningful at all

def _fit_best_model(X: pd.DataFrame, y: pd.Series):
    """Fit both models on past-only data, quick holdout to pick the better one,
    then refit the winner on all past data (still no future leakage)."""
    split = int(len(X) * 0.8)
    X_train, X_val = X.iloc[:split], X.iloc[split:]
    y_train, y_val = y.iloc[:split], y.iloc[split:]

    rf = RandomForestClassifier(n_estimators=200, max_depth=5, min_samples_leaf=5, random_state=42)
    xgb = XGBClassifier(n_estimators=200, max_depth=3, learning_rate=0.05, eval_metric="logloss", random_state=42)

    rf.fit(X_train, y_train)
    xgb.fit(X_train, y_train)

    rf_acc = rf.score(X_val, y_val) if len(X_val) else 0
    xgb_acc = xgb.score(X_val, y_val) if len(X_val) else 0

    best = rf if rf_acc >= xgb_acc else xgb
    best.fit(X, y)
    return best


def run_walk_forward_backtest() -> dict:
    features = get_features(use_snapshot=False)

    common_index = None
    for df in features.values():
        common_index = df.index if common_index is None else common_index.intersection(df.index)
    common_index = common_index.sort_values()

    total_weeks = len(common_index)

    if total_weeks <= MINIMUM_VIABLE_TRAIN_WEEKS + 4:
        raise ValueError(
            f"Not enough shared history across all sectors for a backtest "
            f"(only {total_weeks} weeks available)."
        )

    if total_weeks <= DEFAULT_MIN_TRAIN_WEEKS + DEFAULT_RETRAIN_EVERY:
        # Scale down: use 70% of available history to train, retrain every ~15% of it
        MIN_TRAIN_WEEKS = max(MINIMUM_VIABLE_TRAIN_WEEKS, int(total_weeks * 0.7))
        RETRAIN_EVERY = max(2, int(total_weeks * 0.15))
        print(f"  NOTE: limited shared history ({total_weeks} weeks) — "
              f"using scaled-down windows: train={MIN_TRAIN_WEEKS}, retrain_every={RETRAIN_EVERY}")
    else:
        MIN_TRAIN_WEEKS = DEFAULT_MIN_TRAIN_WEEKS
        RETRAIN_EVERY = DEFAULT_RETRAIN_EVERY

    rows = []
    models = {sector: None for sector in features}
    next_retrain_idx = MIN_TRAIN_WEEKS

    for i, date in enumerate(common_index):
        if i < MIN_TRAIN_WEEKS:
            continue  # inside the initial training-only window — no predictions yet

        if i >= next_retrain_idx:
            train_dates = common_index[:i]  # strictly PAST data only
            for sector, df in features.items():
                past = df.loc[df.index.isin(train_dates)]
                models[sector] = _fit_best_model(past[FEATURE_COLUMNS], past[TARGET_COLUMN])
            next_retrain_idx = i + RETRAIN_EVERY

        week_scores = {}
        for sector, df in features.items():
            X = df.loc[[date], FEATURE_COLUMNS]
            prob = models[sector].predict_proba(X)[0][1]
            week_scores[sector] = prob

        top_sector = max(week_scores, key=week_scores.get)
        top_sector_actual_return = features[top_sector].loc[date, "return"]

        rows.append({
            "date": date,
            "top_sector": top_sector,
            "top_sector_probability": week_scores[top_sector],
            "strategy_return": top_sector_actual_return,
        })

    strategy = pd.DataFrame(rows).set_index("date")

    benchmark_prices = get_benchmark_history()
    benchmark_prices.index = benchmark_prices.index.tz_localize(None)
    benchmark_weekly_return = benchmark_prices["Close"].resample("W-FRI").last().pct_change()
    strategy["benchmark_return"] = benchmark_weekly_return.reindex(strategy.index)
    strategy = strategy.dropna()

    strategy["strategy_cumulative"] = (1 + strategy["strategy_return"]).cumprod()
    strategy["benchmark_cumulative"] = (1 + strategy["benchmark_return"]).cumprod()

    def max_drawdown(cumulative: pd.Series) -> float:
        running_max = cumulative.cummax()
        drawdown = (cumulative - running_max) / running_max
        return float(drawdown.min())

    def sharpe_ratio(returns: pd.Series, periods_per_year: int = 52) -> float:
        if returns.std() == 0:
            return 0.0
        return float((returns.mean() / returns.std()) * np.sqrt(periods_per_year))

    strategy["correct_pick"] = (strategy["strategy_return"] > strategy["benchmark_return"]).astype(int)

    return {
        "weeks_tested_out_of_sample": len(strategy),
        "pick_accuracy_vs_benchmark_pct": round(strategy["correct_pick"].mean() * 100, 2),
        "strategy_total_return_pct": round((strategy["strategy_cumulative"].iloc[-1] - 1) * 100, 2),
        "benchmark_total_return_pct": round((strategy["benchmark_cumulative"].iloc[-1] - 1) * 100, 2),
        "strategy_max_drawdown_pct": round(max_drawdown(strategy["strategy_cumulative"]) * 100, 2),
        "benchmark_max_drawdown_pct": round(max_drawdown(strategy["benchmark_cumulative"]) * 100, 2),
        "strategy_sharpe": round(sharpe_ratio(strategy["strategy_return"]), 3),
        "benchmark_sharpe": round(sharpe_ratio(strategy["benchmark_return"]), 3),
        "risk_disclaimer": RISK_DISCLAIMER,
        "equity_curve": strategy[["strategy_cumulative", "benchmark_cumulative"]].reset_index().to_dict("records"),
    }


if __name__ == "__main__":
    result = run_walk_forward_backtest()
    print(f"\nOut-of-sample weeks tested: {result['weeks_tested_out_of_sample']}")
    print(f"Pick accuracy vs benchmark: {result['pick_accuracy_vs_benchmark_pct']}%")
    print(f"Strategy total return: {result['strategy_total_return_pct']}%")
    print(f"Benchmark (Nifty 50) total return: {result['benchmark_total_return_pct']}%")
    print(f"Strategy max drawdown: {result['strategy_max_drawdown_pct']}%")
    print(f"Benchmark max drawdown: {result['benchmark_max_drawdown_pct']}%")
    print(f"Strategy Sharpe ratio: {result['strategy_sharpe']}")
    print(f"Benchmark Sharpe ratio: {result['benchmark_sharpe']}")
    print(f"\n{result['risk_disclaimer']}")