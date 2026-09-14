# RythuMithra (రైతుమిత్ర / किसानमित्र)
## AI-Powered Farmer Support Platform • Smart India Hackathon (SIH 26193)

> **Empowering Indian Farmers with Artificial Intelligence, Crop Intelligence, Direct Market Linkages, Verified Government Schemes, and Multi-lingual Voice Interaction.**

---

## 🌾 Project Overview

**RythuMithra** is a modern, responsive, farmer-first agricultural technology platform designed for **Smart India Hackathon Problem Statement 26193**. It bridges the gap between rural farmers, agricultural data, market buyers, and government welfare programs through an accessible, voice-first, multi-lingual digital platform.

The platform is purpose-built for low digital literacy farmers with large high-contrast visual cards, voice speech recognition/audio playback, transparent crop suitability scoring, and strict **privacy-by-design** geolocation (zero exact GPS/boundary storage).

---

## 🎯 Key Features & Modules

### 1. 🌱 Transparent Crop Recommendation Engine
- **No Black Box**: Calculates explainable crop suitability scores (0–100%) using a multi-factor transparent formula:
  $$\text{Score} = w_{\text{soil}} \cdot S_{\text{soil}} + w_{\text{water}} \cdot S_{\text{water}} + w_{\text{season}} \cdot S_{\text{season}} + w_{\text{region}} \cdot S_{\text{region}} + w_{\text{demand}} \cdot S_{\text{demand}} + w_{\text{profit}} \cdot S_{\text{profit}}$$
- Provides clear bullet-point justifications in simple Telugu and English.
- Features an instant **"Ask AI Why?"** button for audio-guided reasoning.

### 2. 🎙 Multi-lingual AI Voice Assistant
- Floating omnipresent microphone button with real-time audio pulse animation.
- Web Speech Recognition API (Speech-to-Text) and Speech Synthesis (Text-to-Speech) calibrated for Indian accents.
- Deep priority support for **Telugu (`te-IN`)** along with English, Hindi, Tamil, Kannada, Malayalam, and Marathi.
- Context-aware answers considering the farmer's district, soil type, and current crops.
- Grounded factual responses citing verified agricultural institutions (ANGRAU / ICAR / Ministry of Agriculture).

### 3. 📊 Farmer Production & Harvest Tracking
- Track active crops from sowing to harvesting.
- Visual timeline progress bars for harvested quintals vs expected yield.
- Commercial surplus calculator estimating marketable volume for wholesale selling.

### 4. 🛒 Direct Buyer & Marketplace Linkage
- Direct connection to verified food processors, dal mills, oil mills, exporters, and government APMC / e-NAM mandis.
- Real-time indicative prices per quintal and procurement quantities required.
- Filter by crop, district, and buyer type with one-click direct quote dispatch and direct phone dialer.

### 5. 🏛 Verified Government Schemes Directory
- Authenticated central and Andhra Pradesh state agricultural welfare schemes (PM-KISAN, YSR Rythu Bharosa, PMFBY, PMKSY/APMIP, SMAM, e-NAM, Soil Health Card).
- Strict veracity: Zero fabricated schemes or URLs. Direct links to official `.gov.in` portals.
- Concise eligibility checklist, required documents guide, and toll-free farmer helpline numbers.

### 6. 📍 Privacy-Preserving Geolocation (Privacy-by-Design)
- Browser geolocation reverse-geocodes latitude/longitude in-memory to the general **District / Agro-Climatic Zone** (e.g. Guntur, Anantapur, Krishna).
- **Exact GPS coordinates, farm boundaries, and land records are NEVER stored or transmitted.**

