from fastapi import FastAPI
from fastapi import Depends
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
import os
import pandas as pd
from sqlalchemy.orm import Session

from dependencies import get_db
from database import engine
from models import Base, User, VolunteerProfile, OrganizationProfile

from services.usgs_fetch import (
    fetch_earthquake_data
)

from services.hotspot import (
    detect_hotspots_with_metrics
)

from services.anomaly import (
    detect_anomalies_with_metrics
)

from services.fema_fetch import (
    fetch_fema_data
)

from services.prediction import (
    predict_resources,
    predict_fund,
    get_resource_model_metrics,
    get_fund_model_metrics
)

from services.db_service import (
    get_user_by_email,
    create_user,
    authenticate_user,
    save_resource_prediction,
    save_fund_prediction,
    save_transaction
)
from services.auth_service import get_current_user, require_roles
from services.jwt_service import create_access_token
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

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

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

    df, hotspot_metrics = detect_hotspots_with_metrics(df)

    selected_columns = [
        "place",
        "latitude",
        "longitude",
        "cluster_id",
        "magnitude"
    ]
    return {
        "hotspots": df[selected_columns].to_dict(orient="records"),
        "hotspots_preview": df[selected_columns].head(200).to_dict(orient="records"),
        "metrics": hotspot_metrics,
        "total_records": len(df)
    }


@app.get("/anomalies")
def anomalies():

    df = fetch_fema_data()

    if "incident_date" in df.columns:
        df["incident_date"] = pd.to_datetime(df["incident_date"], errors="coerce")

    df = df.fillna({
        "disaster_type": "Unknown Disaster",
        "state": "Unknown",
        "county": "Unknown",
        "incident_date": pd.NaT
    })

    df["headline"] = (
        df["disaster_type"].astype(str) +
        " reported in " +
        df["state"].astype(str)
    )

    df["summary"] = (
        "A " +
        df["disaster_type"].astype(str).str.lower() +
        " event affecting " +
        df["county"].astype(str) +
        ", " +
        df["state"].astype(str) +
        "."
    )

    df["published_at"] = df["incident_date"].dt.strftime("%Y-%m-%d")

    df, anomaly_metrics = detect_anomalies_with_metrics(df)

    df = df.sort_values("incident_date", ascending=False)

    return {
        "news": df[
            [
                "headline",
                "summary",
                "state",
                "county",
                "published_at",
                "anomaly"
            ]
        ].head(50).to_dict(orient="records"),
        "source": "FEMA disaster declarations",
        "total_records": len(df),
        "anomaly_count": anomaly_metrics["anomaly_count"],
        "anomaly_rate_percent": anomaly_metrics["anomaly_rate_percent"],
        "anomaly_metrics": anomaly_metrics
    }


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
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id
    }


@app.get("/volunteers")
def list_volunteers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    volunteers = db.query(User).filter(User.role.in_(["VOLUNTEER", "ADMIN", "NGO"])).all()
    result = []
    for user in volunteers:
        profile = db.query(VolunteerProfile).filter(VolunteerProfile.user_id == user.id).first()
        result.append({
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "role": user.role,
            "skills": profile.skills if profile else "General Support",
            "location": profile.location if profile else "Unknown",
            "availability": profile.availability if profile else "Available"
        })
    return result


@app.post("/volunteers")
def create_volunteer(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "NGO"))
):
    existing = get_user_by_email(db, request.get("email", ""))
    if existing:
        raise HTTPException(status_code=400, detail="Volunteer already exists")

    user = create_user(db, {
        "full_name": request.get("name") or request.get("full_name"),
        "email": request.get("email"),
        "password": request.get("password") or "changeme",
        "role": "VOLUNTEER"
    })

    db.add(VolunteerProfile(
        user_id=user.id,
        skills=request.get("skills") or "General Support",
        location=request.get("location") or "Unknown",
        availability=request.get("availability") or "Available"
    ))
    db.commit()

    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role
    }


