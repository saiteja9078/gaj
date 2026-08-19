from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from api.deps import get_current_company, get_current_hiring_manager, get_current_candidate
from schemas.company import CompanyResponse, DepartmentCreate, HiringManagerCreate, CompanyReviewCreate
from models.company import Company, Department, HiringManager, CompanyReview
from models.candidate import Candidate
from core.security import get_password_hash

router = APIRouter()

@router.get("/me", response_model=CompanyResponse)
def get_company_profile(current_company: Company = Depends(get_current_company)):
    return current_company

@router.post("/departments")
def add_department(
    dept_req: DepartmentCreate,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    dept = Department(name=dept_req.name, company_id=current_company.id)
    db.add(dept)
    db.commit()
    return {"message": "Department added successfully"}

@router.post("/hiring-managers")
def add_hiring_manager(
    hm_req: HiringManagerCreate,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    dept = db.query(Department).filter(Department.id == hm_req.department_id, Department.company_id == current_company.id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found in this company")

    hm = HiringManager(
        firstName=hm_req.firstName,
        lastName=hm_req.lastName,
        email=hm_req.email,
        gender=hm_req.gender,
        password=get_password_hash(hm_req.password),
        department_id=dept.id
    )
    db.add(hm)
    db.commit()
    return {"message": "Hiring Manager added successfully"}

@router.post("/reviews")
def add_review(
    review_req: CompanyReviewCreate,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """
    Add a company review. Requires CANDIDATE role.
    Mirrors Spring's CompanyReviewApi.addReview — uses the authenticated candidate's ID.
    """
    review = CompanyReview(
        text=review_req.text,
        stars=review_req.stars,
        company_id=review_req.company_id,
        candidate_id=current_candidate.id  # use real authenticated candidate, not hardcoded 1
    )
    db.add(review)
    db.commit()
    return {"message": "Review added successfully"}


@router.get("")
def list_companies(db: Session = Depends(get_db)):
    companies = db.query(Company).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "companyProfileUrl": c.companyProfileUrl,
            "location": {"country": c.country, "state": c.state, "city": c.city},
            "industry": {"id": c.industry_id, "name": c.industry.name} if c.industry else None
        }
        for c in companies
    ]

from pydantic import BaseModel
from typing import Optional

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    companyProfileUrl: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None

@router.put("/me", response_model=CompanyResponse)
def update_company(
    update_data: CompanyUpdate,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    if update_data.name is not None:
        current_company.name = update_data.name
    if update_data.companyProfileUrl is not None:
        current_company.companyProfileUrl = update_data.companyProfileUrl
    if update_data.country is not None:
        current_company.country = update_data.country
    if update_data.state is not None:
        current_company.state = update_data.state
    if update_data.city is not None:
        current_company.city = update_data.city
        
    db.commit()
    db.refresh(current_company)
    return current_company

@router.get("/hiring-managers")
def get_hiring_managers(
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    hms = db.query(HiringManager).join(Department).filter(Department.company_id == current_company.id).all()
    return [
        {
            "id": hm.id,
            "firstName": hm.firstName,
            "lastName": hm.lastName,
            "email": hm.email,
            "hiringDepartment": {"id": hm.hiringDepartment.id, "name": hm.hiringDepartment.name} if hm.hiringDepartment else None
        }
        for hm in hms
    ]

@router.delete("/hiring-managers/{id}")
def delete_hiring_manager(
    id: int,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    hm = db.query(HiringManager).join(Department).filter(HiringManager.id == id, Department.company_id == current_company.id).first()
    if not hm:
        raise HTTPException(status_code=404, detail="Hiring manager not found")
    db.delete(hm)
    db.commit()
    return {"message": "Hiring manager deleted"}

@router.get("/{company_id}/reviews")
def get_company_reviews(
    company_id: int,
    db: Session = Depends(get_db)
):
    reviews = db.query(CompanyReview).filter(CompanyReview.company_id == company_id).all()
    return [
        {
            "id": r.id,
            "companyId": r.company_id,
            "candidateName": f"{r.candidate.firstName} {r.candidate.lastName}" if r.candidate else "Anonymous",
            "stars": r.stars,
            "text": r.text,
            "createdAt": r.createdAt.isoformat() if hasattr(r, 'createdAt') and r.createdAt else None
        }
        for r in reviews
    ]

@router.delete("/reviews/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """
    Delete a company review. Requires CANDIDATE role.
    Only the candidate who wrote the review can delete it.
    Mirrors Spring's CompanyReviewApi.deleteReview.
    """
    review = db.query(CompanyReview).filter(
        CompanyReview.id == review_id,
        CompanyReview.candidate_id == current_candidate.id  # ownership check
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found or you are not the author")
    db.delete(review)
    db.commit()
