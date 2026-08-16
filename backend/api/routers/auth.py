from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import verify_password, get_password_hash, create_access_token
from schemas.auth import AuthenticationRequest, AuthenticationResponse, CandidateSignupRequest, CompanySignupRequest, HiringManagerSignupRequest
from models.candidate import Candidate
from models.company import Company, HiringManager, Department
from models.catalog import Industry

router = APIRouter()

@router.post("/login/candidate", response_model=AuthenticationResponse)
def login_candidate(request: AuthenticationRequest, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.email == request.email).first()
    if not candidate or not verify_password(request.password, candidate.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(candidate.email, candidate.id, "CANDIDATE")
    return AuthenticationResponse(token=token)

@router.post("/login/company", response_model=AuthenticationResponse)
def login_company(request: AuthenticationRequest, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.email == request.email).first()
    if not company or not verify_password(request.password, company.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(company.email, company.id, "COMPANY")
    return AuthenticationResponse(token=token)

@router.post("/login/hm", response_model=AuthenticationResponse)
def login_hm(request: AuthenticationRequest, db: Session = Depends(get_db)):
    hm = db.query(HiringManager).filter(HiringManager.email == request.email).first()
    if not hm or not verify_password(request.password, hm.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(hm.email, hm.id, "HIRING_MANAGER")
    return AuthenticationResponse(token=token)

@router.post("/signup/candidate")
def signup_candidate(request: CandidateSignupRequest, db: Session = Depends(get_db)):
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
    db.commit()
    return {"message": "Candidate created successfully"}

@router.post("/signup/company")
def signup_company(request: CompanySignupRequest, db: Session = Depends(get_db)):
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
    return {"message": "Company created successfully"}

@router.post("/signup/hm")
def signup_hm(request: HiringManagerSignupRequest, db: Session = Depends(get_db)):
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
    return {"message": "Hiring Manager created successfully"}
