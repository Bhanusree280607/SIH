import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    mobile = Column(String(15), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    preferred_language = Column(String(10), default="te")  # Default Telugu
    state = Column(String(50), default="Andhra Pradesh")
    district = Column(String(50), default="Guntur")
    region = Column(String(100), default="Coastal Andhra")
    soil_type = Column(String(50), default="Black Soil")
    water_availability = Column(String(50), default="Canal & Borewell")
    farming_experience = Column(String(50), default="5-10 years")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    productions = relationship("ProductionRecord", back_populates="farmer", cascade="all, delete-orphan")

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(50), default="Agricultural Officer")
    department = Column(String(100), default="Department of Agriculture, AP")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    telugu_name = Column(String(100), nullable=False)
    hindi_name = Column(String(100), nullable=True)
    season = Column(String(50), nullable=False)  # Kharif, Rabi, Zaid, All Season
    soil_types = Column(String(255), nullable=False)  # comma separated: Red Soil, Black Soil, Sandy Loam
    water_requirement = Column(String(50), nullable=False)  # Low, Moderate, High
    ideal_ph = Column(String(20), default="6.0 - 7.5")
    duration_days = Column(Integer, default=120)
    base_yield_quintal = Column(Float, default=20.0)  # quintals per acre
    demand_level = Column(String(50), default="High")  # High, Moderate, Low
    production_trend = Column(String(50), default="Increasing")  # Increasing, Stable, Decreasing
    market_price_per_quintal = Column(Float, default=6500.0)  # indicative price INR
    description = Column(Text, nullable=True)
    telugu_description = Column(Text, nullable=True)
    important_considerations = Column(Text, nullable=True)
    telugu_considerations = Column(Text, nullable=True)

class ProductionRecord(Base):
    __tablename__ = "production_records"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    crop_name = Column(String(100), nullable=False)
    season = Column(String(50), default="Kharif")
    area_acres = Column(Float, default=2.0)  # General area without exact parcel/boundary tracking
    expected_quantity_quintals = Column(Float, nullable=False)
    current_harvested_quintals = Column(Float, default=0.0)
    planting_date = Column(String(20), nullable=True)
    expected_harvest_date = Column(String(20), nullable=True)
    status = Column(String(50), default="Growing")  # Sown, Growing, Flowering, Harvesting, Completed
    surplus_predicted = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    farmer = relationship("Farmer", back_populates="productions")

class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    buyer_type = Column(String(50), nullable=False)  # Food Processor, Wholesaler, Exporter, APMC Mandi, Dal Mill, Oil Mill
    crops_required = Column(String(255), nullable=False)  # comma separated
    region = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Andhra Pradesh")
    quantity_required_quintals = Column(Float, nullable=False)
    indicative_price_per_quintal = Column(Float, nullable=False)
    demand_level = Column(String(50), default="High")
    contact_phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    verified_badge = Column(Boolean, default=True)

class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String(200), nullable=False)
    telugu_name = Column(String(200), nullable=False)
    hindi_name = Column(String(200), nullable=True)
    state = Column(String(50), default="All India")  # All India, Andhra Pradesh, Telangana
    category = Column(String(100), nullable=False)  # Financial Support, Crop Insurance, Irrigation, Machinery, Organic Farming
    benefits = Column(Text, nullable=False)
    telugu_benefits = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=False)
    telugu_eligibility = Column(Text, nullable=True)
    documents_required = Column(Text, nullable=False)
    application_process = Column(Text, nullable=False)
    official_url = Column(String(255), nullable=False)
    helpline = Column(String(50), default="1800-180-1551 (Kisan Call Centre)")

class RegionalAgriData(Base):
    __tablename__ = "regional_agri_data"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(50), default="Andhra Pradesh")
    district = Column(String(50), nullable=False)
    crop_name = Column(String(100), nullable=False)
    total_estimated_production = Column(Float, default=0.0)  # in 1000 Quintals
    demand_index = Column(Float, default=1.0)  # Ratio of demand vs historical
    surplus_status = Column(String(50), default="Balanced")  # Surplus, Shortage, Balanced
    price_trend = Column(String(50), default="Increasing")  # Increasing, Stable, Decreasing
