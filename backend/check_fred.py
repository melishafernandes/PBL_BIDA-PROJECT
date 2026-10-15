from app.data.fred_client import fred

SERIES = {
    "CURRENT  GDP in USD, annual": "MKTGDPINA646NWDB",
    "CURRENT  CPI index, monthly": "INDCPIALLMINMEI",
    "CURRENT  discount rate, monthly": "INTDSRINM193N",
    "candidate: GDP growth, annual %": "NYGDPMKTPKDZGIND",
    "candidate: inflation, annual %": "FPCPITOTLZGIND",
    "candidate: CPI inflation rate, monthly": "CPALTT01INM659N",
    "candidate: call money rate": "IRSTCI01INM156N",
    "candidate: 3-month interbank rate": "IR3TIB01INM156N",
    "candidate: 10-year bond yield": "INDIRLTLT01STM",
}

for name, sid in SERIES.items():
    try:
        s = fred.get_series(sid).dropna()
        print(f"{sid:18} {name:40} last date {s.index[-1].date()}  last value {s.iloc[-1]:.2f}  ({len(s)} points)")
    except Exception as e:
        print(f"{sid:18} {name:40} NOT AVAILABLE ({str(e)[:60]})")
