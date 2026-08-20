from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.company import Company, Department, HiringManager, CompanyReview
from models.candidate import Candidate
from schemas.company import CompanyUpdate, DepartmentCreate, HiringManagerCreate, CompanyReviewCreate
from core.security import get_password_hash

def get_company_profile(db: Session, current_company: Company) -> Company:
    return current_company

def add_department(db: Session, current_company: Company, dept_req: DepartmentCreate) -> dict:
    dept = Department(name=dept_req.name, company_id=current_company.id)
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return {"id": dept.id, "name": dept.name, "companyId": current_company.id, "companyName": current_company.name or ""}

def add_hiring_manager(db: Session, current_company: Company, hm_req: HiringManagerCreate) -> dict:
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

def add_review(db: Session, current_candidate: Candidate, review_req: CompanyReviewCreate) -> dict:
    review = CompanyReview(
        text=review_req.text,
        stars=review_req.stars,
        company_id=review_req.company_id,
        candidate_id=current_candidate.id
    )
    db.add(review)
    db.commit()
    return {"message": "Review added successfully"}

def list_companies(db: Session) -> list:
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

def update_company(db: Session, current_company: Company, update_data: CompanyUpdate) -> Company:
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

def get_hiring_managers(db: Session, current_company: Company) -> list:
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

def delete_hiring_manager(db: Session, current_company: Company, id: int) -> dict:
    hm = db.query(HiringManager).join(Department).filter(HiringManager.id == id, Department.company_id == current_company.id).first()
    if not hm:
        raise HTTPException(status_code=404, detail="Hiring manager not found")
    db.delete(hm)
    db.commit()
    return {"message": "Hiring manager deleted"}

def get_company_reviews(db: Session, company_id: int) -> list:
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

def delete_review(db: Session, current_candidate: Candidate, review_id: int) -> None:
    review = db.query(CompanyReview).filter(
        CompanyReview.id == review_id,
        CompanyReview.candidate_id == current_candidate.id
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found or you are not the author")
    db.delete(review)
    db.commit()
