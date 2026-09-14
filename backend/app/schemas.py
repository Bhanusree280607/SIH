import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# --- Auth & Farmer Schemas ---
class FarmerCreate(BaseModel):
    name: str
    mobile: str
    password: str
    preferred_language: str = "te"
    state: str = "Andhra Pradesh"
    district: str = "Guntur"
    region: Optional[str] = "Coastal Andhra"
    soil_type: str = "Black Soil"
    water_availability: str = "Canal & Borewell"
    farming_experience: Optional[str] = "5-10 years"

class FarmerLogin(BaseModel):
    mobile: str
    password: str

class FarmerUpdate(BaseModel):
    name: Optional[str] = None
    preferred_language: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    region: Optional[str] = None
    soil_type: Optional[str] = None
    water_availability: Optional[str] = None
    farming_experience: Optional[str] = None

class FarmerResponse(BaseModel):
    id: int
    name: str
    mobile: str
    preferred_language: str
    state: str
    district: str
    region: Optional[str]
    soil_type: str
    water_availability: str
    farming_experience: Optional[str]
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: int
    username: str
    full_name: str
    role: str
    department: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_type: str  # farmer or admin
    user: Any

# --- Crop & Recommendation Schemas ---
class CropResponse(BaseModel):
    id: int
    name: str
    telugu_name: str
    hindi_name: Optional[str]
    season: str
    soil_types: str
    water_requirement: str
    ideal_ph: Optional[str]
    duration_days: int
    base_yield_quintal: float
    demand_level: str
    production_trend: str
    market_price_per_quintal: float
    description: Optional[str]
    telugu_description: Optional[str]
    important_considerations: Optional[str]
    telugu_considerations: Optional[str]

    class Config:
        from_attributes = True

class CropRecommendationRequest(BaseModel):
    district: str = "Guntur"
    state: str = "Andhra Pradesh"
    soil_type: str = "Black Soil"
    water_availability: str = "Canal & Borewell"
    season: str = "Kharif"
    previous_crop: Optional[str] = None
    expected_acreage: Optional[float] = 2.0

class ScoreBreakdown(BaseModel):
    soil_match_score: int
    water_match_score: int
    season_match_score: int
    regional_suitability_score: int
    market_demand_score: int
    profitability_score: int

class CropRecommendation(BaseModel):
    crop_id: int
    crop_name: str
    telugu_name: str
    hindi_name: Optional[str]
    suitability_score: int
    reasons: List[str]
    telugu_reasons: List[str]
    soil_requirement: str
    water_requirement: str
    season: str
    market_demand: str
    production_trend: str
    market_price_per_quintal: float
    estimated_yield_per_acre: float
    important_considerations: str
    telugu_considerations: str
    breakdown: ScoreBreakdown

# --- Production Schemas ---
class ProductionCreate(BaseModel):
    crop_name: str
    season: str = "Kharif"
    area_acres: float = 2.0
    expected_quantity_quintals: float
    current_harvested_quintals: float = 0.0
    planting_date: Optional[str] = None
    expected_harvest_date: Optional[str] = None
    status: str = "Growing"

class ProductionUpdate(BaseModel):
    expected_quantity_quintals: Optional[float] = None
    current_harvested_quintals: Optional[float] = None
    planting_date: Optional[str] = None
    expected_harvest_date: Optional[str] = None
    status: Optional[str] = None

class ProductionResponse(BaseModel):
    id: int
    farmer_id: int
    crop_name: str
    season: str
    area_acres: float
    expected_quantity_quintals: float
    current_harvested_quintals: float
    planting_date: Optional[str]
    expected_harvest_date: Optional[str]
    status: str
    surplus_predicted: float
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- Buyer & Market Schemas ---
class BuyerResponse(BaseModel):
    id: int
    name: str
    buyer_type: str
    crops_required: str
    region: str
    district: str
    state: str
    quantity_required_quintals: float
    indicative_price_per_quintal: float
    demand_level: str
    contact_phone: str
    email: Optional[str]
    verified_badge: bool

    class Config:
        from_attributes = True

class BuyerContactRequest(BaseModel):
    buyer_id: int
    farmer_name: str
    farmer_mobile: str
    crop_name: str
    quantity_offered_quintals: float
    message: Optional[str] = None

# --- Government Scheme Schemas ---
class SchemeResponse(BaseModel):
    id: int
    scheme_name: str
    telugu_name: str
    hindi_name: Optional[str]
    state: str
    category: str
    benefits: str
    telugu_benefits: Optional[str]
    eligibility: str
    telugu_eligibility: Optional[str]
    documents_required: str
    application_process: str
    official_url: str
    helpline: str

    class Config:
        from_attributes = True

# --- AI Assistant Schemas ---
class AIQuestionRequest(BaseModel):
    question: str
    language: str = "te"  # te, en, hi, ta, kn, ml, mr
    farmer_context: Optional[Dict[str, Any]] = None

class AIAnswerResponse(BaseModel):
    answer: str
    telugu_answer: Optional[str] = None
    language: str
    voice_friendly_text: str
    suggestions: List[str]
    grounded_source: Optional[str] = None

# --- Location Detection Schema (Zero GPS Coordinate Storage) ---
class LocationDetectRequest(BaseModel):
    latitude: float
    longitude: float

class LocationDetectResponse(BaseModel):
    state: str
    district: str
    region: str
    agro_climatic_zone: str
    primary_soil_types: List[str]
    typical_water_source: str
    privacy_notice: str

# --- Admin Analytics Schemas ---
class RegionalCropProduction(BaseModel):
    crop_name: str
    total_production_quintals: float
    percentage_share: float

class RegionalSurplusShortage(BaseModel):
    district: str
    crop: str
    status: str  # Surplus, Shortage, Balanced
    net_quintals: float

class AdminAnalyticsResponse(BaseModel):
    total_registered_farmers: int
    total_active_crops_cultivated: int
    total_expected_production_quintals: float
    total_verified_buyers: int
    top_produced_crops: List[RegionalCropProduction]
    surplus_shortage_records: List[RegionalSurplusShortage]
    crop_demand_trends: List[Dict[str, Any]]
    policy_planning_insights: List[Dict[str, str]]
