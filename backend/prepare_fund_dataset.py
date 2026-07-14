import pandas as pd
import numpy as np
from pathlib import Path

from services.noaa_fetch import fetch_noaa_data
from services.usgs_fetch import fetch_earthquake_data
from services.fema_fetch import fetch_fema_data

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "datasets"

# =====================================
# LOAD DATA
# =====================================

noaa = fetch_noaa_data()
usgs = fetch_earthquake_data()
fema = fetch_fema_data()

# =====================================
# CLEAN DATA
# =====================================

numeric_cols = [
    "injuries",
    "deaths",
    "property_damage",
    "crop_damage"
]

for col in numeric_cols:
    noaa[col] = pd.to_numeric(
        noaa[col],
        errors="coerce"
    ).fillna(0)

usgs["magnitude"] = pd.to_numeric(
    usgs["magnitude"],
    errors="coerce"
).fillna(0)

usgs = usgs[
    (usgs["magnitude"] >= 2.5) &
    (usgs["magnitude"] <= 8.5)
]

# shuffle datasets
usgs = usgs.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

# =====================================
# ALIGN
# =====================================

min_len = min(
    len(noaa),
    len(usgs),
    len(fema)
)

noaa = noaa.sample(
    n=min_len,
    random_state=42
).reset_index(drop=True)

usgs = usgs.iloc[:min_len].reset_index(drop=True)

fema = fema.sample(
    n=min_len,
    random_state=42
).reset_index(drop=True)

# =====================================
# CREATE DATASET
# =====================================

fund_df = pd.DataFrame()

fund_df["event_type"] = noaa["event_type"]

fund_df["state"] = fema["state"]

fund_df["magnitude"] = usgs["magnitude"]

fund_df["injuries"] = noaa["injuries"]

fund_df["deaths"] = noaa["deaths"]

fund_df["property_damage"] = noaa["property_damage"]

fund_df["crop_damage"] = noaa["crop_damage"]

# =====================================
# SEVERITY
# =====================================

fund_df["severity_score"] = (
    (fund_df["magnitude"] * 20) +
    (fund_df["injuries"] * 3) +
    (fund_df["deaths"] * 10) +
    (fund_df["property_damage"] / 1_000_000)
)

variation = np.random.uniform(
    1.0,
    2.5,
    len(fund_df)
)

# =====================================
# AFFECTED POPULATION
# =====================================

fund_df["affected_population"] = (
    fund_df["severity_score"] *
    150 *
    variation
).astype(int)

# =====================================
# RELIEF FUND
# =====================================

fund_df["relief_fund"] = (
    (
        fund_df["property_damage"] * 0.4
    ) +
    (
        fund_df["crop_damage"] * 0.25
    ) +
    (
        fund_df["affected_population"] * 2500
    ) +
    (
        fund_df["injuries"] * 75000
    ) +
    (
        fund_df["deaths"] * 250000
    ) +
    (
        fund_df["magnitude"] * 800000
    )
).astype(int)

# =====================================
# SAVE
# =====================================

fund_df.to_csv(
    DATA_DIR / "fund_dataset.csv",
    index=False
)

print(fund_df.head())