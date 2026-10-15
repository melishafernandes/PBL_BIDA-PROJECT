FEATURE_LABELS = {
    "gdp_roc": "The recent change in GDP growth",
    "inflation_roc": "The recent change in inflation",
    "rate_change": "The recent change in interest rates",
    "rolling_vol_4w": "How much this sector's price has swung over the last 4 weeks",
}


def risk_labels(rankings):
    """Label each sector Low / Medium / High volatility, relative to the others."""
    vols = []
    for r in rankings:
        v = r.get("volatility")
        if v is not None and v == v:  # skips None and NaN
            vols.append((r["sector"], float(v)))
    vols.sort(key=lambda x: x[1])

    n = len(vols)
    labels = {}
    for i, (sector, _) in enumerate(vols):
        if i < n / 3:
            labels[sector] = "Low"
        elif i < 2 * n / 3:
            labels[sector] = "Medium"
        else:
            labels[sector] = "High"
    return labels


def _humanize(feature):
    return feature.replace("_", " ").strip().capitalize()


def plain_english_reasons(contributors, top_n=3):
    """
    contributors: list of {"feature": str, "shap": float}
    Returns the top drivers as short sentences a beginner can read.
    """
    ranked = sorted(contributors, key=lambda c: abs(c["shap"]), reverse=True)[:top_n]
    reasons = []
    for c in ranked:
        label = FEATURE_LABELS.get(c["feature"], _humanize(c["feature"]))
        helps = c["shap"] >= 0
        verb = "is working in this sector's favor" if helps else "is working against this sector"
        reasons.append({"text": f"{label} {verb}.", "helps": helps})
    return reasons