from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Farmer, ProductionRecord
from app.schemas import ProductionCreate, ProductionUpdate, ProductionResponse
from app.auth import get_current_farmer

router = APIRouter(prefix="/production", tags=["Production Tracking"])

@router.get("", response_model=List[ProductionResponse])
def get_my_productions(
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    return db.query(ProductionRecord).filter(ProductionRecord.farmer_id == current_farmer.id).order_by(ProductionRecord.id.desc()).all()

@router.post("", response_model=ProductionResponse)
def create_production_record(
    prod_in: ProductionCreate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    # Calculate estimated surplus (if current or expected exceeds family consumption ~5-8 qtls)
    predicted_surplus = max(0.0, prod_in.expected_quantity_quintals - 6.0)

    record = ProductionRecord(
        farmer_id=current_farmer.id,
        crop_name=prod_in.crop_name,
        season=prod_in.season,
        area_acres=prod_in.area_acres,
        expected_quantity_quintals=prod_in.expected_quantity_quintals,
        current_harvested_quintals=prod_in.current_harvested_quintals,
        planting_date=prod_in.planting_date,
        expected_harvest_date=prod_in.expected_harvest_date,
        status=prod_in.status,
        surplus_predicted=predicted_surplus
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.put("/{record_id}", response_model=ProductionResponse)
def update_production_record(
    record_id: int,
    prod_update: ProductionUpdate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    record = db.query(ProductionRecord).filter(
        ProductionRecord.id == record_id,
        ProductionRecord.farmer_id == current_farmer.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Production record not found")

    for field, val in prod_update.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(record, field, val)

    if record.expected_quantity_quintals:
        record.surplus_predicted = max(0.0, record.expected_quantity_quintals - 6.0)

    db.commit()
    db.refresh(record)
    return record

@router.delete("/{record_id}")
def delete_production_record(
    record_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    record = db.query(ProductionRecord).filter(
        ProductionRecord.id == record_id,
        ProductionRecord.farmer_id == current_farmer.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Production record not found")

    db.delete(record)
    db.commit()
    return {"status": "success", "message": "Record deleted"}
