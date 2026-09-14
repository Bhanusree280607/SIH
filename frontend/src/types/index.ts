export type LanguageCode = 'te' | 'en' | 'hi' | 'ta' | 'kn' | 'ml' | 'mr';

export interface FarmerProfile {
  id: number;
  name: string;
  mobile: string;
  preferred_language: LanguageCode;
  state: string;
  district: string;
  region?: string;
  soil_type: string;
  water_availability: string;
  farming_experience?: string;
  created_at?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  full_name: string;
  role: string;
  department: string;
}

export interface ScoreBreakdown {
  soil_match_score: number;
  water_match_score: number;
  season_match_score: number;
  regional_suitability_score: number;
  market_demand_score: number;
  profitability_score: number;
}

export interface CropRecommendation {
  crop_id: number;
  crop_name: string;
  telugu_name: string;
  hindi_name?: string;
  suitability_score: number;
  reasons: string[];
  telugu_reasons: string[];
  soil_requirement: string;
  water_requirement: string;
  season: string;
  market_demand: string;
  production_trend: string;
  market_price_per_quintal: number;
  estimated_yield_per_acre: number;
  important_considerations: string;
  telugu_considerations: string;
  breakdown: ScoreBreakdown;
}

export interface ProductionRecord {
  id: number;
  farmer_id: number;
  crop_name: string;
  season: string;
  area_acres: number;
  expected_quantity_quintals: number;
  current_harvested_quintals: number;
  planting_date?: string;
  expected_harvest_date?: string;
  status: string;
  surplus_predicted: number;
  updated_at?: string;
}

export interface Buyer {
  id: number;
  name: string;
  buyer_type: string;
  crops_required: string;
  region: string;
  district: string;
  state: string;
  quantity_required_quintals: number;
  indicative_price_per_quintal: number;
  demand_level: string;
  contact_phone: string;
  email?: string;
  verified_badge: boolean;
}

export interface GovernmentScheme {
  id: number;
  scheme_name: string;
  telugu_name: string;
  hindi_name?: string;
  state: string;
  category: string;
  benefits: string;
  telugu_benefits?: string;
  eligibility: string;
  telugu_eligibility?: string;
  documents_required: string;
  application_process: string;
  official_url: string;
  helpline: string;
}

export interface AIAnswerResponse {
  answer: string;
  telugu_answer?: string;
  language: string;
  voice_friendly_text: string;
  suggestions: string[];
  grounded_source?: string;
}

export interface LocationDetectResponse {
  state: string;
  district: string;
  region: string;
  agro_climatic_zone: string;
  primary_soil_types: string[];
  typical_water_source: string;
  privacy_notice: string;
}

export interface RegionalCropProduction {
  crop_name: string;
  total_production_quintals: number;
  percentage_share: number;
}

export interface RegionalSurplusShortage {
  district: string;
  crop: string;
  status: string;
  net_quintals: number;
}

export interface AdminAnalyticsResponse {
  total_registered_farmers: number;
  total_active_crops_cultivated: number;
  total_expected_production_quintals: number;
  total_verified_buyers: number;
  top_produced_crops: RegionalCropProduction[];
  surplus_shortage_records: RegionalSurplusShortage[];
  crop_demand_trends: Array<{
    crop: string;
    telugu_name: string;
    demand: string;
    trend: string;
    avg_market_price: number;
    msp_benchmark: number;
  }>;
  policy_planning_insights: Array<{
    title: string;
    category: string;
    message: string;
  }>;
}
