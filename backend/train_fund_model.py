import pandas as pd
from pathlib import Path

from sklearn.model_selection import train_test_split

from xgboost import XGBRegressor

import joblib

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "datasets"
MODEL_DIR = BASE_DIR / "ml_models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(
    DATA_DIR / "fund_dataset.csv"
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
    MODEL_DIR / "fund_model.pkl"
)