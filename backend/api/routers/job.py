from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import FileResponse
from core.database import get_db
from api.deps import get_current_candidate, get_current_company_or_hm, CompanyOrHMUser
from schemas.job import JobPostingCreate, JobPostingResponse, JobApplicationCreate, StatusUpdate
from models.candidate import Candidate
from services import job_service
from services.email_service import send_job_application_email

router = APIRouter()

@router.post("/postings")
def create_job_posting(
    job_req: JobPostingCreate,
    current_user: CompanyOrHMUser = Depends(get_current_company_or_hm),
    db: Session = Depends(get_db)
):
    return job_service.create_job_posting(db, current_user, job_req)

@router.get("/postings", response_model=List[JobPostingResponse])
def get_job_postings(db: Session = Depends(get_db)):
    return job_service.get_job_postings(db)

@router.get("/postings/mine")
def get_my_job_postings(
    current_user: CompanyOrHMUser = Depends(get_current_company_or_hm),
    db: Session = Depends(get_db)
):
    return job_service.get_my_job_postings(db, current_user)

@router.post("/apply")
async def apply_for_job(
    app_req: JobApplicationCreate,
    background_tasks: BackgroundTasks,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    app, job = job_service.apply_for_job(db, current_candidate, app_req)
    
    background_tasks.add_task(
        send_job_application_email,
        current_candidate.email,
        current_candidate.firstName,
        job.title,
        job.company.name if job.company else "the company"
    )
    
    return {"message": "Application submitted successfully"}

@router.delete("/postings/{job_id}")
def delete_job_posting(
    job_id: int,
    current_user: CompanyOrHMUser = Depends(get_current_company_or_hm),
    db: Session = Depends(get_db)
):
    return job_service.delete_job_posting(db, current_user, job_id)

@router.get("/applications/me")
def get_my_applications(
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return job_service.get_my_applications(db, current_candidate)

@router.get("/{job_id}/applicants")
def get_job_applicants(
    job_id: int,
    current_user: CompanyOrHMUser = Depends(get_current_company_or_hm),
    db: Session = Depends(get_db)
):
    return job_service.get_job_applicants(db, current_user, job_id)

@router.put("/applications/{app_id}/status")
def update_application_status(
    app_id: int,
    update_data: StatusUpdate,
    current_user: CompanyOrHMUser = Depends(get_current_company_or_hm),
    db: Session = Depends(get_db)
):
    return job_service.update_application_status(db, current_user, app_id, update_data)

@router.delete("/applications/{app_id}")
def delete_application(
    app_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return job_service.delete_application(db, current_candidate, app_id)

@router.get("/applications/{app_id}")
def get_application_details(
    app_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return job_service.get_application_details(db, current_candidate, app_id)

@router.get("/applications/{app_id}/resume")
def get_application_resume_blob(
    app_id: int,
    current_user: CompanyOrHMUser = Depends(get_current_company_or_hm),
    db: Session = Depends(get_db)
):
    path, name = job_service.get_application_resume_blob_path(db, current_user, app_id)
    return FileResponse(path, filename=name)