### 7. 🛡️ Government / Agricultural Administration Dashboard
- Strictly aggregated and anonymized regional data (Zero farmer PII exposed).
- District-level surplus vs shortage matrix (e.g., Groundnut surplus in Rayalaseema, Paddy surplus in Coastal AP, pulses deficit).
- Recharts visualizations: Crop production shares, price trends, and demand indices.
- Strategic AI-generated agricultural policy and procurement planning advisories.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS | High-contrast, mobile-responsive, component-based UI |
| **Icons & Charts** | Lucide React, Recharts | Accessible SVG icons & responsive analytics charts |
| **Voice & Audio** | Web Speech Recognition & Speech Synthesis | Browser native Speech-to-Text & Text-to-Speech |
| **Backend** | Python 3.14, FastAPI, Uvicorn | High-performance asynchronous REST API |
| **Database** | SQLite + SQLAlchemy ORM | Relational models with automated startup seeding |
| **AI Layer** | Multi-lingual Agricultural Engine | Rule-grounded engine + optional Google Gemini API |
| **Auth** | PBKDF2 Password Hashing & JWT Bearer | Role-based authentication (Farmer vs Admin) |

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- **Python 3.10+** (Python 3.14 verified)
- **Node.js 18+** (Node.js 24 LTS verified) & **npm**

---

### Step 1: Start the Backend (FastAPI)

1. Open a terminal in `SIH/backend`:
   ```bash
   cd c:\Users\Admin\Documents\SIH\backend
   ```
2. Install Python dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
4. The backend will automatically create SQLite database tables and seed realistic Andhra Pradesh agricultural demonstration data on first launch!
   - API Health Check: `http://127.0.0.1:8000/`
   - Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`

---

### Step 2: Start the Frontend (React + Vite)

1. Open a new terminal in `SIH/frontend`:
   ```bash
   cd c:\Users\Admin\Documents\SIH\frontend
   ```
2. Install Node dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at:
   ```
   http://127.0.0.1:5176/
   ```

---

## ⚡ Hackathon Judges & Presentation Demo Accounts

Both the Farmer and Admin login portals include convenient **one-click demo buttons** to bypass typing during evaluation:

### 1. Farmer Demonstration Account
- **Mobile**: `9876543210`
- **Password**: `farmer123`
- **Farmer**: Ramesh Babu (రామేశ్ బాబు)
- **District**: Guntur (నల్లరేగడి నేలలు / Black Soil)
- **Active Crop**: Paddy (వరి) – Expected 45 Quintals

### 2. Government Officer / Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Officer**: Dr. K. Seshadri, Joint Director of Agriculture
- **Department**: Department of Agriculture, Government of Andhra Pradesh

---

## 🧪 Running Automated Tests

Run the backend test suite:
```bash
cd backend
python test_suite.py
```
This automatically verifies all 10 system phases:
1. Health check
2. Admin authentication
3. Farmer authentication
4. Transparent scoring logic (Groundnut / Paddy suitability)
5. Production tracking CRUD
6. Marketplace search & filtering
7. Government scheme verified URLs check
8. AI Voice consultation engine
9. Privacy-preserving location reverse geocoding
10. Admin aggregated regional analytics & Zero-PII privacy audit

---

## 📁 Project Structure

```
SIH/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application & router mounting
│   │   ├── config.py                   # Environment settings & secrets
│   │   ├── database.py                 # SQLite connection & SQLAlchemy session
│   │   ├── models.py                   # DB models (Farmer, Crop, Production, Buyer, Scheme, Admin)
│   │   ├── schemas.py                  # Pydantic v2 schemas
│   │   ├── auth.py                     # PBKDF2 hashing & JWT tokens
│   │   ├── seed_data.py                # Realistic AP agriculture dataset
│   │   ├── routers/
│   │   │   ├── auth.py                 # Registration & Login endpoints
│   │   │   ├── crops.py                # Crop catalog & recommendation scoring
│   │   │   ├── production.py           # Farmer production logs & tracking
│   │   │   ├── buyers.py               # Marketplace directory & inquiry dispatch
│   │   │   ├── schemes.py              # Official verified government schemes
│   │   │   ├── ai_assistant.py         # Multi-lingual voice agricultural Q&A
│   │   │   ├── location.py             # Privacy reverse geocoder (No GPS saved)
│   │   │   └── admin.py                # Aggregated regional analytics (Zero PII)
│   │   └── services/
│   │       ├── recommendation_engine.py# Explainable scoring engine
│   │       └── ai_service.py           # Telugu/English agricultural AI consultation
│   ├── test_suite.py                   # Automated 10-step test script
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # High-contrast header & language picker
│   │   │   ├── Footer.tsx              # Helplines, portal links & privacy badge
│   │   │   ├── FloatingVoiceButton.tsx # Pulsing bottom-right microphone button
│   │   │   ├── VoiceAssistantModal.tsx # Speech-to-Text & Audio Speech player
│   │   │   ├── CropCard.tsx            # Transparent score badge & "Ask AI Why"
│   │   │   ├── SchemeCard.tsx          # Verified scheme card & official link
│   │   │   ├── BuyerCard.tsx           # Marketplace opportunity & contact modal
│   │   │   └── PrivacyNotice.tsx       # Farmer privacy reassurance banner
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx         # Hero, features & demo flow preview
│   │   │   ├── FarmerAuthPage.tsx      # Minimal fields & one-click demo login
│   │   │   ├── FarmerDashboard.tsx     # Section 22 specification dashboard
│   │   │   ├── CropRecommendationPage.tsx # Interactive conditions & ranked crops
│   │   │   ├── ProductionTrackingPage.tsx # Harvest timeline & surplus calculator
│   │   │   ├── BuyersMarketPage.tsx    # Filterable buyers & inquiry dispatch
│   │   │   ├── GovernmentSchemesPage.tsx # Verified schemes with official URLs
│   │   │   ├── FarmerProfilePage.tsx   # Manage district, soil & language
│   │   │   ├── AdminLoginPage.tsx      # Agricultural officer sign-in
│   │   │   └── AdminDashboardPage.tsx  # Aggregated charts & policy advisories
│   │   ├── context/
│   │   │   ├── LanguageContext.tsx     # Active language & translation hook
│   │   │   └── AuthContext.tsx         # Farmer & Admin session state
│   │   ├── services/
│   │   │   ├── api.ts                  # Centralized HTTP client
│   │   │   └── speech.ts               # Web Speech API wrapper
│   │   ├── i18n/                       # 7 languages (Telugu prioritized)
│   │   ├── types/index.ts              # TypeScript interfaces
│   │   ├── App.tsx                     # Main application layout
│   │   └── index.css                   # Accessible agricultural styles
│   ├── vite.config.ts                  # Vite config with API proxy
│   └── package.json
└── README.md
```

---

## 🏆 Smart India Hackathon Presentation Walkthrough

During your presentation to judges, follow this seamless demo sequence:

1. **Homepage & Language Switch**:
   - Open `http://127.0.0.1:5176/`.
   - Show how the entire UI instantly switches to authentic **Telugu (తెలుగు)**.
