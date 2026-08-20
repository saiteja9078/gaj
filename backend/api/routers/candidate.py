from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from core.database import get_db
from api.deps import get_current_candidate
from schemas.candidate import CandidateResponse, CandidateBase, SaveSkillsRequest, ExpCreateReq
from models.candidate import Candidate
from services import candidate_service

router = APIRouter()

@router.get("/me", response_model=CandidateResponse)
def get_candidate_profile(current_candidate: Candidate = Depends(get_current_candidate), db: Session = Depends(get_db)):
    return candidate_service.get_candidate_profile(db, current_candidate)

@router.put("/me", response_model=CandidateResponse)
def update_candidate_profile(
    profile: CandidateBase,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return candidate_service.update_candidate_profile(db, current_candidate, profile)

@router.get("/skills")
def get_skills(current_candidate: Candidate = Depends(get_current_candidate), db: Session = Depends(get_db)):
    return candidate_service.get_skills(db, current_candidate)

@router.post("/skills")
def save_skills(
    req: SaveSkillsRequest,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return candidate_service.save_skills(db, current_candidate, req)

@router.delete("/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return candidate_service.delete_skill(db, current_candidate, skill_id)

@router.get("/experiences")
def get_experiences(current_candidate: Candidate = Depends(get_current_candidate), db: Session = Depends(get_db)):
    return candidate_service.get_experiences(db, current_candidate)

@router.post("/experiences")
def add_experience(
    exp_req: ExpCreateReq,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return candidate_service.add_experience(db, current_candidate, exp_req)

@router.delete("/experiences/{exp_id}")
def delete_experience(
    exp_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return candidate_service.delete_experience(db, current_candidate, exp_id)

@router.get("/resumes")
def get_resumes(current_candidate: Candidate = Depends(get_current_candidate), db: Session = Depends(get_db)):
    return candidate_service.get_resumes(db, current_candidate)

@router.post("/resumes")
def upload_resume(
    file: UploadFile = File(...),
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return candidate_service.upload_resume(db, current_candidate, file)

@router.delete("/resumes/{resume_id}")
def delete_resume(
    resume_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    return candidate_service.delete_resume(db, current_candidate, resume_id)

@router.get("/resumes/{resume_id}/blob")
def get_resume_blob(
    resume_id: int,
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    path, name = candidate_service.get_resume_blob_path(db, current_candidate, resume_id)
    return FileResponse(path, filename=name)
