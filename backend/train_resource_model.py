from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBRegressor
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor

from xgboost import XGBRegressor

import joblib

df = pd.read_csv(
    "datasets/resource_dataset.csv"
)

X = df[
    [
        "magnitude",
        "affected_population",
        "property_damage",
        "injuries",
        "deaths"
    ]
]

y = df[
    [
        "food_kits",
        "medical_kits",
        "shelters_required",
        "rescue_teams",
        "water_units"
    ]
]

X_train,X_test,y_train,y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = MultiOutputRegressor(
    XGBRegressor(
        n_estimators=300,
        max_depth=8,
        learning_rate=0.05
    )
)

model.fit(
    X_train,
    y_train
)

joblib.dump(
    model,
    "ml_models/resource_model.pkl"
)