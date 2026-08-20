import os
import sys
from datetime import datetime, timedelta, timezone
BACKEND_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.append(BACKEND_DIR)

from core.database import SessionLocal
from core.security import get_password_hash
import models

from models.enums import (
    ApplicationStatus,
    Gender,
    PostingStatus,
    Proficiency,
    JobType,
    WorkMode,
)
from models.catalog import Skill, RoleEntity
from models.company import Company, Department, HiringManager
from models.candidate import Candidate, CandidateExperience, CandidateSkill
from models.job import JobPosting, JobApplication, JobSkillRequirement


# ============================================================
# CONFIG
# ============================================================

COMPANY_EMAIL = "saitejabrawl@gmail.com"
HIRING_MANAGER_EMAIL = "saitejaxbox@gmail.com"
DEFAULT_PASSWORD = "password123"

# How much data to generate
NUMBER_OF_JOBS = 25
NUMBER_OF_CANDIDATES = 100

# Every generated candidate applies to several jobs.
APPLICATIONS_PER_CANDIDATE = 4


def get_or_create_skill(db, name):
    skill = db.query(Skill).filter(Skill.name == name).first()

    if not skill:
        skill = Skill(name=name)
        db.add(skill)
        db.flush()

    return skill


def get_or_create_role(db, name):
    role = db.query(RoleEntity).filter(RoleEntity.name == name).first()

    if not role:
        role = RoleEntity(name=name)
        db.add(role)
        db.flush()

    return role


