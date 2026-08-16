from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.orm import relationship
from core.database import Base

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, Sequence("skill_seq", start=50, increment=50), primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

class RoleEntity(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, Sequence("role_seq", start=50, increment=50), primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    job_postings = relationship("JobPosting", back_populates="role")

class Industry(Base):
    __tablename__ = "industries"
    
    id = Column(Integer, Sequence("industry_seq", start=50, increment=50), primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    companies = relationship("Company", back_populates="industry")
