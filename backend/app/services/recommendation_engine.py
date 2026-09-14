from typing import List, Dict, Any
from app.models import Crop
from app.schemas import CropRecommendation, ScoreBreakdown

# Regional Agro-Climatic affinities for Andhra Pradesh & South India
REGION_AFFINITIES = {
    "Anantapur": ["Groundnut", "Bengal Gram", "Red Gram", "Maize", "Millets"],
    "Kurnool": ["Cotton", "Bengal Gram", "Groundnut", "Chilli", "Paddy"],
    "Guntur": ["Chilli", "Cotton", "Paddy", "Tobacco", "Maize", "Red Gram"],
    "Krishna": ["Paddy", "Cotton", "Black Gram", "Sugarcane", "Maize"],
    "West Godavari": ["Paddy", "Maize", "Sugarcane", "Chilli", "Cocoa"],
    "East Godavari": ["Paddy", "Cashew", "Maize", "Oil Palm"],
    "Prakasam": ["Tobacco", "Chilli", "Cotton", "Bengal Gram", "Red Gram"],
    "Chittoor": ["Groundnut", "Tomato", "Mango", "Sugarcane"],
    "Visakhapatnam": ["Paddy", "Coffee", "Cashew", "Millets"]
}

def calculate_crop_score(
    crop: Crop,
    district: str,
    soil_type: str,
    water_availability: str,
    season: str
) -> Dict[str, Any]:
    """
    Transparent Multi-Factor Scoring Engine:
    - Soil Match: 25%
    - Water Match: 20%
    - Season Match: 20%
    - Regional Match: 15%
    - Market Demand: 10%
    - Profitability / Price Trend: 10%
    Total = 100
    """
    reasons_en = []
    reasons_te = []

    # 1. Soil Match (Max 25 pts)
    soil_score = 10
    crop_soils = [s.strip().lower() for s in crop.soil_types.split(",")]
    farmer_soil = soil_type.strip().lower()

    if any(farmer_soil in s or s in farmer_soil for s in crop_soils):
        soil_score = 25
        reasons_en.append(f"Ideal soil compatibility: {crop.name} thrives exceptionally in {soil_type}.")
        reasons_te.append(f"మట్టి అనుకూలత: {crop.telugu_name} పంట {soil_type} లో అధిక దిగుబడిని ఇస్తుంది.")
    elif "loam" in farmer_soil or "mixed" in farmer_soil:
        soil_score = 18
        reasons_en.append(f"Moderate soil compatibility with {soil_type}.")
        reasons_te.append(f"{soil_type} లో ఈ పంట సాధారణ పెరుగుదలకు అనుకూలం.")
    else:
        soil_score = 12
        reasons_en.append(f"Can grow in {soil_type} with proper organic matter/manure enrichment.")
        reasons_te.append(f"{soil_type} లో సేంద్రీయ ఎరువులు అందించడం ద్వారా సాగు చేయవచ్చు.")

    # 2. Water Availability Match (Max 20 pts)
    water_score = 10
    w_avail = water_availability.lower()
    c_req = crop.water_requirement.lower()

    if "high" in c_req:
        if "canal" in w_avail or "abundant" in w_avail or "river" in w_avail:
            water_score = 20
            reasons_en.append("Excellent water availability matching this water-intensive crop.")
            reasons_te.append(f"నీటి లభ్యత: కాలువ / సమృద్ధి నీటి లభ్యత ఉన్నందున {crop.telugu_name} కి సరిగ్గా సరిపోతుంది.")
        elif "borewell" in w_avail:
            water_score = 14
            reasons_en.append("Borewell irrigation is manageable if monitored.")
            reasons_te.append("బోరుబావి నీటితో క్రమబద్ధమైన తడులు అవసరం.")
        else:
            water_score = 6
            reasons_en.append("Water supply may be insufficient for high-water requirements.")
            reasons_te.append("ఈ పంటకు అధిక నీరు అవసరం, వర్షాధారంగా సాగు రిస్క్ ఎక్కువ.")
    elif "moderate" in c_req:
        if "borewell" in w_avail or "canal" in w_avail or "drip" in w_avail:
            water_score = 20
            reasons_en.append("Optimal water conditions for moderate irrigation.")
            reasons_te.append("మితమైన నీటి వనరులకు ఈ పంట బాగా అనుకూలం.")
        else:
            water_score = 14
            reasons_en.append("Good resilience to slight water stress.")
            reasons_te.append("తక్కువ నీటి ఎద్దడిని కూడా తట్టుకోగలదు.")
    else:  # Low water requirement
        water_score = 20
        reasons_en.append(f"Drought-hardy crop: requires minimal water, ideal for current availability.")
        reasons_te.append(f"తక్కువ నీరు అవసరం: కరువును తట్టుకుని మంచి దిగుబడిని ఇస్తుంది.")

    # 3. Season Match (Max 20 pts)
    season_score = 10
    c_season = crop.season.lower()
    f_season = season.lower()

    if "all" in c_season or f_season in c_season:
        season_score = 20
        reasons_en.append(f"Currently in prime sowing window for {season} season.")
        reasons_te.append(f"ప్రస్తుత {season} సీజన్ విత్తే సమయానికి ఖచ్చితంగా సరిపోతుంది.")
    elif "kharif" in c_season and "kharif" in f_season:
        season_score = 20
        reasons_en.append("Monsoon Kharif climatic temperature and humidity are optimal.")
        reasons_te.append("ఖరీఫ్ వర్షాకాల వాతావరణం ఈ పంటకు అనుకూలమైనది.")
    else:
        season_score = 8
        reasons_en.append(f"Off-season sowing requires controlled micro-climate or protective irrigation.")
        reasons_te.append("ఈ సీజన్‌లో ప్రత్యేక యాజమాన్య పద్ధతులు పాటించాలి.")

    # 4. Regional Agro-Climatic Suitability (Max 15 pts)
    region_score = 8
    best_crops_for_district = REGION_AFFINITIES.get(district, [])
    if crop.name in best_crops_for_district:
        region_score = 15
        reasons_en.append(f"Strong regional track record with proven high yields in {district} district.")
        reasons_te.append(f"{district} జిల్లా వ్యవసాయ వాతావరణంలో అత్యధిక దిగుబడులు సాధించిన నిరూపితమైన పంట.")
    else:
        region_score = 10
        reasons_en.append(f"Adaptable to agro-climatic conditions across Andhra Pradesh.")
        reasons_te.append(f"రాష్ట్రంలోని విస్తృత వాతావరణ పరిస్థితులకు అనుకూలమైనది.")

    # 5. Market Demand Level (Max 10 pts)
    demand_score = 6
    if crop.demand_level == "High":
        demand_score = 10
        reasons_en.append(f"High procurement demand from wholesale buyers and processors (₹{crop.market_price_per_quintal:,.0f}/Qtl).")
        reasons_te.append(f"మార్కెట్ డిమాండ్: స్థానిక కొనుగోలుదారులు మరియు ఎగుమతిదారుల నుండి అధిక గిరాకీ ఉంది (క్వింటాలుకు దాదాపు ₹{crop.market_price_per_quintal:,.0f}).")
    elif crop.demand_level == "Moderate":
        demand_score = 8
        reasons_en.append(f"Steady year-round market price stability.")
        reasons_te.append("మార్కెట్లో స్థిరమైన ధర మరియు సాధారణ డిమాండ్ ఉంది.")
    else:
        demand_score = 5

    # 6. Profitability / Production Trend (Max 10 pts)
    profit_score = 5
    if crop.production_trend == "Increasing":
        profit_score = 10
        reasons_en.append("Expanding processing industries and export demand boosting farmer profits.")
        reasons_te.append("ఫుడ్ ప్రాసెసింగ్ యూనిట్లు విస్తరిస్తుండటంతో రైతుకు లాభదాయకమైన మార్జిన్ లభిస్తుంది.")
    elif crop.production_trend == "Stable":
        profit_score = 8
        reasons_en.append("Reliable return on investment with minimal price volatility.")
        reasons_te.append("పెట్టుబడికి తగ్గ స్థిరమైన రాబడి హామీ ఉంటుంది.")
    else:
        profit_score = 5

    total_score = soil_score + water_score + season_score + region_score + demand_score + profit_score
    # Cap between 40 and 98 to remain realistic
    total_score = max(45, min(total_score, 98))

    breakdown = ScoreBreakdown(
        soil_match_score=soil_score,
        water_match_score=water_score,
        season_match_score=season_score,
        regional_suitability_score=region_score,
        market_demand_score=demand_score,
        profitability_score=profit_score
    )

    return {
        "score": total_score,
        "reasons_en": reasons_en,
        "reasons_te": reasons_te,
        "breakdown": breakdown
    }

