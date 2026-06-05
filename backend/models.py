from sqlalchemy.orm import declarative_base

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

Base = declarative_base()


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True
    )

    full_name = Column(
        String
    )

    email = Column(
        String,
        unique=True
    )

    password_hash = Column(
        String
    )

    role = Column(
        String
    )


class DisasterEvent(Base):

    __tablename__ = "disaster_events"

    id = Column(
        Integer,
        primary_key=True
    )

    place = Column(String)

    magnitude = Column(Float)

    latitude = Column(Float)

    longitude = Column(Float)

    depth = Column(Float)

    cluster_id = Column(Integer)

    anomaly = Column(Integer)


class ResourcePrediction(Base):

    __tablename__ = "resource_predictions"

    id = Column(
        Integer,
        primary_key=True
    )

    magnitude = Column(Float)

    affected_population = Column(Integer)

    property_damage = Column(Float)

    injuries = Column(Integer)

    deaths = Column(Integer)

    food_kits = Column(Float)

    medical_kits = Column(Float)

    shelters_required = Column(Float)

    rescue_teams = Column(Float)

    water_units = Column(Float)


class FundPrediction(Base):

    __tablename__ = "fund_predictions"

    id = Column(
        Integer,
        primary_key=True
    )

    magnitude = Column(Float)

    affected_population = Column(Integer)

    property_damage = Column(Float)

    crop_damage = Column(Float)

    injuries = Column(Integer)

    deaths = Column(Integer)

    required_relief_fund = Column(Float)


class BlockchainTransaction(Base):

    __tablename__ = "blockchain_transactions"

    id = Column(
        Integer,
        primary_key=True
    )

    transaction_type = Column(
        String
    )

    transaction_hash = Column(
        String,
        unique=True
    )

    blockchain_address = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )