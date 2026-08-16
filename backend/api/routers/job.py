from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from api.deps import get_current_hiring_manager, get_current_candidate
from schemas.job import JobPostingCreate, JobPostingResponse, JobApplicationCreate, JobApplicationResponse
from models.company import HiringManager
from models.candidate import Candidate
from models.job import JobPosting, JobApplication, JobSkillRequirement
from services.email_service import send_job_application_email, send_welcome_email

router = APIRouter()

@router.post("/postings")
def create_job_posting(
    job_req: JobPostingCreate,
    current_hm: HiringManager = Depends(get_current_hiring_manager),
    db: Session = Depends(get_db)
):
    job = JobPosting(
        title=job_req.title,
        description=job_req.description,
        salaryLower=job_req.salaryLower,
        salaryHigher=job_req.salaryHigher,
        status=job_req.status,
        type=job_req.type,
        workingHoursPerDay=job_req.workingHoursPerDay,
        role_id=job_req.role_id,
        country=job_req.country,
        state=job_req.state,
        city=job_req.city,
        company_id=job_req.company_id,
        workMode=job_req.workMode,
        minimumExperienceInMonths=job_req.minimumExperienceInMonths,
        expiresAt=job_req.expiresAt,
        hiring_manager_id=current_hm.id
    )
    db.add(job)
    db.commit()
    return {"message": "Job posted successfully"}

@router.get("/postings", response_model=List[JobPostingResponse])
def get_job_postings(db: Session = Depends(get_db)):
    return db.query(JobPosting).all()

