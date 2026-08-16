from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base
from .enums import Gender, Proficiency

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, Sequence("candidate_seq", start=50, increment=50), primary_key=True, index=True)
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=False)
    age = Column(Integer)
    profilePictureUrl = Column(String(512))
    gender = Column(Enum(Gender))
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    description = Column(Text)
    
    # Embedded Location
    country = Column(String)
    state = Column(String)
    city = Column(String)
    
    resumes = relationship("Resume", back_populates="candidate", cascade="all, delete-orphan")
    candidateSkills = relationship("CandidateSkill", back_populates="candidate", cascade="all, delete-orphan")
    candidateExperiences = relationship("CandidateExperience", back_populates="candidate", cascade="all, delete-orphan")
    jobApplications = relationship("JobApplication", back_populates="candidate", cascade="all, delete-orphan")
    company_reviews = relationship("CompanyReview", back_populates="candidate", cascade="all, delete-orphan")


class CandidateExperience(Base):
    __tablename__ = "candidate_experiences"
    
    id = Column(Integer, Sequence("candidate_exp_seq", start=50, increment=50), primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    organizationName = Column(String)
    description = Column(String)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    
    fromDate = Column(DateTime, nullable=False)
    toDate = Column(DateTime)
    
    role = relationship("RoleEntity")
    company = relationship("Company")
    candidate = relationship("Candidate", back_populates="candidateExperiences")


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"
    
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), primary_key=True)
    proficiency = Column(Enum(Proficiency), nullable=False)
    
    skill = relationship("Skill")
    candidate = relationship("Candidate", back_populates="candidateSkills")


class CandidateInterests(Base):
    __tablename__ = "candidate_interests"
    
    candidateId = Column(Integer, ForeignKey("candidates.id"), primary_key=True)
    roleId = Column(Integer, ForeignKey("roles.id"), primary_key=True)


class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, Sequence("resumes_seq", start=50, increment=50), primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    actualName = Column(String)
    storedPath = Column(String)
    uploadedAt = Column(DateTime, default=func.now())
    content = Column(Text)
    
    candidate = relationship("Candidate", back_populates="resumes")