def generate_recommendations(
    crops: List[Crop],
    district: str,
    soil_type: str,
    water_availability: str,
    season: str,
    expected_acreage: float = 2.0
) -> List[CropRecommendation]:
    recommendations = []

    for crop in crops:
        scored = calculate_crop_score(
            crop=crop,
            district=district,
            soil_type=soil_type,
            water_availability=water_availability,
            season=season
        )

        rec = CropRecommendation(
            crop_id=crop.id,
            crop_name=crop.name,
            telugu_name=crop.telugu_name,
            hindi_name=crop.hindi_name,
            suitability_score=scored["score"],
            reasons=scored["reasons_en"],
            telugu_reasons=scored["reasons_te"],
            soil_requirement=crop.soil_types,
            water_requirement=crop.water_requirement,
            season=crop.season,
            market_demand=crop.demand_level,
            production_trend=crop.production_trend,
            market_price_per_quintal=crop.market_price_per_quintal,
            estimated_yield_per_acre=crop.base_yield_quintal,
            important_considerations=crop.important_considerations or "Ensure seed treatment and integrated pest management.",
            telugu_considerations=crop.telugu_considerations or "విత్తన శుద్ధి మరియు సమగ్ర సస్యరక్షణ చర్యలు పాటించండి.",
            breakdown=scored["breakdown"]
        )
        recommendations.append(rec)

    # Sort descending by suitability score
    recommendations.sort(key=lambda x: x.suitability_score, reverse=True)
    return recommendations
