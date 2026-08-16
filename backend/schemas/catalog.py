from pydantic import BaseModel
from typing import Optional

class SkillBase(BaseModel):
    name: str

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True

class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    id: int

    class Config:
        from_attributes = True

class IndustryBase(BaseModel):
    name: str

class IndustryCreate(IndustryBase):
    pass

class IndustryResponse(IndustryBase):
    id: int

    class Config:
        from_attributes = True
