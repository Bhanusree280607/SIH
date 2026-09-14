import {
  FarmerProfile,
  AdminUser,
  CropRecommendation,
  ProductionRecord,
  Buyer,
  GovernmentScheme,
  AIAnswerResponse,
  LocationDetectResponse,
  AdminAnalyticsResponse
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('rythu_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // --- Auth ---
  async loginFarmer(mobile: string, password: string): Promise<{ access_token: string; user: FarmerProfile }> {
    const res = await fetch(`${API_BASE}/auth/farmer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async registerFarmer(data: Partial<FarmerProfile> & { password: string }): Promise<{ access_token: string; user: FarmerProfile }> {
    const res = await fetch(`${API_BASE}/auth/farmer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async loginAdmin(username: string, password: string): Promise<{ access_token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Admin login failed' }));
      throw new Error(err.detail || 'Admin login failed');
    }
    return res.json();
  },

  async getFarmerProfile(): Promise<FarmerProfile> {
    const res = await fetch(`${API_BASE}/auth/farmer/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Could not fetch profile');
    return res.json();
  },

  async updateFarmerProfile(data: Partial<FarmerProfile>): Promise<FarmerProfile> {
    const res = await fetch(`${API_BASE}/auth/farmer/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Could not update profile');
    return res.json();
  },

  // --- Crop Recommendation ---
  async getRecommendations(params: {
    district: string;
    state?: string;
    soil_type: string;
    water_availability: string;
    season: string;
    expected_acreage?: number;
  }): Promise<CropRecommendation[]> {
    const res = await fetch(`${API_BASE}/crops/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to get crop recommendations');
    return res.json();
  },

  // --- Production Tracking ---
  async getProductions(): Promise<ProductionRecord[]> {
    const res = await fetch(`${API_BASE}/production`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to load production records');
    return res.json();
  },

  async createProduction(record: Omit<ProductionRecord, 'id' | 'farmer_id' | 'surplus_predicted' | 'updated_at'>): Promise<ProductionRecord> {
    const res = await fetch(`${API_BASE}/production`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error('Failed to create production record');
    return res.json();
  },

  async updateProduction(id: number, data: Partial<ProductionRecord>): Promise<ProductionRecord> {
    const res = await fetch(`${API_BASE}/production/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update record');
    return res.json();
  },

  async deleteProduction(id: number): Promise<void> {
    await fetch(`${API_BASE}/production/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  // --- Market & Buyers ---
  async getBuyers(filters?: { crop?: string; region?: string; buyer_type?: string }): Promise<Buyer[]> {
    const query = new URLSearchParams();
    if (filters?.crop) query.append('crop', filters.crop);
    if (filters?.region) query.append('region', filters.region);
    if (filters?.buyer_type) query.append('buyer_type', filters.buyer_type);

    const res = await fetch(`${API_BASE}/buyers?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load buyers');
    return res.json();
  },

  async contactBuyer(data: {
    buyer_id: number;
    farmer_name: string;
    farmer_mobile: string;
    crop_name: string;
    quantity_offered_quintals: number;
    message?: string;
  }): Promise<{ status: string; message: string; buyer_name: string; buyer_contact: string }> {
    const res = await fetch(`${API_BASE}/buyers/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // --- Government Schemes ---
  async getSchemes(filters?: { state?: string; category?: string; search?: string }): Promise<GovernmentScheme[]> {
    const query = new URLSearchParams();
    if (filters?.state) query.append('state', filters.state);
    if (filters?.category) query.append('category', filters.category);
    if (filters?.search) query.append('search', filters.search);

    const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load schemes');
    return res.json();
  },

  // --- AI Voice Assistant ---
  async askAI(question: string, language: string, context?: Record<string, any>): Promise<AIAnswerResponse> {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, language, farmer_context: context })
    });
    if (!res.ok) throw new Error('AI consultation failed');
    return res.json();
  },

  // --- Privacy Geolocation ---
  async detectRegion(latitude: number, longitude: number): Promise<LocationDetectResponse> {
    const res = await fetch(`${API_BASE}/location/detect-region`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude })
    });
    if (!res.ok) throw new Error('Region detection failed');
    return res.json();
  },

  // --- Admin Analytics ---
  async getAdminAnalytics(): Promise<AdminAnalyticsResponse> {
    const res = await fetch(`${API_BASE}/admin/analytics`);
    if (!res.ok) throw new Error('Failed to load admin analytics');
    return res.json();
  }
};