@app.put("/volunteers/{user_id}")
def update_volunteer(
    user_id: int,
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "NGO", "VOLUNTEER"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    if current_user.role.upper() != "ADMIN" and current_user.id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    if request.get("name"):
        user.full_name = request["name"]
    if request.get("email"):
        user.email = request["email"]

    profile = db.query(VolunteerProfile).filter(VolunteerProfile.user_id == user.id).first()
    if not profile:
        profile = VolunteerProfile(user_id=user.id)
        db.add(profile)

    if request.get("skills"):
        profile.skills = request["skills"]
    if request.get("location"):
        profile.location = request["location"]
    if request.get("availability"):
        profile.availability = request["availability"]

    db.commit()
    return {"message": "Volunteer updated"}


@app.delete("/volunteers/{user_id}")
def delete_volunteer(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "NGO"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    db.query(VolunteerProfile).filter(VolunteerProfile.user_id == user.id).delete()
    db.delete(user)
    db.commit()
    return {"message": "Volunteer deleted"}


@app.get("/organizations")
def list_organizations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    organizations = db.query(User).filter(User.role.in_(["NGO", "ADMIN", "AUTHORITY"])).all()
    result = []
    for user in organizations:
        profile = db.query(OrganizationProfile).filter(OrganizationProfile.user_id == user.id).first()
        result.append({
            "id": user.id,
            "name": user.full_name,
            "location": profile.location if profile else "Unknown",
            "contact": profile.contact if profile else user.email,
            "role": user.role,
            "needs": profile.needs if profile else "",
            "category": profile.category if profile else "General"
        })
    return result


@app.post("/organizations")
def create_organization(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "AUTHORITY", "NGO"))
):
    existing = get_user_by_email(db, request.get("email", ""))
    if existing:
        raise HTTPException(status_code=400, detail="Organization already exists")

    user = create_user(db, {
        "full_name": request.get("name") or request.get("full_name"),
        "email": request.get("email"),
        "password": request.get("password") or "changeme",
        "role": "NGO"
    })

    db.add(OrganizationProfile(
        user_id=user.id,
        location=request.get("location") or "Unknown",
        contact=request.get("contact") or user.email,
        needs=request.get("needs") or "",
        category=request.get("category") or "General"
    ))
    db.commit()

    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role
    }


@app.put("/organizations/{user_id}")
def update_organization(
    user_id: int,
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "AUTHORITY", "NGO"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Organization not found")

    if current_user.role.upper() != "ADMIN" and current_user.id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    if request.get("name"):
        user.full_name = request["name"]
    if request.get("email"):
        user.email = request["email"]

    profile = db.query(OrganizationProfile).filter(OrganizationProfile.user_id == user.id).first()
    if not profile:
        profile = OrganizationProfile(user_id=user.id)
        db.add(profile)

    if request.get("location"):
        profile.location = request["location"]
    if request.get("contact"):
        profile.contact = request["contact"]
    if request.get("needs"):
        profile.needs = request["needs"]
    if request.get("category"):
        profile.category = request["category"]

    db.commit()
    return {"message": "Organization updated"}


@app.delete("/organizations/{user_id}")
def delete_organization(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "AUTHORITY"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Organization not found")
    db.query(OrganizationProfile).filter(OrganizationProfile.user_id == user.id).delete()
    db.delete(user)
    db.commit()
    return {"message": "Organization deleted"}


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

    model_info = get_resource_model_metrics()

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

    return {
        **result,
        "model_info": model_info
    }


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

    model_info = get_fund_model_metrics()

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

    return {
        **result,
        "model_info": model_info
    }


@app.get("/register_disaster")
def register_disaster_api(

        location: str,

        magnitude: float,

        db: Session = Depends(get_db)
):
    try:
        from blockchain.blockchain_service import register_disaster
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Blockchain service unavailable: {exc}") from exc

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
    try:
        from blockchain.blockchain_service import allocate_resources
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Blockchain service unavailable: {exc}") from exc

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