import time
from fredapi import Fred
from app.core.config import settings

fred = Fred(api_key=settings.fred_api_key)


def _fetch_with_retry(series_id: str, retries: int = 3, delay: float = 2.0):
    last_error = None
    for attempt in range(retries):
        try:
            return fred.get_series(series_id)
        except Exception as e:
            last_error = e
            print(f"  FRED fetch failed for {series_id} (attempt {attempt + 1}/{retries}): {e}")
            time.sleep(delay * (attempt + 1))
    raise last_error


# NOTE: India's macro data on FRED is sparser than the US — GDP is annual
# (not quarterly), so gdp_roc will update far less often and forward-fill
# over long stretches. This is a known, documented limitation.

def get_gdp():
    return _fetch_with_retry("MKTGDPINA646NWDB")   # GDP, India, annual (World Bank via FRED)

def get_inflation():
    return _fetch_with_retry("INDCPIALLMINMEI")     # CPI, India, monthly (OECD via FRED)

def get_interest_rate():
    return _fetch_with_retry("INTDSRINM193N")        # Discount rate, India, monthly