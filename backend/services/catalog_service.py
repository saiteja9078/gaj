from sqlalchemy.orm import Session
from models.catalog import Skill, RoleEntity, Industry

def get_skills(db: Session) -> list:
    return db.query(Skill).all()

def get_roles(db: Session) -> list:
    return db.query(RoleEntity).all()

def get_industries(db: Session) -> list:
    return db.query(Industry).all()