def seed():
    db = SessionLocal()

    try:
        print("Looking for company...")

        # --------------------------------------------------------
        # 1. FIND YOUR COMPANY
        # --------------------------------------------------------

        company = (
            db.query(Company)
            .filter(Company.email == COMPANY_EMAIL)
            .first()
        )

        if not company:
            raise RuntimeError(
                f"Company with email '{COMPANY_EMAIL}' does not exist."
            )

        print(
            f"✓ Found company: {company.name} "
            f"(id={company.id})"
        )

        # --------------------------------------------------------
        # 2. CREATE / FIND DEPARTMENT
        # --------------------------------------------------------

        department = (
            db.query(Department)
            .filter(
                Department.company_id == company.id,
                Department.name == "Engineering & Technology",
            )
            .first()
        )

        if not department:
            department = Department(
                name="Engineering & Technology",
                company_id=company.id,
            )

            db.add(department)
            db.flush()

        # --------------------------------------------------------
        # 3. CREATE / FIND HIRING MANAGER
        # --------------------------------------------------------

        hiring_manager = (
            db.query(HiringManager)
            .filter(
                HiringManager.email == HIRING_MANAGER_EMAIL
            )
            .first()
        )

        if not hiring_manager:
            hiring_manager = HiringManager(
                firstName="Sai",
                lastName="XBox",
                email=HIRING_MANAGER_EMAIL,
                gender=Gender.MALE,
                password=get_password_hash(DEFAULT_PASSWORD),
                department_id=department.id,
            )

            db.add(hiring_manager)
            db.flush()

            print(
                f"✓ Created hiring manager: "
                f"{HIRING_MANAGER_EMAIL}"
            )
        else:
            print(
                f"✓ Hiring manager already exists: "
                f"{HIRING_MANAGER_EMAIL}"
            )

        # --------------------------------------------------------
        # 4. SKILLS
        # --------------------------------------------------------

        skill_names = [
            "Python",
            "FastAPI",
            "Django",
            "Java",
            "Spring Boot",
            "JavaScript",
            "TypeScript",
            "React",
            "Next.js",
            "Node.js",
            "Go",
            "Rust",
            "C++",
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Redis",
            "Apache Kafka",
            "RabbitMQ",
            "Docker",
            "Kubernetes",
            "AWS",
            "GCP",
            "Azure",
            "Terraform",
            "CI/CD",
            "GraphQL",
            "REST APIs",
            "Microservices",
            "Git",
            "Linux",
            "PyTorch",
            "TensorFlow",
            "Scikit-learn",
            "LLMs & GenAI",
            "RAG",
            "LangChain",
            "MLflow",
            "Apache Spark",
            "Airflow",
            "Pandas",
            "NumPy",
            "Selenium",
            "Playwright",
            "Pytest",
            "Figma",
            "Agile/Scrum",
            "gRPC",
            "WebSockets",
            "System Design",
            "Distributed Systems",
        ]

        skill_map = {}

        for name in skill_names:
            skill_map[name] = get_or_create_skill(db, name)

        # --------------------------------------------------------
        # 5. ROLES
        # --------------------------------------------------------

        role_names = [
            "Full Stack Software Engineer",
            "Senior Backend Engineer",
            "Frontend Engineer",
            "DevOps & Cloud Engineer",
            "Machine Learning Engineer",
            "Data Scientist",
            "Site Reliability Engineer (SRE)",
            "Security Engineer",
            "QA Automation Engineer",
            "Data Engineer",
            "Platform Engineer",
            "MLOps Engineer",
        ]

        role_map = {}

        for name in role_names:
            role_map[name] = get_or_create_role(db, name)

        # --------------------------------------------------------
        # 6. CREATE MANY JOBS FOR THIS COMPANY
        # --------------------------------------------------------

        job_templates = [
            {
                "title": "Backend Engineer",
                "role": "Senior Backend Engineer",
                "skills": [
                    ("Python", Proficiency.ADVANCED, True),
                    ("FastAPI", Proficiency.ADVANCED, True),
                    ("PostgreSQL", Proficiency.ADVANCED, True),
                    ("Redis", Proficiency.INTERMEDIATE, False),
                    ("Docker", Proficiency.INTERMEDIATE, False),
                ],
            },
            {
                "title": "Full Stack Engineer",
                "role": "Full Stack Software Engineer",
                "skills": [
                    ("Python", Proficiency.ADVANCED, True),
                    ("React", Proficiency.ADVANCED, True),
                    ("TypeScript", Proficiency.ADVANCED, True),
                    ("PostgreSQL", Proficiency.INTERMEDIATE, False),
                    ("REST APIs", Proficiency.ADVANCED, True),
                ],
            },
            {
                "title": "React Frontend Engineer",
                "role": "Frontend Engineer",
                "skills": [
                    ("React", Proficiency.EXPERT, True),
                    ("TypeScript", Proficiency.ADVANCED, True),
                    ("JavaScript", Proficiency.EXPERT, True),
                    ("Next.js", Proficiency.INTERMEDIATE, False),
                    ("Git", Proficiency.INTERMEDIATE, False),
                ],
            },
            {
                "title": "Cloud Infrastructure Engineer",
                "role": "DevOps & Cloud Engineer",
                "skills": [
                    ("AWS", Proficiency.ADVANCED, True),
                    ("Docker", Proficiency.ADVANCED, True),
                    ("Kubernetes", Proficiency.ADVANCED, True),
                    ("Terraform", Proficiency.ADVANCED, True),
                    ("CI/CD", Proficiency.ADVANCED, True),
                ],
            },
            {
                "title": "Machine Learning Engineer",
                "role": "Machine Learning Engineer",
                "skills": [
                    ("Python", Proficiency.EXPERT, True),
                    ("PyTorch", Proficiency.ADVANCED, True),
                    ("Scikit-learn", Proficiency.ADVANCED, True),
                    ("MLflow", Proficiency.INTERMEDIATE, False),
                    ("Docker", Proficiency.INTERMEDIATE, False),
                ],
            },
            {
                "title": "Generative AI Engineer",
                "role": "Machine Learning Engineer",
                "skills": [
                    ("Python", Proficiency.EXPERT, True),
                    ("LLMs & GenAI", Proficiency.EXPERT, True),
                    ("RAG", Proficiency.ADVANCED, True),
                    ("LangChain", Proficiency.ADVANCED, False),
                    ("FastAPI", Proficiency.INTERMEDIATE, False),
                ],
            },
            {
                "title": "Data Engineer",
                "role": "Data Engineer",
                "skills": [
                    ("Python", Proficiency.ADVANCED, True),
                    ("Apache Spark", Proficiency.ADVANCED, True),
                    ("Airflow", Proficiency.ADVANCED, True),
                    ("PostgreSQL", Proficiency.ADVANCED, True),
                    ("AWS", Proficiency.INTERMEDIATE, False),
                ],
            },
            {
                "title": "Platform Engineer",
                "role": "Platform Engineer",
                "skills": [
                    ("Go", Proficiency.ADVANCED, True),
                    ("Kubernetes", Proficiency.EXPERT, True),
                    ("Docker", Proficiency.ADVANCED, True),
                    ("gRPC", Proficiency.INTERMEDIATE, False),
                    ("Linux", Proficiency.ADVANCED, True),
                ],
            },
            {
                "title": "SRE Engineer",
                "role": "Site Reliability Engineer (SRE)",
                "skills": [
                    ("Kubernetes", Proficiency.EXPERT, True),
                    ("Docker", Proficiency.ADVANCED, True),
                    ("Linux", Proficiency.EXPERT, True),
                    ("AWS", Proficiency.ADVANCED, True),
                    ("Terraform", Proficiency.INTERMEDIATE, False),
                ],
            },
            {
                "title": "QA Automation Engineer",
                "role": "QA Automation Engineer",
                "skills": [
                    ("Python", Proficiency.ADVANCED, True),
                    ("Selenium", Proficiency.ADVANCED, True),
                    ("Playwright", Proficiency.ADVANCED, True),
                    ("Pytest", Proficiency.EXPERT, True),
                    ("CI/CD", Proficiency.INTERMEDIATE, False),
                ],
            },
            {
                "title": "Java Backend Engineer",
                "role": "Senior Backend Engineer",
                "skills": [
                    ("Java", Proficiency.EXPERT, True),
                    ("Spring Boot", Proficiency.EXPERT, True),
                    ("PostgreSQL", Proficiency.ADVANCED, True),
                    ("Kafka", Proficiency.INTERMEDIATE, False),
                    ("Docker", Proficiency.INTERMEDIATE, False),
                ],
            },
            {
                "title": "Distributed Systems Engineer",
                "role": "Senior Backend Engineer",
                "skills": [
                    ("Go", Proficiency.EXPERT, True),
                    ("Distributed Systems", Proficiency.EXPERT, True),
                    ("Apache Kafka", Proficiency.ADVANCED, True),
                    ("gRPC", Proficiency.ADVANCED, True),
                    ("PostgreSQL", Proficiency.ADVANCED, False),
                ],
            },
        ]

        job_map = {}

        existing_jobs = (
            db.query(JobPosting)
            .filter(JobPosting.company_id == company.id)
            .all()
        )

        for job in existing_jobs:
            job_map[job.title] = job

        for i in range(NUMBER_OF_JOBS):
            template = job_templates[i % len(job_templates)]

            title = (
                f"{template['title']} "
                f"{['I', 'II', 'III', 'IV', 'V'][i % 5]} "
                f"- Opening {i + 1}"
            )

            if title in job_map:
                continue

            experience = [0, 6, 12, 18, 24, 36, 48, 60][i % 8]

            salary_lower = 600000 + (i % 8) * 250000
            salary_upper = salary_lower + 800000 + (i % 5) * 300000

            job = JobPosting(
                title=title,
                description=(
                    f"We are looking for a {template['title']} to join "
                    f"{company.name}. The engineer will work on production "
                    f"systems, collaborate with product and engineering teams, "
                    f"and build reliable, scalable software."
                ),
                salaryLower=salary_lower,
                salaryHigher=salary_upper,
                status=PostingStatus.OPEN,
                type=JobType.INTERN if i % 17 == 0 else JobType.FULL_TIME,
                workingHoursPerDay=8,
                role_id=role_map[template["role"]].id,
                country=company.country,
                state=company.state,
                city=company.city,
                company_id=company.id,
                workMode=[
                    WorkMode.REMOTE,
                    WorkMode.HYBRID,
                    WorkMode.ONSITE,
                ][i % 3],
                minimumExperienceInMonths=experience,
                postedAt=datetime.now(timezone.utc) - timedelta(days=i + 1),
                expiresAt=datetime.now(timezone.utc) + timedelta(days=30 + i),
                hiring_manager_id=hiring_manager.id,
            )

            db.add(job)
            db.flush()

            for skill_name, proficiency, required in template["skills"]:
                skill = skill_map.get(skill_name)

                if not skill:
                    continue

                requirement = JobSkillRequirement(
                    job_posting_id=job.id,
                    skill_id=skill.id,
                    proficiency=proficiency,
                    required=required,
                )

                db.add(requirement)

            db.flush()

            job_map[title] = job

        print(f"✓ Company now has {len(job_map)} jobs")

        # --------------------------------------------------------
        # 7. CREATE MANY CANDIDATES
        # --------------------------------------------------------

        first_names = [
            "Aarav", "Vivaan", "Aditya", "Arjun", "Kabir",
            "Ishaan", "Rohan", "Karan", "Rahul", "Vikram",
            "Ananya", "Diya", "Isha", "Meera", "Nisha",
            "Priya", "Kavya", "Sneha", "Aisha", "Riya",
            "Lucas", "Noah", "Ethan", "Oliver", "Emma",
            "Sophia", "Mia", "Daniel", "James", "Alex",
        ]

        last_names = [
            "Sharma", "Patel", "Reddy", "Nair", "Gupta",
            "Mehta", "Rao", "Kapoor", "Iyer", "Verma",
            "Singh", "Khan", "Das", "Joshi", "Bose",
            "Brown", "Wilson", "Martin", "Taylor", "Thomas",
        ]

        locations = [
            ("India", "Andhra Pradesh", "Vijayawada"),
            ("India", "Telangana", "Hyderabad"),
            ("India", "Karnataka", "Bengaluru"),
            ("India", "Maharashtra", "Mumbai"),
            ("India", "Maharashtra", "Pune"),
            ("India", "Tamil Nadu", "Chennai"),
            ("India", "Delhi", "New Delhi"),
            ("India", "Haryana", "Gurugram"),
            ("India", "Kerala", "Kochi"),
            ("United States", "California", "San Jose"),
            ("United States", "Texas", "Austin"),
            ("United Kingdom", "England", "London"),
            ("Germany", "Berlin", "Berlin"),
            ("Singapore", "Central Region", "Singapore"),
        ]

        candidate_skill_sets = [
            ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
            ["Java", "Spring Boot", "PostgreSQL", "Docker", "Git"],
            ["React", "TypeScript", "JavaScript", "Next.js", "REST APIs"],
            ["Python", "PyTorch", "Scikit-learn", "LLMs & GenAI", "FastAPI"],
            ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
            ["Go", "Kubernetes", "gRPC", "Linux", "Distributed Systems"],
            ["Python", "Apache Spark", "Airflow", "Pandas", "PostgreSQL"],
            ["Python", "RAG", "LangChain", "LLMs & GenAI", "FastAPI"],
            ["Selenium", "Playwright", "Pytest", "Java", "CI/CD"],
            ["C++", "Linux", "Docker", "Git", "System Design"],
        ]

        candidate_roles = [
            "Full Stack Software Engineer",
            "Senior Backend Engineer",
            "Frontend Engineer",
            "DevOps & Cloud Engineer",
            "Machine Learning Engineer",
            "Data Engineer",
            "Platform Engineer",
            "QA Automation Engineer",
        ]

        candidates = []

        for i in range(NUMBER_OF_CANDIDATES):
            first = first_names[i % len(first_names)]
            last = last_names[(i * 7) % len(last_names)]

            email = (
                f"{first.lower()}.{last.lower()}.{i + 1}"
                f"@candidate.example.com"
            )

            existing = (
                db.query(Candidate)
                .filter(Candidate.email == email)
                .first()
            )

            if existing:
                candidates.append(existing)
                continue

            country, state, city = locations[i % len(locations)]
            role_name = candidate_roles[i % len(candidate_roles)]

            candidate = Candidate(
                email=email,
                firstName=first,
                lastName=last,
                gender=[
                    Gender.MALE,
                    Gender.FEMALE,
                ][i % 2],
                password=get_password_hash(DEFAULT_PASSWORD),
                country=country,
                state=state,
                city=city,
                description=(
                    f"{(i % 8) + 1}+ years of experience as a "
                    f"{role_name}. Strong background in software engineering, "
                    f"production systems, testing, and collaborative development."
                ),
            )

            db.add(candidate)
            db.flush()

            # ----------------------------------------------
            # Candidate skills
            # ----------------------------------------------

            skills = candidate_skill_sets[i % len(candidate_skill_sets)]

            for j, skill_name in enumerate(skills):
                skill = skill_map[skill_name]

                candidate_skill = CandidateSkill(
                    candidate_id=candidate.id,
                    skill_id=skill.id,
                    proficiency=[
                        Proficiency.INTERMEDIATE,
                        Proficiency.ADVANCED,
                        Proficiency.EXPERT,
                    ][(i + j) % 3],
                )

                db.add(candidate_skill)

            # ----------------------------------------------
            # Candidate experience
            # ----------------------------------------------

            number_of_experiences = 1 + (i % 3)

            for exp_index in range(number_of_experiences):
                role = role_map[
                    candidate_roles[
                        (i + exp_index) % len(candidate_roles)
                    ]
                ]

                start_year = 2019 + ((i + exp_index) % 6)

                experience = CandidateExperience(
                    candidate_id=candidate.id,
                    role_id=role.id,
                    organizationName=[
                        "TechNova Labs",
                        "CloudScale Systems",
                        "DataWorks",
                        "NextGen Technologies",
                        "BlueOrbit Solutions",
                        "Vertex Digital",
                    ][(i + exp_index) % 6],
                    description=(
                        "Designed and implemented production features, "
                        "worked with cross-functional teams, improved "
                        "performance, reliability, and developer velocity."
                    ),
                    fromDate=datetime(start_year, 1, 15),
                    toDate=None if exp_index == 0 else datetime(
                        start_year + 1,
                        6,
                        30,
                    ),
                )

                db.add(experience)

            db.flush()
            candidates.append(candidate)

        print(f"✓ Created/found {len(candidates)} candidates")

        # --------------------------------------------------------
        # 8. MAKE CANDIDATES APPLY TO THIS COMPANY'S JOBS
        # --------------------------------------------------------

        jobs = list(job_map.values())

        statuses = [
            ApplicationStatus.APPLIED,
            ApplicationStatus.SCREENING,
            ApplicationStatus.INTERVIEW,
            ApplicationStatus.OFFER,
        ]

        application_count = 0

        for candidate_index, candidate in enumerate(candidates):
            # Different candidates apply to different jobs.
            start = candidate_index % len(jobs)

            selected_jobs = []

            for offset in range(APPLICATIONS_PER_CANDIDATE):
                job = jobs[
                    (start + offset * 3) % len(jobs)
                ]

                if job not in selected_jobs:
                    selected_jobs.append(job)

            for application_index, job in enumerate(selected_jobs):
                existing_application = (
                    db.query(JobApplication)
                    .filter(
                        JobApplication.candidate_id == candidate.id,
                        JobApplication.job_posting_id == job.id,
                    )
                    .first()
                )

                if existing_application:
                    continue

                application = JobApplication(
                    candidate_id=candidate.id,
                    job_posting_id=job.id,
                    status=statuses[
                        (candidate_index + application_index)
                        % len(statuses)
                    ],
                    coverLetter=(
                        f"Dear hiring team, I am excited to apply for "
                        f"the {job.title} position. My background in "
                        f"software engineering and relevant technical "
                        f"skills make me a strong candidate for this role."
                    ),
                    appliedAt=(
                        datetime.now(timezone.utc)
                        - timedelta(
                            days=(candidate_index % 45) + application_index
                        )
                    ),
                )

                db.add(application)
                application_count += 1

        db.commit()

        print()
        print("==========================================")
        print("DATABASE SEED COMPLETE")
        print("==========================================")
        print(f"Company: {company.name}")
        print(f"Company email: {COMPANY_EMAIL}")
        print(f"Hiring manager: {HIRING_MANAGER_EMAIL}")
        print(f"Jobs created/available: {len(job_map)}")
        print(f"Candidates created/found: {len(candidates)}")
        print(f"New applications: {application_count}")
        print(f"Password for generated accounts: {DEFAULT_PASSWORD}")
        print("==========================================")

    except Exception as e:
        db.rollback()
        print(f"❌ Error while seeding company data: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()
