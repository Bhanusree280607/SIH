import math
from fastapi import APIRouter
from app.schemas import LocationDetectRequest, LocationDetectResponse

router = APIRouter(prefix="/location", tags=["Privacy-Preserving Geolocation"])

# Key agricultural districts of Andhra Pradesh with representative center coordinates
DISTRICT_CENTERS = [
    {
        "district": "Guntur",
        "region": "Coastal Andhra",
        "zone": "Krishna-Godavari Agro-Climatic Zone",
        "lat": 16.3067,
        "lon": 80.4365,
        "soils": ["Black Soil", "Red Loam", "Alluvial"],
        "water": "Canal & Borewell (Nagarjuna Sagar)"
    },
    {
        "district": "Anantapur",
        "region": "Rayalaseema",
        "zone": "Scarce Rainfall Agro-Climatic Zone",
        "lat": 14.6819,
        "lon": 77.6006,
        "soils": ["Red Soil", "Sandy Loam"],
        "water": "Borewell & Rainfed"
    },
    {
        "district": "Kurnool",
        "region": "Rayalaseema",
        "zone": "Scarce Rainfall Agro-Climatic Zone",
        "lat": 15.8281,
        "lon": 78.0373,
        "soils": ["Black Soil", "Red Soil"],
        "water": "Tungabhadra Canal & Borewell"
    },
    {
        "district": "Krishna",
        "region": "Coastal Andhra",
        "zone": "Krishna-Godavari Agro-Climatic Zone",
        "lat": 16.1875,
        "lon": 81.1389,
        "soils": ["Alluvial Soil", "Black Soil"],
        "water": "Prakasam Barrage Canal (Abundant)"
    },
    {
        "district": "West Godavari",
        "region": "Coastal Andhra",
        "zone": "Godavari Delta Agro-Climatic Zone",
        "lat": 16.7107,
        "lon": 81.0952,
        "soils": ["Alluvial Clay", "Loamy"],
        "water": "Godavari Canal Network"
    },
    {
        "district": "Chittoor",
        "region": "Rayalaseema",
        "zone": "Southern Agro-Climatic Zone",
        "lat": 13.2172,
        "lon": 79.1003,
        "soils": ["Red Sandy Loam", "Laterite"],
        "water": "Borewell & Tanks"
    },
    {
        "district": "Visakhapatnam",
        "region": "North Coastal Andhra",
        "zone": "High Altitude & Tribal Agro-Climatic Zone",
        "lat": 17.6868,
        "lon": 83.2185,
        "soils": ["Red Loamy", "Coastal Sands"],
        "water": "Reservoirs & Tanks"
    }
]

def find_nearest_district(lat: float, lon: float):
    best_dist = float("inf")
    best_match = DISTRICT_CENTERS[0]
    for d in DISTRICT_CENTERS:
        # Euclidean approximation for local regional proximity
        dist = math.hypot(lat - d["lat"], lon - d["lon"])
        if dist < best_dist:
            best_dist = dist
            best_match = d
    return best_match

@router.post("/detect-region", response_model=LocationDetectResponse)
def detect_general_region(req: LocationDetectRequest):
    """
    Privacy-by-design:
    Uses browser GPS coordinates solely in-memory to classify the general Agricultural District.
    Exact latitude and longitude are immediately discarded and NEVER stored in the database.
    """
    matched = find_nearest_district(req.latitude, req.longitude)
    
    return LocationDetectResponse(
        state="Andhra Pradesh",
        district=matched["district"],
        region=matched["region"],
        agro_climatic_zone=matched["zone"],
        primary_soil_types=matched["soils"],
        typical_water_source=matched["water"],
        privacy_notice="Privacy Protected: Your exact GPS coordinates were not saved. Only the broad district was identified to tailor crop and scheme recommendations."
    )
