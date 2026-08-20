from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from api.deps import get_current_company, get_current_candidate
from schemas.company import CompanyResponse, DepartmentCreate, HiringManagerCreate, CompanyReviewCreate, CompanyUpdate
from models.company import Company
from models.candidate import Candidate
from services import company_service

router = APIRouter()

@router.get("/me", response_model=CompanyResponse)
def get_company_profile(current_company: Company = Depends(get_current_company), db: Session = Depends(get_db)):
    return company_service.get_company_profile(db, current_company)

@router.post("/departments")
def add_department(
    dept_req: DepartmentCreate,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    return company_service.add_department(db, current_company, dept_req)

@router.post("/hiring-managers")
def add_hiring_manager(
    hm_req: HiringManagerCreate,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    return company_service.add_hiring_manager(db, current_company, hm_req)

@router.post("/reviews")
def add_review(
    review_req: CompanyReviewCreate,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return company_service.add_review(db, current_candidate, review_req)

@router.get("")
def list_companies(db: Session = Depends(get_db)):
    return company_service.list_companies(db)

@router.put("/me", response_model=CompanyResponse)
def update_company(
    update_data: CompanyUpdate,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    return company_service.update_company(db, current_company, update_data)

@router.get("/hiring-managers")
def get_hiring_managers(
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    return company_service.get_hiring_managers(db, current_company)

@router.delete("/hiring-managers/{id}")
def delete_hiring_manager(
    id: int,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    return company_service.delete_hiring_manager(db, current_company, id)

@router.get("/{company_id}/reviews")
def get_company_reviews(
    company_id: int,
    db: Session = Depends(get_db)
):
    return company_service.get_company_reviews(db, company_id)

@router.delete("/reviews/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    company_service.delete_review(db, current_candidate, review_id)
