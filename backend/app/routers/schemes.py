from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import GovernmentScheme
from app.schemas import SchemeResponse

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("", response_model=List[SchemeResponse])
def get_schemes(
    state: Optional[str] = Query(None, description="State filter"),
    category: Optional[str] = Query(None, description="Category filter"),
    search: Optional[str] = Query(None, description="Search keyword"),
    db: Session = Depends(get_db)
):
    query = db.query(GovernmentScheme)
    
    if state and state != "All":
        query = query.filter((GovernmentScheme.state == state) | (GovernmentScheme.state == "All India"))
        
    if category and category != "All":
        query = query.filter(GovernmentScheme.category == category)
        
    if search:
        s = f"%{search}%"
        query = query.filter(
            (GovernmentScheme.scheme_name.ilike(s)) |
            (GovernmentScheme.telugu_name.ilike(s)) |
            (GovernmentScheme.benefits.ilike(s)) |
            (GovernmentScheme.eligibility.ilike(s))
        )
        
    return query.all()

@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme_by_id(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(GovernmentScheme).filter(GovernmentScheme.id == scheme_id).first()
    if not scheme:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
