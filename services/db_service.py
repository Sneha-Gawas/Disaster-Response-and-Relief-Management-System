import hashlib

from models import ResourcePrediction
from models import FundPrediction
from models import BlockchainTransaction
from models import User


def hash_password(password):
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        b"disaster_salt",
        100000
    ).hex()


def get_user_by_email(db, email):
    return db.query(User).filter(User.email == email).first()


def create_user(db, data):
    row = User(
        full_name=data["full_name"],
        email=data["email"],
        password_hash=hash_password(data["password"]),
        role=data["role"]
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return row


def authenticate_user(db, email, password):
    user = get_user_by_email(db, email)
    if not user:
        return None

    if user.password_hash != hash_password(password):
        return None

    return user


def save_transaction(
        db,
        tx_type,
        tx_hash,
        contract_address):

    row = BlockchainTransaction(

        transaction_type=tx_type,

        transaction_hash=tx_hash,

        blockchain_address=
            contract_address
    )

    db.add(row)

    db.commit()

    db.refresh(row)

    return row

def save_resource_prediction(
        db,
        data):

    row = ResourcePrediction(

        magnitude=data["magnitude"],

        affected_population=data[
            "affected_population"
        ],

        property_damage=data[
            "property_damage"
        ],

        injuries=data["injuries"],

        deaths=data["deaths"],

        food_kits=data["food_kits"],

        medical_kits=data[
            "medical_kits"
        ],

        shelters_required=data[
            "shelters_required"
        ],

        rescue_teams=data[
            "rescue_teams"
        ],

        water_units=data[
            "water_units"
        ]
    )

    db.add(row)

    db.commit()

    db.refresh(row)

    return row


def save_fund_prediction(
        db,
        data):

    row = FundPrediction(

        magnitude=data["magnitude"],

        affected_population=data[
            "affected_population"
        ],

        property_damage=data[
            "property_damage"
        ],

        crop_damage=data[
            "crop_damage"
        ],

        injuries=data["injuries"],

        deaths=data["deaths"],

        required_relief_fund=data[
            "required_relief_fund"
        ]
    )

    db.add(row)

    db.commit()

    db.refresh(row)

    return row