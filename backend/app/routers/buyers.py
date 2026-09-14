from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Buyer
from app.schemas import BuyerResponse, BuyerContactRequest

router = APIRouter(prefix="/buyers", tags=["Market & Buyers"])

@router.get("", response_model=List[BuyerResponse])
def get_buyers(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    region: Optional[str] = Query(None, description="Filter by region/district"),
    buyer_type: Optional[str] = Query(None, description="Filter by buyer category"),
    db: Session = Depends(get_db)
):
    query = db.query(Buyer)
    
    if crop:
        query = query.filter(Buyer.crops_required.ilike(f"%{crop}%"))
    if region:
        query = query.filter((Buyer.district.ilike(f"%{region}%")) | (Buyer.region.ilike(f"%{region}%")))
    if buyer_type:
        query = query.filter(Buyer.buyer_type.ilike(f"%{buyer_type}%"))
        
    return query.all()

@router.post("/contact")
def contact_buyer(req: BuyerContactRequest, db: Session = Depends(get_db)):
    buyer = db.query(Buyer).filter(Buyer.id == req.buyer_id).first()
    if not buyer:
        return {"status": "error", "message": "Buyer not found"}

    # Simulate direct SMS/WhatsApp notification dispatch to buyer procurement officer
    return {
        "status": "success",
        "message": f"Inquiry successfully dispatched to {buyer.name}.",
        "buyer_name": buyer.name,
        "buyer_contact": buyer.contact_phone,
        "action_advice": f"You can also directly call {buyer.contact_phone} to finalize the spot deal."
    }
