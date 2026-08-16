from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Text, SmallInteger, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base
from .enums import Gender

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, Sequence("company_seq", start=50, increment=50), primary_key=True, index=True)
    name = Column(String(70))
    companyProfileUrl = Column(String)
    email = Column(String)
    password = Column(String)
    
    # Embedded Location
    country = Column(String)
    state = Column(String)
    city = Column(String)
    
    industry_id = Column(Integer, ForeignKey("industries.id"))
    
    industry = relationship("Industry", back_populates="companies")
    departments = relationship("Department", back_populates="company", cascade="all, delete-orphan")
    reviews = relationship("CompanyReview", back_populates="company", cascade="all, delete-orphan")


class CompanyReview(Base):
    __tablename__ = "company_reviews"
    
    id = Column(Integer, Sequence("company_review_seq", start=50, increment=50), primary_key=True, index=True)
    text = Column(Text)
    stars = Column(SmallInteger)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    
    candidate = relationship("Candidate", back_populates="company_reviews")
    company = relationship("Company", back_populates="reviews")


class Department(Base):
    __tablename__ = "hiring_departments"
    
    id = Column(Integer, Sequence("hiring_department_seq", start=50, increment=50), primary_key=True, index=True)
    name = Column(String)
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    company = relationship("Company", back_populates="departments")
    hiringManagers = relationship("HiringManager", back_populates="hiringDepartment", cascade="all, delete-orphan")


class HiringManager(Base):
    __tablename__ = "hiring_managers"
    
    id = Column(Integer, Sequence("hr_seq", start=50, increment=50), primary_key=True, index=True)
    firstName = Column(String)
    lastName = Column(String)
    gender = Column(Enum(Gender))
    email = Column(String)
    password = Column(String)
    
    department_id = Column(Integer, ForeignKey("hiring_departments.id"))
    
    hiringDepartment = relationship("Department", back_populates="hiringManagers")
    jobPostings = relationship("JobPosting", back_populates="hiringManager", cascade="all, delete-orphan")
