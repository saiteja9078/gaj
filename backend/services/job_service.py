from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi.responses import FileResponse
from models.company import HiringManager, Department
from models.candidate import Candidate
from models.job import JobPosting, JobApplication
from schemas.job import JobPostingCreate, JobApplicationCreate, StatusUpdate
from api.deps import CompanyOrHMUser
import os

def create_job_posting(db: Session, current_user: CompanyOrHMUser, job_req: JobPostingCreate) -> dict:
    if current_user.is_company:
        company_id = current_user.company.id
        hiring_manager_id = None
    else:
        hm = current_user.hm
        if not hm.hiringDepartment or not hm.hiringDepartment.company:
            raise HTTPException(status_code=400, detail="Hiring manager is not linked to a company")
        company_id = hm.hiringDepartment.company.id
        hiring_manager_id = hm.id

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
        company_id=company_id,
        workMode=job_req.workMode,
        minimumExperienceInMonths=job_req.minimumExperienceInMonths,
        expiresAt=job_req.expiresAt,
        hiring_manager_id=hiring_manager_id
    )
    db.add(job)
    db.commit()
    return {"message": "Job posted successfully"}

def get_job_postings(db: Session) -> list:
    return db.query(JobPosting).all()

def get_my_job_postings(db: Session, current_user: CompanyOrHMUser) -> list:
    if current_user.is_company:
        jobs = db.query(JobPosting).filter(JobPosting.company_id == current_user.company.id).all()
    else:
        hm = current_user.hm
        if not hm.hiringDepartment or not hm.hiringDepartment.company:
            return []
        company_id = hm.hiringDepartment.company.id
        jobs = db.query(JobPosting).filter(JobPosting.company_id == company_id).all()

    return [
        {
            "id": j.id,
            "title": j.title,
            "salaryLower": j.salaryLower,
            "salaryHigher": j.salaryHigher,
            "postedAt": j.postedAt.isoformat() if j.postedAt else None,
            "workMode": j.workMode.name if hasattr(j.workMode, "name") else j.workMode,
            "companyName": j.company.name if j.company else None,
        }
        for j in jobs
    ]

def apply_for_job(db: Session, current_candidate: Candidate, app_req: JobApplicationCreate) -> tuple[JobApplication, JobPosting]:
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
    
    return app, job

def delete_job_posting(db: Session, current_user: CompanyOrHMUser, job_id: int) -> dict:
    if current_user.is_company:
        job = db.query(JobPosting).filter(
            JobPosting.id == job_id,
            JobPosting.company_id == current_user.company.id
        ).first()
    else:
        hm = current_user.hm
        job = db.query(JobPosting).filter(
            JobPosting.id == job_id,
            JobPosting.hiring_manager_id == hm.id
        ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}

def get_my_applications(db: Session, current_candidate: Candidate) -> list:
    apps = db.query(JobApplication).filter(JobApplication.candidate_id == current_candidate.id).all()
    return [
        {
            "id": app.id,
            "jobId": app.job_posting_id,
            "jobTitle": app.job.title if app.job else "Unknown Job",
            "companyName": app.job.company.name if app.job and app.job.company else "Unknown Company",
            "status": app.status.name if hasattr(app.status, 'name') else app.status,
            "appliedAt": app.appliedAt.isoformat() if hasattr(app, 'appliedAt') and app.appliedAt else None
        }
        for app in apps
    ]

def get_job_applicants(db: Session, current_user: CompanyOrHMUser, job_id: int) -> list:
    if current_user.is_hiring_manager:
        job = db.query(JobPosting).filter(
            JobPosting.id == job_id,
            JobPosting.hiring_manager_id == current_user.hm.id
        ).first()
    else:
        job = db.query(JobPosting).filter(
            JobPosting.id == job_id,
            JobPosting.company_id == current_user.company.id
        ).first()

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

def update_application_status(db: Session, current_user: CompanyOrHMUser, app_id: int, update_data: StatusUpdate) -> dict:
    app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app or not app.jobPosting:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.is_hiring_manager:
        if app.jobPosting.hiring_manager_id != current_user.hm.id:
            raise HTTPException(status_code=404, detail="Application not found")
    else:
        if app.jobPosting.company_id != current_user.company.id:
            raise HTTPException(status_code=404, detail="Application not found")

    app.status = update_data.status
    db.commit()
    db.refresh(app)
    return {"message": "Status updated"}

def delete_application(db: Session, current_candidate: Candidate, app_id: int) -> dict:
    app = db.query(JobApplication).filter(JobApplication.id == app_id, JobApplication.candidate_id == current_candidate.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return {"message": "Application deleted"}

def get_application_details(db: Session, current_candidate: Candidate, app_id: int) -> dict:
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

def get_application_resume_blob_path(db: Session, current_user: CompanyOrHMUser, app_id: int) -> tuple[str, str]:
    app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app or not app.job:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.is_company:
        if app.job.company_id != current_user.company.id:
            raise HTTPException(status_code=404, detail="Application not found")
    else:
        if app.job.hiring_manager_id != current_user.hm.id:
            raise HTTPException(status_code=404, detail="Application not found")
        
    resume = app.resume
    if not resume or not os.path.exists(resume.storedPath):
        raise HTTPException(status_code=404, detail="Resume not found")
        
    return resume.storedPath, resume.actualName
