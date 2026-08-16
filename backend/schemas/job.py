from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models.enums import PostingStatus, JobType, WorkMode, ApplicationStatus, Proficiency
from .catalog import SkillResponse, RoleResponse
from .company import CompanyResponse, HiringManagerResponse
from .candidate import CandidateResponse, ResumeResponse

# Job Skill Requirement Schemas
class JobSkillRequirementBase(BaseModel):
    skill_id: int
    proficiency: Proficiency
    required: bool = False

class JobSkillRequirementCreate(JobSkillRequirementBase):
    pass

class JobSkillRequirementResponse(JobSkillRequirementBase):
    skill: Optional[SkillResponse] = None

    class Config:
        from_attributes = True

# Job Application Schemas
class JobApplicationBase(BaseModel):
    status: ApplicationStatus = ApplicationStatus.APPLIED
    coverLetter: Optional[str] = None
    job_posting_id: int
    resume_id: Optional[int] = None

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplicationResponse(JobApplicationBase):
    id: int
    appliedAt: datetime
    candidate: Optional[CandidateResponse] = None
    resume: Optional[ResumeResponse] = None

    class Config:
        from_attributes = True

# Job Posting Schemas
class JobPostingBase(BaseModel):
    title: str
    description: Optional[str] = None
    salaryLower: int = 0
    salaryHigher: int = 0
    status: PostingStatus = PostingStatus.OPEN
    type: JobType
    workingHoursPerDay: int = 8
    role_id: int
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    company_id: int
    workMode: WorkMode
    minimumExperienceInMonths: Optional[int] = None
    expiresAt: Optional[datetime] = None

class JobPostingCreate(JobPostingBase):
    pass

class JobPostingResponse(JobPostingBase):
    id: int
    postedAt: datetime
    hiringManager: Optional[HiringManagerResponse] = None
    role: Optional[RoleResponse] = None
    company: Optional[CompanyResponse] = None
    skillRequirements: List[JobSkillRequirementResponse] = []
    
    class Config:
        from_attributes = True

# Job Round Schemas
class JobRoundBase(BaseModel):
    feedback: Optional[str] = None
    roundNumber: int
    roundName: str
    rating: Optional[int] = None
    at: Optional[datetime] = None
    hr_id: int
    job_id: int

class JobRoundCreate(JobRoundBase):
    pass

class JobRoundResponse(JobRoundBase):
    id: int

    class Config:
        from_attributes = True
