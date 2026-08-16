from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models.enums import Gender

# Department Schemas
class DepartmentBase(BaseModel):
    name: str
    company_id: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int

    class Config:
        from_attributes = True

# Hiring Manager Schemas
class HiringManagerBase(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    gender: Optional[Gender] = None
    department_id: Optional[int] = None

class HiringManagerCreate(HiringManagerBase):
    password: str

class HiringManagerResponse(HiringManagerBase):
    id: int

    class Config:
        from_attributes = True

# Company Review Schemas
class CompanyReviewBase(BaseModel):
    text: str
    stars: int
    company_id: int

class CompanyReviewCreate(CompanyReviewBase):
    pass

class CompanyReviewResponse(CompanyReviewBase):
    id: int
    candidate_id: int
    createdAt: datetime

    class Config:
        from_attributes = True

# Company Schemas
class CompanyBase(BaseModel):
    name: str
    companyProfileUrl: Optional[str] = None
    email: EmailStr
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    industry_id: Optional[int] = None

class CompanyCreate(CompanyBase):
    password: str

class CompanyResponse(CompanyBase):
    id: int
    departments: List[DepartmentResponse] = []

    class Config:
        from_attributes = True
