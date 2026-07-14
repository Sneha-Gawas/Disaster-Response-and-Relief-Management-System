import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "datasets"

# Load trained models
resource_model = joblib.load(
    BASE_DIR / "ml_models" / "resource_model.pkl"
)

fund_model = joblib.load(
    BASE_DIR / "ml_models" / "fund_model.pkl"
)


def _load_resource_dataset():
    df = pd.read_csv(DATA_DIR / "resource_dataset.csv")
    X = df[[
        "magnitude",
        "affected_population",
        "property_damage",
        "injuries",
        "deaths"
    ]]
    y = df[[
        "food_kits",
        "medical_kits",
        "shelters_required",
        "rescue_teams",
        "water_units"
    ]]
    return X, y


def _load_fund_dataset():
    df = pd.read_csv(DATA_DIR / "fund_dataset.csv")
    X = df[[
        "magnitude",
        "affected_population",
        "property_damage",
        "crop_damage",
        "injuries",
        "deaths"
    ]]
    y = df["relief_fund"]
    return X, y


def get_resource_model_metrics():
    X, y = _load_resource_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    y_pred = resource_model.predict(X_test)
    return {
        "model": "XGBoost MultiOutputRegressor",
        "r2_score": round(r2_score(y_test, y_pred, multioutput='uniform_average'), 4),
        "mae": round(mean_absolute_error(y_test, y_pred, multioutput='uniform_average'), 2),
        "rmse": round(np.sqrt(mean_squared_error(y_test, y_pred, multioutput='uniform_average')), 2),
        "note": "Test set evaluation using hold-out split"
    }


def get_fund_model_metrics():
    X, y = _load_fund_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    y_pred = fund_model.predict(X_test)
    return {
        "model": "XGBoost Regressor",
        "r2_score": round(r2_score(y_test, y_pred), 4),
        "mae": round(mean_absolute_error(y_test, y_pred), 2),
        "rmse": round(np.sqrt(mean_squared_error(y_test, y_pred)), 2),
        "note": "Test set evaluation using hold-out split"
    }


def predict_resources(
        magnitude,
        affected_population,
        property_damage,
        injuries,
        deaths):

    input_data = np.array([
        [
            magnitude,
            affected_population,
            property_damage,
            injuries,
            deaths
        ]
    ])

    prediction = resource_model.predict(
        input_data
    )

    return {
        "food_kits": float(prediction[0][0]),
        "medical_kits": float(prediction[0][1]),
        "shelters_required": float(prediction[0][2]),
        "rescue_teams": float(prediction[0][3]),
        "water_units": float(prediction[0][4])
    }


def predict_fund(
        magnitude,
        affected_population,
        property_damage,
        crop_damage,
        injuries,
        deaths):

    input_data = np.array([
        [
            magnitude,
            affected_population,
            property_damage,
            crop_damage,
            injuries,
            deaths
        ]
    ])

    prediction = fund_model.predict(
        input_data
    )

    return {
        "required_relief_fund": float(
            prediction[0]
        )
    }