import pandas as pd

USGS_URL = (
    "https://earthquake.usgs.gov/"
    "earthquakes/feed/v1.0/"
    "summary/all_month.csv"
)


def fetch_earthquake_data():
    # read remote CSV and coerce numeric fields
    df = pd.read_csv(USGS_URL)

    # some feeds use 'mag' and include coordinates; coerce and drop invalid rows
    expected = ["place", "mag", "latitude", "longitude", "depth"]
    available = [c for c in expected if c in df.columns]
    df = df[available]

    # normalize column names
    rename_map = {}
    if "mag" in df.columns:
        rename_map["mag"] = "magnitude"
    if "latitude" in df.columns:
        rename_map["latitude"] = "latitude"
    if "longitude" in df.columns:
        rename_map["longitude"] = "longitude"
    if "depth" in df.columns:
        rename_map["depth"] = "depth"
    df = df.rename(columns=rename_map)

    # coerce numeric fields
    if "magnitude" in df.columns:
        df["magnitude"] = pd.to_numeric(df["magnitude"], errors="coerce")
    if "latitude" in df.columns:
        df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
    if "longitude" in df.columns:
        df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")
    if "depth" in df.columns:
        df["depth"] = pd.to_numeric(df["depth"], errors="coerce")

    # drop rows that lack essential numeric info
    if "magnitude" in df.columns:
        df = df[df["magnitude"].notna()]

    df = df.fillna({
        "place": "unknown",
    })

    return df
