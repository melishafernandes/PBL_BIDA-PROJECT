SECTOR_COMPANIES: dict[str, list[str]] = {
    "auto": ["Tata Motors", "Mahindra & Mahindra", "Maruti Suzuki"],
    "pharma": ["Sun Pharmaceutical", "Dr. Reddy's Laboratories", "Cipla"],
    "metal": ["Tata Steel", "JSW Steel", "Hindalco Industries"],
    "it": ["TCS", "Infosys", "Wipro"],
    "bank": ["HDFC Bank", "ICICI Bank", "State Bank of India"],
    "banking": ["HDFC Bank", "ICICI Bank", "State Bank of India"],
    "financial services": ["Bajaj Finance", "HDFC Bank", "Kotak Mahindra Bank"],
    "fmcg": ["Hindustan Unilever", "ITC", "Nestle India"],
    "energy": ["Reliance Industries", "NTPC", "Power Grid Corporation"],
    "oil & gas": ["Reliance Industries", "ONGC", "Indian Oil Corporation"],
    "realty": ["DLF", "Godrej Properties", "Macrotech Developers"],
    "infra": ["Larsen & Toubro", "Adani Ports", "UltraTech Cement"],
    "infrastructure": ["Larsen & Toubro", "Adani Ports", "UltraTech Cement"],
    "media": ["Zee Entertainment", "Sun TV Network", "PVR Inox"],
    "healthcare": ["Apollo Hospitals", "Max Healthcare", "Fortis Healthcare"],
    "consumer durables": ["Titan Company", "Havells India", "Voltas"],
}


def get_companies(sector: str) -> list[str]:
    return SECTOR_COMPANIES.get(sector.strip().lower(), [])