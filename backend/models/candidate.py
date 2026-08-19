from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import (
    Integer, String, Sequence, ForeignKey, Text, DateTime,
    Enum, BigInteger, CheckConstraint, Index, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from core.database import Base
from .enums import Gender, Proficiency

if TYPE_CHECKING:
    from .catalog import Skill, RoleEntity
    from .company import Company, CompanyReview
    from .job import JobApplication

class Candidate(Base):
    __tablename__ = "candidates"
    __table_args__ = (
        UniqueConstraint("email", name="uk_candidates_email"),
        CheckConstraint("gender IS NULL OR gender IN ('MALE', 'FEMALE')", name="chk_candidates_gender"),
        CheckConstraint("age IS NULL OR age >= 0", name="chk_candidates_age"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("candidate_seq", start=1, increment=50), primary_key=True)
    firstName: Mapped[str] = mapped_column("first_name", String(255), nullable=False)
    lastName: Mapped[str] = mapped_column("last_name", String(255), nullable=False)
    age: Mapped[int | None] = mapped_column(Integer)
    profilePictureUrl: Mapped[str | None] = mapped_column("profile_picture_url", String(512))
    gender: Mapped[Gender | None] = mapped_column(Enum(Gender, native_enum=False, length=20))
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    
    # Embedded Location
    country: Mapped[str | None] = mapped_column(String(255))
    state: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str | None] = mapped_column(String(255))
    
    resumes: Mapped[list["Resume"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    candidateSkills: Mapped[list["CandidateSkill"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    candidateExperiences: Mapped[list["CandidateExperience"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    jobApplications: Mapped[list["JobApplication"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    company_reviews: Mapped[list["CompanyReview"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")


class CandidateExperience(Base):
    __tablename__ = "candidate_experiences"
    __table_args__ = (
        CheckConstraint("to_date IS NULL OR to_date >= from_date", name="chk_candidate_exp_dates"),
        Index("idx_candidate_exp_candidate_id", "candidate_id"),
        Index("idx_candidate_exp_role_id", "role_id"),
        Index("idx_candidate_exp_company_id", "company_id"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("candidate_exp_seq", start=1, increment=50), primary_key=True)
    role_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("roles.id", ondelete="SET NULL", name="fk_candidate_experiences_role"))
    organizationName: Mapped[str | None] = mapped_column("organization_name", String(255))
    description: Mapped[str | None] = mapped_column(String(255))
    company_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("companies.id", ondelete="SET NULL", name="fk_candidate_experiences_company"), nullable=True)
    candidate_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("candidates.id", ondelete="CASCADE", name="fk_candidate_experiences_candidate"))
    
    fromDate: Mapped[datetime] = mapped_column("from_date", DateTime, nullable=False)
    toDate: Mapped[datetime | None] = mapped_column("to_date", DateTime)
    
    role: Mapped["RoleEntity | None"] = relationship()
    company: Mapped["Company | None"] = relationship()
    candidate: Mapped["Candidate | None"] = relationship(back_populates="candidateExperiences")


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"
    __table_args__ = (
        UniqueConstraint("skill_id", "candidate_id", name="unique_candidate_skill"),
        CheckConstraint("proficiency IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')", name="chk_candidate_skill_proficiency"),
        Index("candidate_skill_idx", "skill_id", "proficiency"),
        Index("idx_candidate_skills_candidate_id", "candidate_id"),
    )
    
    skill_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("skills.id", ondelete="CASCADE", name="fk_candidate_skills_skill"), primary_key=True)
    candidate_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("candidates.id", ondelete="CASCADE", name="fk_candidate_skills_candidate"), primary_key=True)
    proficiency: Mapped[Proficiency] = mapped_column(Enum(Proficiency, native_enum=False, length=20), nullable=False)
    
    skill: Mapped["Skill"] = relationship()
    candidate: Mapped["Candidate"] = relationship(back_populates="candidateSkills")


class CandidateInterests(Base):
    __tablename__ = "candidate_interests"
    __table_args__ = (
        Index("idx_candidate_interests_role_id", "role_id"),
    )
    
    candidateId: Mapped[int] = mapped_column("candidate_id", BigInteger, ForeignKey("candidates.id", ondelete="CASCADE", name="fk_candidate_interests_candidate"), primary_key=True)
    roleId: Mapped[int] = mapped_column("role_id", BigInteger, ForeignKey("roles.id", ondelete="CASCADE", name="fk_candidate_interests_role"), primary_key=True)


class Resume(Base):
    __tablename__ = "resumes"
    __table_args__ = (
        Index("idx_resumes_candidate_id", "candidate_id"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("resumes_seq", start=1, increment=50), primary_key=True)
    candidate_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("candidates.id", ondelete="CASCADE", name="fk_resumes_candidate"))
    actualName: Mapped[str | None] = mapped_column("actual_name", String(255))
    storedPath: Mapped[str | None] = mapped_column("stored_path", String(255))
    uploadedAt: Mapped[datetime] = mapped_column("uploaded_at", DateTime, server_default=func.now())
    content: Mapped[str | None] = mapped_column(Text)
    
    candidate: Mapped["Candidate | None"] = relationship(back_populates="resumes")


