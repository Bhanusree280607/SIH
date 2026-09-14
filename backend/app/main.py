import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routers import auth, crops, production, buyers, schemes, ai_assistant, location, admin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rythumithra")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing SQLite database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Seeding realistic agricultural demonstration data...")
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    logger.info("RythuMithra Backend Startup complete.")
    yield
    logger.info("RythuMithra Backend Shutdown.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Farmer-First AI Agricultural Intelligence Platform for SIH 26193",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(crops.router, prefix=settings.API_V1_STR)
app.include_router(production.router, prefix=settings.API_V1_STR)
app.include_router(buyers.router, prefix=settings.API_V1_STR)
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(ai_assistant.router, prefix=settings.API_V1_STR)
app.include_router(location.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": "RythuMithra / KisanMithra",
        "sih_problem_statement": "26193 - AI-Powered Farmer Support Platform",
        "status": "operational",
        "docs_url": "/docs",
        "features": [
            "Transparent Multi-Factor Crop Recommendation Engine",
            "Multi-lingual Voice AI Assistant (Telugu, Hindi, English, etc.)",
            "Privacy-Preserving Geolocation (District Level, No GPS Saved)",
            "Farmer Production Tracking & Harvest Progress",
            "Direct Buyer & Market Connection (APMC, Processors, Exporters)",
            "Official Central & AP State Government Schemes (Verified Portals)",
            "Aggregated Regional Government Intelligence Dashboard"
        ]
    }
