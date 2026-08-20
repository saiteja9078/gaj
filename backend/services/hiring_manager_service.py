from sqlalchemy.orm import Session
from models.company import HiringManager
from schemas.company import HiringManagerUpdate

def get_me(db: Session, current_hm: HiringManager) -> dict:
    return {
        "id": current_hm.id,
        "firstName": current_hm.firstName,
        "lastName": current_hm.lastName,
        "email": current_hm.email,
        "hiringDepartment": {"id": current_hm.hiringDepartment.id, "name": current_hm.hiringDepartment.name} if current_hm.hiringDepartment else None
    }

def update_me(db: Session, current_hm: HiringManager, update_data: HiringManagerUpdate) -> dict:
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
        "hiringDepartment": {"id": current_hm.hiringDepartment.id, "name": current_hm.hiringDepartment.name} if current_hm.hiringDepartment else None
    }
