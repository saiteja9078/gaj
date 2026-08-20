from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from api.deps import get_current_hiring_manager
from models.company import HiringManager
from schemas.company import HiringManagerUpdate
from services import hiring_manager_service

router = APIRouter()

@router.get("/me")
def get_me(current_hm: HiringManager = Depends(get_current_hiring_manager), db: Session = Depends(get_db)):
    return hiring_manager_service.get_me(db, current_hm)

@router.put("/me")
def update_me(
    update_data: HiringManagerUpdate,
    current_hm: HiringManager = Depends(get_current_hiring_manager),
    db: Session = Depends(get_db)
):
    return hiring_manager_service.update_me(db, current_hm, update_data)
