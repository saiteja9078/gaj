from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.auth import AuthenticationRequest, AuthenticationResponse, CandidateSignupRequest, CompanySignupRequest, HiringManagerSignupRequest
from typing import List, Optional
from services import auth_service
from services.email_service import send_welcome_email

router = APIRouter()

@router.post("/login/candidate", response_model=AuthenticationResponse)
def login_candidate(request: AuthenticationRequest, db: Session = Depends(get_db)):
    token = auth_service.login_candidate(db, request)
    return AuthenticationResponse(token=token)

@router.post("/login/company", response_model=AuthenticationResponse)
def login_company(request: AuthenticationRequest, db: Session = Depends(get_db)):
    token = auth_service.login_company(db, request)
    return AuthenticationResponse(token=token)

@router.post("/login/hiring-manager", response_model=AuthenticationResponse)
@router.post("/login/hm", response_model=AuthenticationResponse, include_in_schema=False)
def login_hm(request: AuthenticationRequest, db: Session = Depends(get_db)):
    token = auth_service.login_hm(db, request)
    return AuthenticationResponse(token=token)

class CandidateSignupWithSkillsRequest(CandidateSignupRequest):
    skillsList: Optional[List[int]] = []

@router.post("/signup/candidate", response_model=AuthenticationResponse, status_code=status.HTTP_201_CREATED)
def signup_candidate(request: CandidateSignupWithSkillsRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    token = auth_service.signup_candidate(db, request)
    background_tasks.add_task(send_welcome_email, request.email, request.firstName, "Candidate")
    return AuthenticationResponse(token=token)

@router.post("/signup/company", response_model=AuthenticationResponse, status_code=status.HTTP_201_CREATED)
def signup_company(request: CompanySignupRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    token = auth_service.signup_company(db, request)
    background_tasks.add_task(send_welcome_email, request.email, request.name, "Company")
    return AuthenticationResponse(token=token)

@router.post("/signup/hiring-manager", response_model=AuthenticationResponse, status_code=status.HTTP_201_CREATED)
@router.post("/signup/hm", response_model=AuthenticationResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def signup_hm(request: HiringManagerSignupRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    token = auth_service.signup_hm(db, request)
    background_tasks.add_task(send_welcome_email, request.email, request.firstName, "Hiring Manager")
    return AuthenticationResponse(token=token)
