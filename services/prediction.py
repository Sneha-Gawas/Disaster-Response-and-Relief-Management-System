import joblib
import numpy as np

# Load trained models
resource_model = joblib.load(
    "ml_models/resource_model.pkl"
)

fund_model = joblib.load(
    "ml_models/fund_model.pkl"
)


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