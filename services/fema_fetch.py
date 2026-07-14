import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FEMA_FILE = BASE_DIR / "datasets" / "DisasterDeclarationsSummaries.csv"


def fetch_fema_data():
    df = pd.read_csv(FEMA_FILE, low_memory=False)

    cols = [
        "declarationType",
        "incidentType",
        "state",
        "designatedArea",
        "incidentBeginDate",
    ]
    available = [c for c in cols if c in df.columns]
    df = df[available]

    # rename to consistent names when present
    rename_map = {}
    if "declarationType" in df.columns:
        rename_map["declarationType"] = "declaration_type"
    if "incidentType" in df.columns:
        rename_map["incidentType"] = "disaster_type"
    if "state" in df.columns:
        rename_map["state"] = "state"
    if "designatedArea" in df.columns:
        rename_map["designatedArea"] = "county"
    if "incidentBeginDate" in df.columns:
        rename_map["incidentBeginDate"] = "incident_date"

    df = df.rename(columns=rename_map)

    # parse dates
    if "incident_date" in df.columns:
        df["incident_date"] = pd.to_datetime(df["incident_date"], errors="coerce")

    # fill missing county/state
    if "county" in df.columns:
        df["county"] = df["county"].fillna("unknown")
    if "state" in df.columns:
        df["state"] = df["state"].fillna("unknown")

    return df