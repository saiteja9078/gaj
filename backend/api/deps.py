from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import decode_access_token
from models.candidate import Candidate
from models.company import Company, HiringManager
from typing import Dict, Any, Union

security = HTTPBearer()

def get_current_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

def get_current_candidate(payload: Dict[str, Any] = Depends(get_current_user_token), db: Session = Depends(get_db)) -> Candidate:
    if payload.get("type") != "CANDIDATE":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    candidate = db.query(Candidate).filter(Candidate.id == payload.get("userId")).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

def get_current_company(payload: Dict[str, Any] = Depends(get_current_user_token), db: Session = Depends(get_db)) -> Company:
    if payload.get("type") != "COMPANY":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    company = db.query(Company).filter(Company.id == payload.get("userId")).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

def get_current_hiring_manager(payload: Dict[str, Any] = Depends(get_current_user_token), db: Session = Depends(get_db)) -> HiringManager:
    if payload.get("type") != "HIRING_MANAGER":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    hm = db.query(HiringManager).filter(HiringManager.id == payload.get("userId")).first()
    if not hm:
        raise HTTPException(status_code=404, detail="Hiring Manager not found")
    return hm

class CompanyOrHMUser:
    """
    Represents the authenticated user when either COMPANY or HIRING_MANAGER may access a route.
    Mirrors Spring's hasAnyRole("COMPANY", "HIRING_MANAGER").

    Attributes:
        type:    "COMPANY" or "HIRING_MANAGER"
        company: populated when type == "COMPANY"
        hm:      populated when type == "HIRING_MANAGER"
    """
    def __init__(self, type: str, company: Company = None, hm: HiringManager = None):
        self.type = type
        self.company = company
        self.hm = hm

    @property
    def is_company(self) -> bool:
        return self.type == "COMPANY"

    @property
    def is_hiring_manager(self) -> bool:
        return self.type == "HIRING_MANAGER"

def get_current_company_or_hm(
    payload: Dict[str, Any] = Depends(get_current_user_token),
    db: Session = Depends(get_db)
) -> CompanyOrHMUser:
    """
    Allows access for both COMPANY and HIRING_MANAGER roles.
    Returns a CompanyOrHMUser so the endpoint can branch on .is_company / .is_hiring_manager.
    """
    user_type = payload.get("type")
    user_id = payload.get("userId")

    if user_type == "COMPANY":
        company = db.query(Company).filter(Company.id == user_id).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        return CompanyOrHMUser(type="COMPANY", company=company)

    if user_type == "HIRING_MANAGER":
        hm = db.query(HiringManager).filter(HiringManager.id == user_id).first()
        if not hm:
            raise HTTPException(status_code=404, detail="Hiring Manager not found")
        return CompanyOrHMUser(type="HIRING_MANAGER", hm=hm)

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
