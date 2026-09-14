from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Farmer, AdminUser
from app.schemas import FarmerCreate, FarmerLogin, FarmerResponse, FarmerUpdate, AdminLogin, AdminResponse, Token
from app.auth import get_password_hash, verify_password, create_access_token, get_current_farmer, get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/farmer/register", response_model=Token)
def register_farmer(farmer_in: FarmerCreate, db: Session = Depends(get_db)):
    existing = db.query(Farmer).filter(Farmer.mobile == farmer_in.mobile).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered. Please login."
        )
    
    new_farmer = Farmer(
        name=farmer_in.name,
        mobile=farmer_in.mobile,
        hashed_password=get_password_hash(farmer_in.password),
        preferred_language=farmer_in.preferred_language,
        state=farmer_in.state,
        district=farmer_in.district,
        region=farmer_in.region or "General",
        soil_type=farmer_in.soil_type,
        water_availability=farmer_in.water_availability,
        farming_experience=farmer_in.farming_experience
    )
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)

    token = create_access_token(data={"sub": new_farmer.id, "user_type": "farmer", "mobile": new_farmer.mobile})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "farmer",
        "user": FarmerResponse.model_validate(new_farmer)
    }

@router.post("/farmer/login", response_model=Token)
def login_farmer(creds: FarmerLogin, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.mobile == creds.mobile).first()
    if not farmer or not verify_password(creds.password, farmer.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number or password."
        )

    token = create_access_token(data={"sub": farmer.id, "user_type": "farmer", "mobile": farmer.mobile})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "farmer",
        "user": FarmerResponse.model_validate(farmer)
    }

@router.get("/farmer/me", response_model=FarmerResponse)
def get_farmer_profile(current_farmer: Farmer = Depends(get_current_farmer)):
    return current_farmer

@router.put("/farmer/me", response_model=FarmerResponse)
def update_farmer_profile(
    update_data: FarmerUpdate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    for field, val in update_data.model_dump(exclude_unset=True).items():
        setattr(current_farmer, field, val)
    db.commit()
    db.refresh(current_farmer)
    return current_farmer

@router.post("/admin/login", response_model=Token)
def login_admin(creds: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.username == creds.username).first()
    if not admin or not verify_password(creds.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials."
        )

    token = create_access_token(data={"sub": admin.id, "user_type": "admin", "username": admin.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "admin",
        "user": AdminResponse.model_validate(admin)
    }
