from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Crop
from app.schemas import CropResponse, CropRecommendationRequest, CropRecommendation
from app.services.recommendation_engine import generate_recommendations

router = APIRouter(prefix="/crops", tags=["Crop Intelligence"])

@router.get("", response_model=List[CropResponse])
def get_all_crops(db: Session = Depends(get_db)):
    return db.query(Crop).all()

@router.get("/{crop_id}", response_model=CropResponse)
def get_crop_by_id(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.post("/recommend", response_model=List[CropRecommendation])
def get_crop_recommendations(req: CropRecommendationRequest, db: Session = Depends(get_db)):
    all_crops = db.query(Crop).all()
    if not all_crops:
        raise HTTPException(status_code=500, detail="Crop database not seeded")

    recommendations = generate_recommendations(
        crops=all_crops,
        district=req.district,
        soil_type=req.soil_type,
        water_availability=req.water_availability,
        season=req.season,
        expected_acreage=req.expected_acreage or 2.0
    )
    return recommendations
