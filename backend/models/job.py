from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import (
    Integer, String, Sequence, ForeignKey, Text, SmallInteger, DateTime,
    Enum, Boolean, BigInteger, CheckConstraint, Index, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from core.database import Base
from .enums import PostingStatus, JobType, WorkMode, ApplicationStatus, Proficiency

if TYPE_CHECKING:
    from .company import Company, HiringManager
    from .catalog import RoleEntity, Skill
    from .candidate import Candidate, Resume

class JobPosting(Base):
    __tablename__ = "job_postings"
    __table_args__ = (
        CheckConstraint("salary_lower <= salary_higher", name="chk_job_postings_salary"),
        CheckConstraint("salary_lower >= 0 AND salary_higher >= 0", name="chk_job_postings_salary_pos"),
        CheckConstraint("status IS NULL OR status IN ('DRAFT', 'OPEN', 'CLOSED')", name="chk_job_postings_status"),
        CheckConstraint("type IS NULL OR type IN ('INTERN', 'FULL_TIME', 'PART_TIME')", name="chk_job_postings_type"),
        CheckConstraint("work_mode IS NULL OR work_mode IN ('REMOTE', 'ONSITE', 'HYBRID')", name="chk_job_postings_work_mode"),
        CheckConstraint("working_hours_per_day IS NULL OR (working_hours_per_day > 0 AND working_hours_per_day <= 24)", name="chk_job_postings_work_hours"),
        CheckConstraint("minimum_experience_in_months IS NULL OR minimum_experience_in_months >= 0", name="chk_job_postings_exp"),
        Index("company_index", "company_id"),
        Index("role_index", "role_id", "status"),
        Index("salary_index", "salary_higher", "salary_lower"),
        Index("idx_job_postings_hiring_manager", "hiring_manager_id"),
        Index("idx_job_postings_work_mode", "work_mode"),
        Index("idx_job_postings_status", "status"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("job_posting_seq", start=1, increment=50), primary_key=True)
    title: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    salaryLower: Mapped[int] = mapped_column("salary_lower", Integer, nullable=False, server_default="0", default=0)
    salaryHigher: Mapped[int] = mapped_column("salary_higher", Integer, nullable=False, server_default="0", default=0)
    
    status: Mapped[PostingStatus | None] = mapped_column(Enum(PostingStatus, native_enum=False, length=20))
    hiring_manager_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("hiring_managers.id", ondelete="SET NULL", name="fk_job_postings_hiring_manager"))
    
    type: Mapped[JobType | None] = mapped_column(Enum(JobType, native_enum=False, length=20))
    workingHoursPerDay: Mapped[int] = mapped_column("working_hours_per_day", SmallInteger, server_default="8", default=8)
    role_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("roles.id", ondelete="SET NULL", name="fk_job_postings_role"))
    
    # Embedded Location
    country: Mapped[str | None] = mapped_column(String(255))
    state: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str | None] = mapped_column(String(255))
    
    company_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("companies.id", ondelete="CASCADE", name="fk_job_postings_company"))
    workMode: Mapped[WorkMode | None] = mapped_column("work_mode", Enum(WorkMode, native_enum=False, length=20))
    minimumExperienceInMonths: Mapped[int | None] = mapped_column("minimum_experience_in_months", Integer)
    
    postedAt: Mapped[datetime] = mapped_column("posted_at", DateTime, server_default=func.now())
    expiresAt: Mapped[datetime | None] = mapped_column("expires_at", DateTime)
    
    hiringManager: Mapped["HiringManager | None"] = relationship(back_populates="jobPostings")
    role: Mapped["RoleEntity | None"] = relationship(back_populates="job_postings")
    company: Mapped["Company | None"] = relationship()
    skillRequirements: Mapped[list["JobSkillRequirement"]] = relationship(back_populates="jobPosting", cascade="all, delete-orphan")
    jobApplications: Mapped[list["JobApplication"]] = relationship(back_populates="jobPosting", cascade="all, delete-orphan")


class JobApplication(Base):
    __tablename__ = "job_applications"
    __table_args__ = (
        UniqueConstraint("candidate_id", "job_posting_id", name="unique_candidate_id_job_posting_id"),
        CheckConstraint("status IS NULL OR status IN ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'APPROVED')", name="chk_job_applications_status"),
        Index("candidate_index", "candidate_id"),
        Index("idx_job_applications_job_posting_id", "job_posting_id"),
        Index("idx_job_applications_resume_id", "resume_id"),
        Index("idx_job_applications_status", "status"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("job_application_seq", start=1, increment=50), primary_key=True)
    status: Mapped[ApplicationStatus | None] = mapped_column(Enum(ApplicationStatus, native_enum=False, length=20))
    coverLetter: Mapped[str | None] = mapped_column("cover_letter", Text)
    appliedAt: Mapped[datetime] = mapped_column("applied_at", DateTime, server_default=func.now())
    
    candidate_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("candidates.id", ondelete="CASCADE", name="fk_job_applications_candidate"))
    job_posting_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("job_postings.id", ondelete="CASCADE", name="fk_job_applications_job_posting"))
    resume_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("resumes.id", ondelete="SET NULL", name="fk_job_applications_resume"), nullable=True)
    
    candidate: Mapped["Candidate | None"] = relationship(back_populates="jobApplications")
    jobPosting: Mapped["JobPosting | None"] = relationship(back_populates="jobApplications")
    resume: Mapped["Resume | None"] = relationship()


class JobRound(Base):
    __tablename__ = "job_rounds"
    __table_args__ = (
        CheckConstraint("rating IS NULL OR (rating BETWEEN 1 AND 10)", name="chk_job_rounds_rating"),
        Index("idx_job_rounds_application_id", "job_id"),
        Index("idx_job_rounds_hr_id", "hr_id"),
    )
    
    id: Mapped[int] = mapped_column(BigInteger, Sequence("job_round_seq", start=1, increment=50), primary_key=True)
    feedback: Mapped[str | None] = mapped_column(Text)
    roundNumber: Mapped[int | None] = mapped_column("round_number", SmallInteger)
    roundName: Mapped[str | None] = mapped_column("round_name", String(255))
    rating: Mapped[int | None] = mapped_column(SmallInteger)
    at: Mapped[datetime | None] = mapped_column(DateTime)
    
    hr_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("hiring_managers.id", ondelete="SET NULL", name="fk_job_rounds_hiring_manager"))
    job_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("job_applications.id", ondelete="CASCADE", name="fk_job_rounds_job_application"))
    
    hiringManager: Mapped["HiringManager | None"] = relationship()
    application: Mapped["JobApplication | None"] = relationship()


class JobSkillRequirement(Base):
    __tablename__ = "job_skills"
    __table_args__ = (
        UniqueConstraint("job_posting_id", "skill_id", name="unique_job_skill"),
        CheckConstraint("proficiency IS NULL OR proficiency IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')", name="chk_job_skills_proficiency"),
        Index("job_skill_prof_idx", "skill_id", "proficiency"),
        Index("idx_job_skills_posting_id", "job_posting_id"),
    )
    
    job_posting_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("job_postings.id", ondelete="CASCADE", name="fk_job_skills_job_posting"), primary_key=True)
    skill_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("skills.id", ondelete="CASCADE", name="fk_job_skills_skill"), primary_key=True)
    proficiency: Mapped[Proficiency | None] = mapped_column(Enum(Proficiency, native_enum=False, length=20))
    required: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false", default=False)
    
    jobPosting: Mapped["JobPosting"] = relationship(back_populates="skillRequirements")
    skill: Mapped["Skill"] = relationship()


