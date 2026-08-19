from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import (
    String, Sequence, ForeignKey, Text, SmallInteger, DateTime,
    Enum, BigInteger, CheckConstraint, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from core.database import Base
from .enums import Gender

if TYPE_CHECKING:
    from .catalog import Industry
    from .candidate import Candidate
    from .job import JobPosting

class Company(Base):
    __tablename__ = "companies"
    __table_args__ = (
        Index("idx_companies_industry_id", "industry_id"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("company_seq", start=1, increment=50), primary_key=True)
    name: Mapped[str | None] = mapped_column(String(70))
    companyProfileUrl: Mapped[str | None] = mapped_column("company_profile_url", String(255))
    email: Mapped[str | None] = mapped_column(String(255))
    password: Mapped[str | None] = mapped_column(String(255))
    
    # Embedded Location
    country: Mapped[str | None] = mapped_column(String(255))
    state: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str | None] = mapped_column(String(255))
    
    industry_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("industries.id", ondelete="SET NULL", name="fk_companies_industry"))
    
    industry: Mapped["Industry | None"] = relationship(back_populates="companies")
    departments: Mapped[list["Department"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    reviews: Mapped[list["CompanyReview"]] = relationship(back_populates="company", cascade="all, delete-orphan")


class CompanyReview(Base):
    __tablename__ = "company_reviews"
    __table_args__ = (
        CheckConstraint("stars IS NULL OR (stars BETWEEN 1 AND 5)", name="chk_company_reviews_stars"),
        Index("review_company_index", "company_id"),
        Index("review_candidate_index", "candidate_id"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("company_review_seq", start=1, increment=50), primary_key=True)
    text: Mapped[str | None] = mapped_column(Text)
    stars: Mapped[int | None] = mapped_column(SmallInteger)
    createdAt: Mapped[datetime] = mapped_column("created_at", DateTime, server_default=func.now())
    
    candidate_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("candidates.id", ondelete="CASCADE", name="fk_company_reviews_candidate"), nullable=False)
    company_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("companies.id", ondelete="CASCADE", name="fk_company_reviews_company"), nullable=False)
    
    candidate: Mapped["Candidate"] = relationship(back_populates="company_reviews")
    company: Mapped["Company"] = relationship(back_populates="reviews")


class Department(Base):
    __tablename__ = "hiring_departments"
    __table_args__ = (
        Index("idx_hiring_departments_company_id", "company_id"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("hiring_department_seq", start=1, increment=50), primary_key=True)
    name: Mapped[str | None] = mapped_column(String(255))
    
    company_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("companies.id", ondelete="CASCADE", name="fk_hiring_departments_company"))
    
    company: Mapped["Company | None"] = relationship(back_populates="departments")
    hiringManagers: Mapped[list["HiringManager"]] = relationship(back_populates="hiringDepartment", cascade="all, delete-orphan")


class HiringManager(Base):
    __tablename__ = "hiring_managers"
    __table_args__ = (
        CheckConstraint("gender IS NULL OR gender IN ('MALE', 'FEMALE')", name="chk_hiring_managers_gender"),
        Index("idx_hiring_managers_department_id", "department_id"),
        Index("idx_hiring_managers_email", "email"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("hr_seq", start=1, increment=50), primary_key=True)
    firstName: Mapped[str | None] = mapped_column("first_name", String(255))
    lastName: Mapped[str | None] = mapped_column("last_name", String(255))
    gender: Mapped[Gender | None] = mapped_column(Enum(Gender, native_enum=False, length=20))
    email: Mapped[str | None] = mapped_column(String(255))
    password: Mapped[str | None] = mapped_column(String(255))
    
    department_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("hiring_departments.id", ondelete="SET NULL", name="fk_hiring_managers_department"))
    
    hiringDepartment: Mapped["Department | None"] = relationship(back_populates="hiringManagers")
    jobPostings: Mapped[list["JobPosting"]] = relationship(back_populates="hiringManager", cascade="all, delete-orphan")


