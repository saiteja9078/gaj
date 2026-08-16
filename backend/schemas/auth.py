from pydantic import BaseModel, EmailStr
from typing import Optional
from models.enums import Gender

class AuthenticationRequest(BaseModel):
    email: EmailStr
    password: str

class AuthenticationResponse(BaseModel):
    token: str
    type: str = "Bearer"

class CandidateSignupRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    gender: Optional[Gender] = None
    description: Optional[str] = None

class CompanySignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    industry_id: int
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None

class HiringManagerSignupRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    gender: Optional[Gender] = None
    department_id: int
