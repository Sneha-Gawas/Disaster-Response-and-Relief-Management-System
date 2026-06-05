import pandas as pd

from services.noaa_fetch import (
    fetch_noaa_data
)

noaa = fetch_noaa_data()

resource_df = pd.DataFrame()

resource_df[
    "affected_population"
] = (
    noaa["injuries"] * 20
) + (
    noaa["deaths"] * 100
)

resource_df[
    "property_damage"
] = noaa[
    "property_damage"
]

resource_df[
    "injuries"
] = noaa[
    "injuries"
]

resource_df[
    "deaths"
] = noaa[
    "deaths"
]

resource_df[
    "magnitude"
] = 5

resource_df[
    "food_kits"
] = (
    resource_df[
        "affected_population"
    ] * 3
)

resource_df[
    "medical_kits"
] = (
    resource_df[
        "injuries"
    ] * 2
)

resource_df[
    "shelters_required"
] = (
    resource_df[
        "affected_population"
    ] / 500
)

resource_df[
    "rescue_teams"
] = (
    resource_df[
        "affected_population"
    ] / 1000
)

resource_df[
    "water_units"
] = (
    resource_df[
        "affected_population"
    ] * 3
)

resource_df.to_csv(
    "datasets/resource_dataset.csv",
    index=False
)