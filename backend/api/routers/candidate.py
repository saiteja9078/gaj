from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from api.deps import get_current_candidate
from schemas.candidate import CandidateResponse, CandidateBase, CandidateSkillCreate, CandidateExperienceCreate, ResumeResponse
from models.candidate import Candidate, CandidateSkill, CandidateExperience, Resume
from models.catalog import Skill, RoleEntity
from services.storage_service import save_pdf

router = APIRouter()

@router.get("/me", response_model=CandidateResponse)
def get_candidate_profile(current_candidate: Candidate = Depends(get_current_candidate)):
    return current_candidate

@router.put("/me", response_model=CandidateResponse)
def update_candidate_profile(
    profile: CandidateBase,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    current_candidate.firstName = profile.firstName
    current_candidate.lastName = profile.lastName
    current_candidate.age = profile.age
    current_candidate.description = profile.description
    current_candidate.gender = profile.gender
    current_candidate.country = profile.country
    current_candidate.state = profile.state
    current_candidate.city = profile.city
    
    db.commit()
    db.refresh(current_candidate)
    return current_candidate

from pydantic import BaseModel
from datetime import datetime
from fastapi.responses import FileResponse
from models.catalog import Skill
import os

class AddExistingSkill(BaseModel):
    id: int
    proficiency: str

class CreateNewSkill(BaseModel):
    name: str
    proficiency: str

class SaveSkillsRequest(BaseModel):
    addExistingSkills: List[AddExistingSkill]
    createNewSkills: List[CreateNewSkill]

@router.get("/skills")
def get_skills(current_candidate: Candidate = Depends(get_current_candidate)):
    return [
        {
            "id": cs.skill_id,
            "name": cs.skill.name,
            "proficiency": cs.proficiency.name
        }
        for cs in current_candidate.candidateSkills
    ]

@router.post("/skills")
def save_skills(
    req: SaveSkillsRequest,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    # Add existing skills
    for es in req.addExistingSkills:
        existing = db.query(CandidateSkill).filter_by(candidate_id=current_candidate.id, skill_id=es.id).first()
        if not existing:
            cs = CandidateSkill(candidate_id=current_candidate.id, skill_id=es.id, proficiency=es.proficiency)
            db.add(cs)
        else:
            existing.proficiency = es.proficiency
    
    # Create new skills
    for ns in req.createNewSkills:
        skill = db.query(Skill).filter(Skill.name.ilike(ns.name)).first()
        if not skill:
            skill = Skill(name=ns.name)
            db.add(skill)
            db.commit()
            db.refresh(skill)
        
        existing = db.query(CandidateSkill).filter_by(candidate_id=current_candidate.id, skill_id=skill.id).first()
        if not existing:
            cs = CandidateSkill(candidate_id=current_candidate.id, skill_id=skill.id, proficiency=ns.proficiency)
            db.add(cs)
            
    db.commit()
    return {"message": "Skills saved successfully"}

@router.delete("/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    cs = db.query(CandidateSkill).filter_by(skill_id=skill_id, candidate_id=current_candidate.id).first()
    if not cs:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(cs)
    db.commit()
    return {"message": "Skill deleted"}


class ExpCreateReq(BaseModel):
    role_id: int
    company_id: int
    organizationName: str
    description: str = ""
    fromDate: datetime
    toDate: datetime = None

@router.get("/experiences")
def get_experiences(current_candidate: Candidate = Depends(get_current_candidate)):
    return [
        {
            "experienceId": exp.id,
            "companyName": exp.company.name if exp.company else None,
            "organizationName": exp.organizationName,
            "roleName": exp.role.name if exp.role else "Role",
            "description": exp.description,
            "fromDate": exp.fromDate.isoformat() if exp.fromDate else None,
            "toDate": exp.toDate.isoformat() if exp.toDate else None,
        }
        for exp in current_candidate.candidateExperiences
    ]

@router.post("/experiences")
def add_experience(
    exp_req: ExpCreateReq,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    exp = CandidateExperience(
        role_id=exp_req.role_id,
        organizationName=exp_req.organizationName,
        description=exp_req.description,
        company_id=exp_req.company_id,
        candidate_id=current_candidate.id,
        fromDate=exp_req.fromDate,
        toDate=exp_req.toDate
    )
    db.add(exp)
    db.commit()
    return {"message": "Experience added successfully"}

@router.delete("/experiences/{exp_id}")
def delete_experience(
    exp_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    exp = db.query(CandidateExperience).filter_by(id=exp_id, candidate_id=current_candidate.id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(exp)
    db.commit()
    return {"message": "Experience deleted"}


@router.get("/resumes")
def get_resumes(current_candidate: Candidate = Depends(get_current_candidate)):
    return [
        {
            "id": r.id,
            "fileName": r.actualName,
            "uploadedAt": r.uploadedAt.isoformat(),
            "extractedText": r.content
        }
        for r in current_candidate.resumes
    ]

@router.post("/resumes")
def upload_resume(
    file: UploadFile = File(...),
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    stored_path, extracted_text = save_pdf(file, current_candidate.id)
    
    resume = Resume(
        candidate_id=current_candidate.id,
        actualName=file.filename,
        storedPath=stored_path,
        content=extracted_text
    )
    db.add(resume)
    db.commit()
    return {"message": "Resume uploaded successfully"}

@router.delete("/resumes/{resume_id}")
def delete_resume(
    resume_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter_by(id=resume_id, candidate_id=current_candidate.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    try:
        if os.path.exists(resume.storedPath):
            os.remove(resume.storedPath)
    except Exception:
        pass

    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted"}

@router.get("/resumes/{resume_id}/blob")
def get_resume_blob(
    resume_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter_by(id=resume_id, candidate_id=current_candidate.id).first()
    if not resume or not os.path.exists(resume.storedPath):
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return FileResponse(resume.storedPath, filename=resume.actualName)

