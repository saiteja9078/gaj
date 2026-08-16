from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models.enums import Gender, Proficiency
from .catalog import SkillResponse, RoleResponse
from .company import CompanyResponse

# Resume Schemas
class ResumeResponse(BaseModel):
    id: int
    actualName: str
    storedPath: str
    uploadedAt: datetime
    
    class Config:
        from_attributes = True

# Candidate Skill Schemas
class CandidateSkillBase(BaseModel):
    skill_id: int
    proficiency: Proficiency

class CandidateSkillCreate(CandidateSkillBase):
    pass

class CandidateSkillResponse(CandidateSkillBase):
    skill: Optional[SkillResponse] = None

    class Config:
        from_attributes = True

# Candidate Experience Schemas
class CandidateExperienceBase(BaseModel):
    role_id: int
    organizationName: str
    description: Optional[str] = None
    company_id: Optional[int] = None
    fromDate: datetime
    toDate: Optional[datetime] = None

class CandidateExperienceCreate(CandidateExperienceBase):
    pass

class CandidateExperienceResponse(CandidateExperienceBase):
    id: int
    role: Optional[RoleResponse] = None
    company: Optional[CompanyResponse] = None

    class Config:
        from_attributes = True

# Candidate Schemas
class CandidateBase(BaseModel):
    firstName: str
    lastName: str
    age: Optional[int] = None
    profilePictureUrl: Optional[str] = None
    gender: Optional[Gender] = None
    email: EmailStr
    description: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None

class CandidateCreate(CandidateBase):
    password: str

class CandidateResponse(CandidateBase):
    id: int
    resumes: List[ResumeResponse] = []
    candidateSkills: List[CandidateSkillResponse] = []
    candidateExperiences: List[CandidateExperienceResponse] = []

    class Config:
        from_attributes = True
