import pandas as pd
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
NOAA_FILE = BASE_DIR / "datasets" / "StormEvents_details.csv"


def _parse_damage(val):
    if pd.isna(val):
        return 0
    s = str(val).strip().upper().replace(',', '')
    if s == '' or s == '0':
        return 0
    mult = 1
    if s.endswith('K'):
        mult = 10**3
        s = s[:-1]
    elif s.endswith('M'):
        mult = 10**6
        s = s[:-1]
    elif s.endswith('B'):
        mult = 10**9
        s = s[:-1]
    m = re.search(r"[-+]?[0-9]*\.?[0-9]+", s)
    if not m:
        return 0
    try:
        return int(float(m.group()) * mult)
    except Exception:
        return 0


def fetch_noaa_data():
    df = pd.read_csv(NOAA_FILE, low_memory=False)

    df = df[
        [
            "EVENT_TYPE",
            "INJURIES_DIRECT",
            "DEATHS_DIRECT",
            "DAMAGE_PROPERTY",
            "DAMAGE_CROPS",
            "STATE",
        ]
    ]

    df.columns = [
        "event_type",
        "injuries",
        "deaths",
        "property_damage",
        "crop_damage",
        "state",
    ]

    # normalize damage formats like '25K', '2.5M', '.25K', '0K'
    df["property_damage"] = df["property_damage"].apply(_parse_damage)
    df["crop_damage"] = df["crop_damage"].apply(_parse_damage)

    # ensure numeric injuries/deaths
    df["injuries"] = pd.to_numeric(df["injuries"], errors="coerce").fillna(0).astype(int)
    df["deaths"] = pd.to_numeric(df["deaths"], errors="coerce").fillna(0).astype(int)

    return df