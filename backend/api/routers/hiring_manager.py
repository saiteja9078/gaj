from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from api.deps import get_current_hiring_manager
from models.company import HiringManager
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class HiringManagerUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None

@router.get("/me")
def get_me(current_hm: HiringManager = Depends(get_current_hiring_manager)):
    return {
        "id": current_hm.id,
        "firstName": current_hm.firstName,
        "lastName": current_hm.lastName,
        "email": current_hm.email,
        "hiringDepartment": {"id": current_hm.department.id, "name": current_hm.department.name} if current_hm.department else None
    }

@router.put("/me")
def update_me(
    update_data: HiringManagerUpdate,
    current_hm: HiringManager = Depends(get_current_hiring_manager),
    db: Session = Depends(get_db)
):
    if update_data.firstName is not None:
        current_hm.firstName = update_data.firstName
    if update_data.lastName is not None:
        current_hm.lastName = update_data.lastName
        
    db.commit()
    db.refresh(current_hm)
    return {
        "id": current_hm.id,
        "firstName": current_hm.firstName,
        "lastName": current_hm.lastName,
        "email": current_hm.email,
        "hiringDepartment": {"id": current_hm.department.id, "name": current_hm.department.name} if current_hm.department else None
    }
