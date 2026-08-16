from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Text, SmallInteger, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base
from .enums import PostingStatus, JobType, WorkMode, ApplicationStatus, Proficiency

class JobPosting(Base):
    __tablename__ = "job_postings"
    
    id = Column(Integer, Sequence("job_posting_seq", start=50, increment=50), primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    salaryLower = Column(Integer, default=0)
    salaryHigher = Column(Integer, default=0)
    
    status = Column(Enum(PostingStatus))
    hiring_manager_id = Column(Integer, ForeignKey("hiring_managers.id"))
    
    type = Column(Enum(JobType))
    workingHoursPerDay = Column(SmallInteger, default=8)
    role_id = Column(Integer, ForeignKey("roles.id"))
    
    # Embedded Location
    country = Column(String)
    state = Column(String)
    city = Column(String)
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    workMode = Column(Enum(WorkMode))
    minimumExperienceInMonths = Column(Integer)
    
    postedAt = Column(DateTime, default=func.now())
    expiresAt = Column(DateTime)
    
    hiringManager = relationship("HiringManager", back_populates="jobPostings")
    role = relationship("RoleEntity", back_populates="job_postings")
    company = relationship("Company")
    skillRequirements = relationship("JobSkillRequirement", back_populates="jobPosting", cascade="all, delete-orphan")
    jobApplications = relationship("JobApplication", back_populates="jobPosting", cascade="all, delete-orphan")


class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(Integer, Sequence("job_application_seq", start=50, increment=50), primary_key=True, index=True)
    status = Column(Enum(ApplicationStatus))
    coverLetter = Column(String)
    appliedAt = Column(DateTime, default=func.now())
    
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    job_posting_id = Column(Integer, ForeignKey("job_postings.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    
    candidate = relationship("Candidate", back_populates="jobApplications")
    jobPosting = relationship("JobPosting", back_populates="jobApplications")
    resume = relationship("Resume")


class JobRound(Base):
    __tablename__ = "job_rounds"
    
    id = Column(Integer, Sequence("job_round_seq", start=50, increment=50), primary_key=True, index=True)
    feedback = Column(Text)
    roundNumber = Column(SmallInteger)
    roundName = Column(String)
    rating = Column(SmallInteger)
    at = Column(DateTime)
    
    hr_id = Column(Integer, ForeignKey("hiring_managers.id"))
    job_id = Column(Integer, ForeignKey("job_applications.id"))
    
    hiringManager = relationship("HiringManager")
    application = relationship("JobApplication")


class JobSkillRequirement(Base):
    __tablename__ = "job_skills"
    
    job_posting_id = Column(Integer, ForeignKey("job_postings.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    proficiency = Column(Enum(Proficiency))
    required = Column(Boolean, default=False, nullable=False)
    
    jobPosting = relationship("JobPosting", back_populates="skillRequirements")
    skill = relationship("Skill")
