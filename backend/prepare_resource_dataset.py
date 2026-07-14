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
# CLEAN NOAA DATA
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

# =====================================
# CLEAN USGS
# =====================================

usgs["magnitude"] = pd.to_numeric(
    usgs["magnitude"],
    errors="coerce"
).fillna(0)

# realistic earthquake range
usgs = usgs[
    (usgs["magnitude"] >= 2.5) &
    (usgs["magnitude"] <= 8.5)
]

# shuffle for variability
usgs = usgs.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

# =====================================
# ALIGN DATASETS
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
# CREATE RESOURCE DATASET
# =====================================

resource_df = pd.DataFrame()

resource_df["event_type"] = noaa["event_type"]

resource_df["state"] = fema["state"]

resource_df["magnitude"] = usgs["magnitude"]

resource_df["injuries"] = noaa["injuries"]

resource_df["deaths"] = noaa["deaths"]

resource_df["property_damage"] = noaa["property_damage"]

resource_df["crop_damage"] = noaa["crop_damage"]

# =====================================
# SEVERITY SCORE
# =====================================

resource_df["severity_score"] = (
    (resource_df["magnitude"] * 15) +
    (resource_df["injuries"] * 2) +
    (resource_df["deaths"] * 8) +
    (resource_df["property_damage"] / 1_000_000)
)

# =====================================
# RANDOM VARIATION
# =====================================

variation = np.random.uniform(
    0.8,
    1.5,
    len(resource_df)
)

# =====================================
# AFFECTED POPULATION
# =====================================

resource_df["affected_population"] = (
    resource_df["severity_score"] *
    120 *
    variation
).astype(int)

resource_df["affected_population"] = np.where(
    resource_df["affected_population"] < 50,
    np.random.randint(50, 300),
    resource_df["affected_population"]
)

# =====================================
# RESOURCE REQUIREMENTS
# =====================================

resource_df["food_kits"] = (
    resource_df["affected_population"] *
    np.random.uniform(0.7, 1.2, len(resource_df))
).astype(int)

resource_df["medical_kits"] = (
    (
        resource_df["injuries"] * 3 +
        resource_df["deaths"] * 6
    ) *
    np.random.uniform(1, 2, len(resource_df))
).astype(int)

resource_df["shelters_required"] = np.ceil(
    resource_df["affected_population"] /
    np.random.randint(150, 400, len(resource_df))
).astype(int)

resource_df["rescue_teams"] = np.ceil(
    (
        resource_df["injuries"] +
        resource_df["deaths"]
    ) /
    np.random.uniform(3, 8, len(resource_df))
).astype(int)

resource_df["water_units"] = (
    resource_df["affected_population"] *
    np.random.uniform(2, 5, len(resource_df))
).astype(int)

# =====================================
# SAVE
# =====================================

resource_df.to_csv(
    DATA_DIR / "resource_dataset.csv",
    index=False
)

print(resource_df.head())