@router.post("/apply")
async def apply_for_job(
    app_req: JobApplicationCreate,
    background_tasks: BackgroundTasks,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    job = db.query(JobPosting).filter(JobPosting.id == app_req.job_posting_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    app = JobApplication(
        status=app_req.status,
        coverLetter=app_req.coverLetter,
        job_posting_id=app_req.job_posting_id,
        resume_id=app_req.resume_id,
        candidate_id=current_candidate.id
    )
    db.add(app)
    db.commit()
    
    # Send email async
    background_tasks.add_task(
        send_job_application_email,
        current_candidate.email,
        current_candidate.firstName,
        job.title,
        job.company.name if job.company else "the company"
    )
    
@router.delete("/postings/{job_id}")
def delete_job_posting(
    job_id: int,
    current_hm: HiringManager = Depends(get_current_hiring_manager),
    db: Session = Depends(get_db)
):
    job = db.query(JobPosting).filter(JobPosting.id == job_id, JobPosting.hiring_manager_id == current_hm.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}

@router.get("/applications/me")
def get_my_applications(
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    apps = db.query(JobApplication).filter(JobApplication.candidate_id == current_candidate.id).all()
    return [
        {
            "applicationId": app.id,
            "jobId": app.job_posting_id,
            "jobTitle": app.job.title if app.job else "Unknown Job",
            "companyName": app.job.company.name if app.job and app.job.company else "Unknown Company",
            "status": app.status.name if hasattr(app.status, 'name') else app.status,
            "appliedAt": app.appliedAt.isoformat() if hasattr(app, 'appliedAt') and app.appliedAt else None
        }
        for app in apps
    ]

@router.get("/{job_id}/applicants")
def get_job_applicants(
    job_id: int,
    current_hm: HiringManager = Depends(get_current_hiring_manager),
    db: Session = Depends(get_db)
):
    job = db.query(JobPosting).filter(JobPosting.id == job_id, JobPosting.hiring_manager_id == current_hm.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    apps = db.query(JobApplication).filter(JobApplication.job_posting_id == job_id).all()
    
    result = []
    for app in apps:
        candidate = app.candidate
        if not candidate:
            continue
            
        result.append({
            "applicationId": app.id,
            "candidateId": candidate.id,
            "firstName": candidate.firstName,
            "lastName": candidate.lastName,
            "email": candidate.email,
            "description": candidate.description,
            "location": {"country": candidate.country, "state": candidate.state, "city": candidate.city},
            "appliedAt": app.appliedAt.isoformat() if hasattr(app, 'appliedAt') and app.appliedAt else None,
            "status": app.status.name if hasattr(app.status, 'name') else app.status,
            "skills": [
                {
                    "id": cs.skill_id,
                    "name": cs.skill.name,
                    "proficiency": cs.proficiency.name
                }
                for cs in candidate.candidateSkills
            ],
            "experiences": [
                {
                    "experienceId": exp.id,
                    "companyName": exp.company.name if exp.company else None,
                    "organizationName": exp.organizationName,
                    "roleName": exp.role.name if exp.role else "Role",
                    "description": exp.description,
                    "fromDate": exp.fromDate.isoformat() if exp.fromDate else None,
                    "toDate": exp.toDate.isoformat() if exp.toDate else None,
                }
                for exp in candidate.candidateExperiences
            ],
            "coverLetter": app.coverLetter,
            "resumeId": app.resume_id,
            "resumeName": app.resume.actualName if app.resume else None
        })
    return result

from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str

@router.put("/applications/{app_id}/status")
def update_application_status(
    app_id: int,
    update_data: StatusUpdate,
    current_hm: HiringManager = Depends(get_current_hiring_manager),
    db: Session = Depends(get_db)
):
    app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app or not app.job or app.job.hiring_manager_id != current_hm.id:
        raise HTTPException(status_code=404, detail="Application not found")
        
    app.status = update_data.status
    db.commit()
    db.refresh(app)
    return {"message": "Status updated"}

@router.delete("/applications/{app_id}")
def delete_application(
    app_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    app = db.query(JobApplication).filter(JobApplication.id == app_id, JobApplication.candidate_id == current_candidate.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return {"message": "Application deleted"}

@router.get("/applications/{app_id}")
def get_application_details(
    app_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    app = db.query(JobApplication).filter(JobApplication.id == app_id, JobApplication.candidate_id == current_candidate.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    return {
        "id": app.id,
        "status": app.status.name if hasattr(app.status, 'name') else app.status,
        "appliedAt": app.appliedAt.isoformat() if hasattr(app, 'appliedAt') and app.appliedAt else None,
        "coverLetter": app.coverLetter,
        "resumeId": app.resume_id,
        "jobId": app.job.id if app.job else 0,
        "jobTitle": app.job.title if app.job else "",
        "jobDescription": app.job.description if app.job else "",
        "jobLocation": {"country": app.job.country, "state": app.job.state, "city": app.job.city} if app.job else None,
        "jobWorkMode": app.job.workMode.name if app.job and hasattr(app.job.workMode, 'name') else (app.job.workMode if app.job else ""),
        "jobSalaryLower": app.job.salaryLower if app.job else 0,
        "jobSalaryHigher": app.job.salaryHigher if app.job else 0,
        "companyId": app.job.company_id if app.job else 0,
        "companyName": app.job.company.name if app.job and app.job.company else "",
        "totalApplicants": db.query(JobApplication).filter(JobApplication.job_posting_id == app.job.id).count() if app.job else 0
    }

import os
from fastapi.responses import FileResponse

@router.get("/applications/{app_id}/resume")
def get_application_resume_blob(
    app_id: int,
    # This could be candidate or HM downloading it, let's allow either if we had a combined auth, but for now we might just want to allow hiring manager
    current_hm: HiringManager = Depends(get_current_hiring_manager),
    db: Session = Depends(get_db)
):
    app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app or not app.job or app.job.hiring_manager_id != current_hm.id:
        raise HTTPException(status_code=404, detail="Application not found")
        
    resume = app.resume
    if not resume or not os.path.exists(resume.storedPath):
        raise HTTPException(status_code=404, detail="Resume not found")
        
    return FileResponse(resume.storedPath, filename=resume.actualName)
