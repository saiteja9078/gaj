from sqlalchemy.orm import Session
from fastapi import HTTPException
from core.security import verify_password, get_password_hash, create_access_token
from schemas.auth import AuthenticationRequest, CompanySignupRequest, HiringManagerSignupRequest
from models.candidate import Candidate, CandidateSkill
from models.company import Company, HiringManager
from models.catalog import Skill
from typing import List, Optional

def login_candidate(db: Session, request: AuthenticationRequest) -> str:
    candidate = db.query(Candidate).filter(Candidate.email == request.email).first()
    if not candidate or not verify_password(request.password, candidate.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return create_access_token(candidate.email, candidate.id, "CANDIDATE")

def login_company(db: Session, request: AuthenticationRequest) -> str:
    company = db.query(Company).filter(Company.email == request.email).first()
    if not company or not verify_password(request.password, company.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return create_access_token(company.email, company.id, "COMPANY")

def login_hm(db: Session, request: AuthenticationRequest) -> str:
    hm = db.query(HiringManager).filter(HiringManager.email == request.email).first()
    if not hm or not verify_password(request.password, hm.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return create_access_token(hm.email, hm.id, "HIRING_MANAGER")

def signup_candidate(db: Session, request) -> str: # request is CandidateSignupWithSkillsRequest defined in router or schema
    if db.query(Candidate).filter(Candidate.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    candidate = Candidate(
        firstName=request.firstName,
        lastName=request.lastName,
        email=request.email,
        password=get_password_hash(request.password),
        gender=request.gender,
        description=request.description
    )
    db.add(candidate)
    db.flush()

    for skill_id in (request.skillsList or []):
        skill_exists = db.query(Skill).filter(Skill.id == skill_id).first()
        if skill_exists:
            cs = CandidateSkill(candidate_id=candidate.id, skill_id=skill_id)
            db.add(cs)

    db.commit()
    db.refresh(candidate)
    return create_access_token(candidate.email, candidate.id, "CANDIDATE")

def signup_company(db: Session, request: CompanySignupRequest) -> str:
    if db.query(Company).filter(Company.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    company = Company(
        name=request.name,
        email=request.email,
        password=get_password_hash(request.password),
        industry_id=request.industry_id,
        country=request.country,
        state=request.state,
        city=request.city
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return create_access_token(company.email, company.id, "COMPANY")

def signup_hm(db: Session, request: HiringManagerSignupRequest) -> str:
    if db.query(HiringManager).filter(HiringManager.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hm = HiringManager(
        firstName=request.firstName,
        lastName=request.lastName,
        email=request.email,
        password=get_password_hash(request.password),
        gender=request.gender,
        department_id=request.department_id
    )
    db.add(hm)
    db.commit()
    db.refresh(hm)
    return create_access_token(hm.email, hm.id, "HIRING_MANAGER")
