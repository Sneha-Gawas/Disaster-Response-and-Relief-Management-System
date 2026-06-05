import pandas as pd

from services.noaa_fetch import fetch_noaa_data


noaa = fetch_noaa_data()

# ensure numeric damage/injury/death columns (defensive)
noaa["property_damage"] = pd.to_numeric(noaa["property_damage"], errors="coerce").fillna(0)
noaa["crop_damage"] = pd.to_numeric(noaa["crop_damage"], errors="coerce").fillna(0)
noaa["injuries"] = pd.to_numeric(noaa["injuries"], errors="coerce").fillna(0).astype(int)
noaa["deaths"] = pd.to_numeric(noaa["deaths"], errors="coerce").fillna(0).astype(int)

# create fund_df aligned with the NOAA index
fund_df = pd.DataFrame(index=noaa.index)

# constant/default magnitude per event
fund_df["magnitude"] = 5

# estimate affected population from injuries/deaths
fund_df["affected_population"] = (noaa["injuries"] * 20) + (noaa["deaths"] * 100)

# copy damage and casualty fields
fund_df["property_damage"] = noaa["property_damage"]
fund_df["crop_damage"] = noaa["crop_damage"]
fund_df["injuries"] = noaa["injuries"]
fund_df["deaths"] = noaa["deaths"]

# compute relief fund needed (simple rule)
fund_df["relief_fund"] = (fund_df["property_damage"] * 0.25) + (fund_df["crop_damage"] * 0.10)

# save
fund_df.to_csv("datasets/fund_dataset.csv", index=False)