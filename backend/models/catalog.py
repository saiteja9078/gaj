from typing import TYPE_CHECKING
from sqlalchemy import String, Sequence, BigInteger, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base

if TYPE_CHECKING:
    from .job import JobPosting
    from .company import Company

class Skill(Base):
    __tablename__ = "skills"
    __table_args__ = (
        UniqueConstraint("name", name="unique_skill_contraint"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("skill_seq", start=1, increment=50), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

class RoleEntity(Base):
    __tablename__ = "roles"
    __table_args__ = (
        UniqueConstraint("name", name="unique_role"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("role_seq", start=1, increment=50), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    job_postings: Mapped[list["JobPosting"]] = relationship(back_populates="role")

class Industry(Base):
    __tablename__ = "industries"
    __table_args__ = (
        UniqueConstraint("name", name="unique_dpt_constrain"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("industry_seq", start=1, increment=50), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    companies: Mapped[list["Company"]] = relationship(back_populates="industry")


