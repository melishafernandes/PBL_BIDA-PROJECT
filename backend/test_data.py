from app.features.engineering import build_sector_features

features = build_sector_features()
tech = features["Technology"]

print("Total rows:", len(tech))
print("\nMiddle sample:")
print(tech.iloc[len(tech)//2 : len(tech)//2 + 5])

print("\nSummary stats for macro columns:")
print(tech[["gdp_roc", "inflation_roc", "rate_change"]].describe())
