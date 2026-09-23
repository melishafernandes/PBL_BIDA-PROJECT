"""
Adds a small 'match_reason' tag to sectors that fit the user's stated
interest, based on real computed features (score, volatility) — never
fabricated advice, and never based on income (income gets a separate,
purely educational note instead).
"""

def apply_personalization(rankings: list[dict], interest: str | None) -> dict:
    if not interest:
        return {"rankings": rankings, "highlighted_sectors": []}

    sorted_by_vol = sorted(rankings, key=lambda r: r["volatility"])
    sorted_by_score = sorted(rankings, key=lambda r: -r["score"])

    if interest == "Stability & Safety":
        picks = sorted_by_vol[:3]
        reason = "one of the lowest-volatility sectors right now"
    elif interest == "High Growth Potential":
        picks = sorted_by_score[:3]
        reason = "currently one of the highest-scoring sectors"
    elif interest == "Steady Growth":
        mid_score = [r for r in rankings if 55 <= r["score"] <= 75]
        picks = sorted(mid_score, key=lambda r: r["volatility"])[:3]
        reason = "a solid score with relatively manageable volatility"
    else:
        return {"rankings": rankings, "highlighted_sectors": []}

    picked_names = {p["sector"] for p in picks}
    for r in rankings:
        r["highlighted"] = r["sector"] in picked_names
        r["match_reason"] = reason if r["sector"] in picked_names else None

    return {"rankings": rankings, "highlighted_sectors": list(picked_names)}


def get_income_note(income_range: str | None) -> str | None:
    """Purely educational, generic note — never a specific recommendation."""
    if not income_range:
        return None
    return (
        "This is general education, not financial advice: many beginners with similar "
        "income levels start by learning about 2-3 sectors well, rather than spreading "
        "attention across all of them at once."
    )