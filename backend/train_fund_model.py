import pandas as pd

from sklearn.model_selection import train_test_split

from xgboost import XGBRegressor

import joblib

df = pd.read_csv(
    "datasets/fund_dataset.csv"
)

X = df[
    [
        "magnitude",
        "affected_population",
        "property_damage",
        "crop_damage",
        "injuries",
        "deaths"
    ]
]

y = df["relief_fund"]

X_train,X_test,y_train,y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = XGBRegressor(
    n_estimators=500,
    max_depth=8,
    learning_rate=0.05
)

model.fit(
    X_train,
    y_train
)

joblib.dump(
    model,
    "ml_models/fund_model.pkl"
)