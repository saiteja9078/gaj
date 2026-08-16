from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from schemas.catalog import SkillResponse, RoleResponse, IndustryResponse
from models.catalog import Skill, RoleEntity, Industry

router = APIRouter()

@router.get("/skills", response_model=List[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()

@router.get("/roles", response_model=List[RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    return db.query(RoleEntity).all()

@router.get("/industries", response_model=List[IndustryResponse])
def get_industries(db: Session = Depends(get_db)):
    return db.query(Industry).all()