2. **Farmer Login**:
   - Click **"⚡ రైతు డెమో లాగిన్ (Farmer Demo)"** to log in instantly as Ramesh Babu (Guntur).
3. **Farmer Dashboard**:
   - Show the clean layout matching the problem requirements (Recommended Crop, Current Crop, Buyers, Schemes, and Big Mic button).
4. **Crop Recommendation**:
   - Navigate to **Crop Recommendation**. Select Anantapur with Red Soil and Moderate Water.
   - Show the top recommendation: **Groundnut (98% Suitable)** with point-by-point justifications.
   - Click **"Ask AI Why?"** to hear and see the AI explain the reasoning in Telugu.
5. **AI Voice Assistant**:
   - Click the floating microphone.
   - Speak or tap a suggestion chip (e.g., *"రైతు భరోసా పథకం వివరాలు"*).
   - Listen to the spoken audio response and review the verified source attribution.
6. **Production Tracking**:
   - View Paddy harvest progress and marketable surplus estimation (12 Quintals).
7. **Direct Marketplace**:
   - Filter buyers by Groundnut. Show verified mills and send a direct inquiry.
8. **Government Schemes**:
   - Review verified schemes (PM-KISAN, Rythu Bharosa) with authentic official `.gov.in` portal links.
9. **Government Officer Dashboard**:
   - Switch to **Admin Login** and click **"⚡ డెమో లాగిన్"**.
   - Show the aggregated regional charts, district surplus/shortage matrix, and AI policy planning advisories with zero farmer private data exposed.
