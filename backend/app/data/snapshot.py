"""
Saves and loads sector feature datasets as CSV files, so training/backtesting
can run against a fixed, reproducible snapshot instead of always re-fetching
live data from FRED/Yahoo Finance.
"""

from pathlib import Path
import pandas as pd

from app.features.engineering import build_sector_features

SNAPSHOT_DIR = Path(__file__).parent.parent.parent / "data" / "snapshots"
SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)


def save_snapshot(period: str = "5y") -> Path:
    """Fetches live data, builds features, and saves one CSV per sector."""
    features = build_sector_features(period)

    for sector, df in features.items():
        filename = sector.replace(" ", "_") + ".csv"
        df.to_csv(SNAPSHOT_DIR / filename)

    print(f"Saved snapshot for {len(features)} sectors to {SNAPSHOT_DIR}")
    return SNAPSHOT_DIR


def load_snapshot() -> dict[str, pd.DataFrame]:
    """Loads previously saved CSVs instead of hitting live APIs."""
    csv_files = list(SNAPSHOT_DIR.glob("*.csv"))
    if not csv_files:
        raise FileNotFoundError(
            f"No snapshot found in {SNAPSHOT_DIR}. Run save_snapshot() first."
        )

    features = {}
    for csv_file in csv_files:
        sector = csv_file.stem.replace("_", " ")
        df = pd.read_csv(csv_file, index_col=0, parse_dates=True)
        features[sector] = df

    print(f"Loaded snapshot: {len(features)} sectors from {SNAPSHOT_DIR}")
    return features


def get_features(use_snapshot: bool = False, period: str = "5y") -> dict[str, pd.DataFrame]:
    """Single entry point: pass use_snapshot=True to use saved CSVs, False for live data."""
    if use_snapshot:
        return load_snapshot()
    return build_sector_features(period)


if __name__ == "__main__":
    save_snapshot()