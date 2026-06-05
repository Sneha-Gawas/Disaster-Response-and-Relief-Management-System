from fastapi import FastAPI
from fastapi import Depends
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
import os
from sqlalchemy.orm import Session

from dependencies import get_db

from services.usgs_fetch import (
    fetch_earthquake_data
)

from services.hotspot import (
    detect_hotspots
)

from services.anomaly import (
    detect_anomalies
)

from services.prediction import (
    predict_resources,
    predict_fund
)

from services.db_service import (
    get_user_by_email,
    create_user,
    authenticate_user,
    save_resource_prediction,
    save_fund_prediction,
    save_transaction
)
from services.history_service import (
    get_all_transactions
)

# from blockchain.blockchain_service import (
#     register_disaster,
#     allocate_resources,
#     record_payment,
#     get_disaster,
#     get_resource_allocation,
#     get_payment
# )

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str


class LoginRequest(BaseModel):
    email: str
    password: str


@app.get("/")
def home():

    return {
        "message":
        "AI Powered Blockchain Disaster Response API"
    }


@app.get("/earthquakes")
def earthquakes():

    df = fetch_earthquake_data()

    return df.head(
        50
    ).to_dict(
        orient="records"
    )


@app.get("/hotspots")
def hotspots():

    df = fetch_earthquake_data()

    df = detect_hotspots(df)

    return df[
        [
            "place",
            "cluster_id"
        ]
    ].head(
        50
    ).to_dict(
        orient="records"
    )


@app.get("/anomalies")
def anomalies():

    df = fetch_earthquake_data()

    df = detect_anomalies(df)

    return df[
        [
            "place",
            "anomaly"
        ]
    ].head(
        50
    ).to_dict(
        orient="records"
    )


@app.post("/signup")
def signup(
        request: SignupRequest,
        db: Session = Depends(get_db)
):
    if get_user_by_email(db, request.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    create_user(db, {
        "full_name": request.full_name,
        "email": request.email,
        "password": request.password,
        "role": request.role
    })

    return {
        "message": "User created successfully"
    }


@app.post("/login")
def login(
        request: LoginRequest,
        db: Session = Depends(get_db)
):
    user = authenticate_user(
        db,
        request.email,
        request.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "access_token": "dummy-token",
        "token_type": "bearer"
    }


@app.get("/resource_prediction")
def resource_prediction(

        magnitude: float,

        affected_population: int,

        property_damage: float,

        injuries: int,

        deaths: int,

        db: Session = Depends(get_db)
):

    result = predict_resources(

        magnitude,

        affected_population,

        property_damage,

        injuries,

        deaths
    )

    data = {

        "magnitude":
            magnitude,

        "affected_population":
            affected_population,

        "property_damage":
            property_damage,

        "injuries":
            injuries,

        "deaths":
            deaths,

        "food_kits":
            result["food_kits"],

        "medical_kits":
            result["medical_kits"],

        "shelters_required":
            result["shelters_required"],

        "rescue_teams":
            result["rescue_teams"],

        "water_units":
            result["water_units"]
    }

    save_resource_prediction(
        db,
        data
    )

    return result


@app.get("/fund_prediction")
def fund_prediction(

        magnitude: float,

        affected_population: int,

        property_damage: float,

        crop_damage: float,

        injuries: int,

        deaths: int,

        db: Session = Depends(get_db)
):

    result = predict_fund(

        magnitude,

        affected_population,

        property_damage,

        crop_damage,

        injuries,

        deaths
    )

    data = {

        "magnitude":
            magnitude,

        "affected_population":
            affected_population,

        "property_damage":
            property_damage,

        "crop_damage":
            crop_damage,

        "injuries":
            injuries,

        "deaths":
            deaths,

        "required_relief_fund":
            result["required_relief_fund"]
    }

    save_fund_prediction(
        db,
        data
    )

    return result


@app.get("/register_disaster")
def register_disaster_api(

        location: str,

        magnitude: float,

        db: Session = Depends(get_db)
):

    response = register_disaster(

        location,

        magnitude
    )

    save_transaction(

        db,

        "DISASTER",

        response["tx_hash"],

        response["contract_address"]
    )

    return response


@app.get("/allocate_resources")
def allocate_resources_api(

        disaster_id: int,

        food_kits: int,

        medical_kits: int,

        shelters: int,

        rescue_teams: int,

        db: Session = Depends(get_db)
):

    response = allocate_resources(

        disaster_id,

        food_kits,

        medical_kits,

        shelters,

        rescue_teams
    )

    save_transaction(

        db,

        "RESOURCE",

        response["tx_hash"],

        response["contract_address"]
    )

    return response


# @app.get("/record_payment")
# def record_payment_api(

#         disaster_id: int,

#         amount: int,

#         receiver: str,

#         db: Session = Depends(get_db)
# ):

#     response = record_payment(

#         disaster_id,

#         amount,

#         receiver
#     )

#     save_transaction(

#         db,

#         "PAYMENT",

#         response["tx_hash"],

#         response["contract_address"]
#     )

#     return response


# @app.get("/blockchain/disaster")
# def blockchain_disaster(
#         disaster_id: int):

#     return get_disaster(
#         disaster_id
#     )


# @app.get("/blockchain/resources")
# def blockchain_resources(
#         disaster_id: int):

#     return get_resource_allocation(
#         disaster_id
#     )


# @app.get("/blockchain/payment")
# def blockchain_payment(
#         disaster_id: int):

#     return get_payment(
#         disaster_id
#     )


# @app.get("/transactions")
# def transactions(

#         db: Session = Depends(get_db)
# ):

#     rows = get_all_transactions(
#         db
#     )

#     result = []

#     for row in rows:

#         result.append({

#             "id":
#                 row.id,

#             "transaction_type":
#                 row.transaction_type,

#             "transaction_hash":
#                 row.transaction_hash,

#             "blockchain_address":
#                 row.blockchain_address,

#             "created_at":
#                 row.created_at
#         })

#     return result