from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from models.candidate import Candidate, CandidateSkill, CandidateExperience, Resume
from models.catalog import Skill
from schemas.candidate import CandidateBase, SaveSkillsRequest, ExpCreateReq
from services.storage_service import save_pdf
import os

def get_candidate_profile(db: Session, current_candidate: Candidate) -> Candidate:
    return current_candidate

def update_candidate_profile(db: Session, current_candidate: Candidate, profile: CandidateBase) -> Candidate:
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

def get_skills(db: Session, current_candidate: Candidate) -> list:
    return [
        {
            "id": cs.skill_id,
            "name": cs.skill.name,
            "proficiency": cs.proficiency.name
        }
        for cs in current_candidate.candidateSkills
    ]

def save_skills(db: Session, current_candidate: Candidate, req: SaveSkillsRequest) -> dict:
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

def delete_skill(db: Session, current_candidate: Candidate, skill_id: int) -> dict:
    cs = db.query(CandidateSkill).filter_by(skill_id=skill_id, candidate_id=current_candidate.id).first()
    if not cs:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(cs)
    db.commit()
    return {"message": "Skill deleted"}

def get_experiences(db: Session, current_candidate: Candidate) -> list:
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

def add_experience(db: Session, current_candidate: Candidate, exp_req: ExpCreateReq) -> dict:
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

def delete_experience(db: Session, current_candidate: Candidate, exp_id: int) -> dict:
    exp = db.query(CandidateExperience).filter_by(id=exp_id, candidate_id=current_candidate.id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(exp)
    db.commit()
    return {"message": "Experience deleted"}

def get_resumes(db: Session, current_candidate: Candidate) -> list:
    return [
        {
            "id": r.id,
            "fileName": r.actualName,
            "uploadedAt": r.uploadedAt.isoformat(),
            "extractedText": r.content
        }
        for r in current_candidate.resumes
    ]

def upload_resume(db: Session, current_candidate: Candidate, file: UploadFile) -> dict:
    stored_path, extracted_text = save_pdf(file, current_candidate.id)
    
    resume = Resume(
        candidate_id=current_candidate.id,
        actualName=file.filename,
        storedPath=stored_path,
        content=extracted_text
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return {
        "id": resume.id,
        "fileName": resume.actualName,
        "uploadedAt": resume.uploadedAt.isoformat() if resume.uploadedAt else None,
        "extractedText": resume.content
    }

def delete_resume(db: Session, current_candidate: Candidate, resume_id: int) -> dict:
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

def get_resume_blob_path(db: Session, current_candidate: Candidate, resume_id: int) -> tuple[str, str]:
    resume = db.query(Resume).filter_by(id=resume_id, candidate_id=current_candidate.id).first()
    if not resume or not os.path.exists(resume.storedPath):
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume.storedPath, resume.actualName
