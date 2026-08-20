import os
import sys
from datetime import datetime, timedelta, timezone
import random

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.database import SessionLocal, engine, Base
from core.security import get_password_hash
import models
from models.enums import ApplicationStatus, Gender, PostingStatus, Proficiency, JobType, WorkMode
from models.catalog import Skill, RoleEntity, Industry
from models.company import Company, CompanyReview, Department, HiringManager
from models.candidate import Candidate, CandidateExperience, CandidateSkill, Resume
from models.job import JobPosting, JobApplication, JobRound, JobSkillRequirement

def seed():
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding database...")
        default_pwd = get_password_hash("password123")

        # ----------------------------------------------------
        # 1. CATALOG: INDUSTRIES
        # ----------------------------------------------------
        industries_data = [
            "Software & Technology",
            "Financial Services & FinTech",
            "E-Commerce & Quick Commerce",
            "Artificial Intelligence & ML",
            "Healthcare & HealthTech",
            "Cloud Infrastructure & Security",
            "Media & Entertainment",
            "EdTech & Learning",
            "Cybersecurity",
            "Logistics & Supply Chain",
            "ClimateTech & CleanTech",
            "Gaming & Interactive Media",
            "Travel & Hospitality",
            "Telecommunications",
            "Automotive & Mobility",
            "Biotechnology & Life Sciences",
            "Manufacturing & Industrial IoT",
            "LegalTech",
            "InsurTech",
            "PropTech",
            "HRTech"
        ]
        
        industry_map = {}
        for ind_name in industries_data:
            existing = db.query(Industry).filter(Industry.name == ind_name).first()
            if not existing:
                existing = Industry(name=ind_name)
                db.add(existing)
                db.flush()
            industry_map[ind_name] = existing
        print(f"✓ Seeded {len(industry_map)} Industries")

        # ----------------------------------------------------
        # 2. CATALOG: ROLES
        # ----------------------------------------------------
        roles_data = [
            "Full Stack Software Engineer",
            "Senior Backend Engineer",
            "Frontend Engineer",
            "DevOps & Cloud Engineer",
            "Machine Learning Engineer",
            "Data Scientist",
            "Product Manager",
            "UI/UX Designer",
            "Site Reliability Engineer (SRE)",
            "Mobile Developer (iOS/Android)",
            "Security Engineer",
            "QA Automation Engineer",
            "Data Engineer",
            "Platform Engineer",
            "Cloud Security Engineer",
            "AI Research Engineer",
            "MLOps Engineer",
            "Solutions Architect",
            "Business Intelligence Analyst",
            "Product Designer",
            "Technical Program Manager",
            "Embedded Systems Engineer",
            "Android Developer"
        ]
        
        role_map = {}
        for r_name in roles_data:
            existing = db.query(RoleEntity).filter(RoleEntity.name == r_name).first()
            if not existing:
                existing = RoleEntity(name=r_name)
                db.add(existing)
                db.flush()
            role_map[r_name] = existing
        print(f"✓ Seeded {len(role_map)} Roles")

        # ----------------------------------------------------
        # 3. CATALOG: SKILLS
        # ----------------------------------------------------
        skills_data = [
            "Python", "FastAPI", "Django", "JavaScript", "TypeScript", "React", "Next.js",
            "Vue.js", "Node.js", "Java", "Spring Boot", "Kotlin", "Go", "Rust", "C++",
            "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Docker",
            "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "CI/CD", "GraphQL",
            "REST APIs", "Apache Kafka", "RabbitMQ", "PyTorch", "TensorFlow",
            "Scikit-learn", "LLMs & GenAI", "Figma", "Microservices", "Git", "Agile/Scrum"
        ]
        
        skill_map = {}
        for s_name in skills_data:
            existing = db.query(Skill).filter(Skill.name == s_name).first()
            if not existing:
                existing = Skill(name=s_name)
                db.add(existing)
                db.flush()
            skill_map[s_name] = existing
        print(f"✓ Seeded {len(skill_map)} Skills")

        # ----------------------------------------------------
        # 4. COMPANIES
        # ----------------------------------------------------
        companies_data = [
            {
                "name": "Stripe",
                "email": "contact@stripe.com",
                "companyProfileUrl": "https://stripe.com",
                "country": "United States",
                "state": "California",
                "city": "San Francisco",
                "industry": "Financial Services & FinTech"
            },
            {
                "name": "Google",
                "email": "careers@google.com",
                "companyProfileUrl": "https://careers.google.com",
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "industry": "Software & Technology"
            },
            {
                "name": "Razorpay",
                "email": "jobs@razorpay.com",
                "companyProfileUrl": "https://razorpay.com",
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "industry": "Financial Services & FinTech"
            },
            {
                "name": "Swiggy",
                "email": "careers@swiggy.in",
                "companyProfileUrl": "https://swiggy.com",
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "industry": "E-Commerce & Quick Commerce"
            },
            {
                "name": "Zerodha",
                "email": "careers@zerodha.com",
                "companyProfileUrl": "https://zerodha.com",
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "industry": "Financial Services & FinTech"
            },
            {
                "name": "Microsoft",
                "email": "jobs@microsoft.com",
                "companyProfileUrl": "https://microsoft.com",
                "country": "India",
                "state": "Telangana",
                "city": "Hyderabad",
                "industry": "Software & Technology"
            },
            {
                "name": "Netflix",
                "email": "talent@netflix.com",
                "companyProfileUrl": "https://jobs.netflix.com",
                "country": "United States",
                "state": "California",
                "city": "Los Gatos",
                "industry": "Media & Entertainment"
            },
            {
                "name": "Airbnb",
                "email": "careers@airbnb.com",
                "companyProfileUrl": "https://airbnb.com/careers",
                "country": "United States",
                "state": "California",
                "city": "San Francisco",
                "industry": "Software & Technology"
            }
        ]

        # Additional synthetic companies for broader test coverage.
        extra_companies = [
            ("NovaCart", "E-Commerce & Quick Commerce", "India", "Maharashtra", "Mumbai"),
            ("CloudNest", "Cloud Infrastructure & Security", "India", "Tamil Nadu", "Chennai"),
            ("MedAxis", "Healthcare & HealthTech", "India", "Telangana", "Hyderabad"),
            ("EduOrbit", "EdTech & Learning", "India", "Delhi", "New Delhi"),
            ("ShieldForge", "Cybersecurity", "United States", "Texas", "Austin"),
            ("GreenGrid", "ClimateTech & CleanTech", "Germany", "Berlin", "Berlin"),
            ("GameVerse", "Gaming & Interactive Media", "Canada", "Ontario", "Toronto"),
            ("TripLoom", "Travel & Hospitality", "Singapore", "Central Region", "Singapore"),
            ("AutoPulse", "Automotive & Mobility", "Germany", "Bavaria", "Munich"),
            ("BioNova", "Biotechnology & Life Sciences", "United Kingdom", "England", "Cambridge"),
            ("FactoryIQ", "Manufacturing & Industrial IoT", "Japan", "Tokyo", "Tokyo"),
            ("InsureStack", "InsurTech", "India", "Maharashtra", "Pune"),
            ("HomeSphere", "PropTech", "United Arab Emirates", "Dubai", "Dubai"),
            ("TalentLoop", "HRTech", "India", "Haryana", "Gurugram"),
            ("TelcoWave", "Telecommunications", "India", "Maharashtra", "Pune"),
            ("LegalPilot", "LegalTech", "United States", "New York", "New York"),
            ("DataHarbor", "Software & Technology", "India", "Karnataka", "Bengaluru"),
            ("QuantumLeaf", "Artificial Intelligence & ML", "United States", "California", "San Jose"),
            ("StreamForge", "Media & Entertainment", "United States", "Washington", "Seattle"),
            ("PayFlux", "Financial Services & FinTech", "India", "Telangana", "Hyderabad"),
            ("SecureOrbit", "Cloud Infrastructure & Security", "Ireland", "Leinster", "Dublin"),
            ("RetailPulse", "E-Commerce & Quick Commerce", "India", "West Bengal", "Kolkata"),
        ]
        for idx, (name, industry, country, state, city) in enumerate(extra_companies, start=1):
            companies_data.append({
                "name": name,
                "email": f"careers@{name.lower()}.example.com",
                "companyProfileUrl": f"https://{name.lower()}.example.com",
                "country": country,
                "state": state,
                "city": city,
                "industry": industry,
            })

        company_map = {}
        for c_info in companies_data:
            existing = db.query(Company).filter(Company.email == c_info["email"]).first()
            if not existing:
                existing = Company(
                    name=c_info["name"],
                    email=c_info["email"],
                    password=default_pwd,
                    companyProfileUrl=c_info["companyProfileUrl"],
                    country=c_info["country"],
                    state=c_info["state"],
                    city=c_info["city"],
                    industry_id=industry_map[c_info["industry"]].id
                )
                db.add(existing)
                db.flush()
            company_map[c_info["name"]] = existing
        print(f"✓ Seeded {len(company_map)} Companies")

        # ----------------------------------------------------
        # 5. DEPARTMENTS & HIRING MANAGERS
        # ----------------------------------------------------
        hms_to_create = [
            {
                "company": "Stripe",
                "dept": "Payments Infrastructure",
                "firstName": "Sarah",
                "lastName": "Jenkins",
                "email": "sarah.jenkins@stripe.com",
                "gender": Gender.FEMALE
            },
            {
                "company": "Google",
                "dept": "Cloud AI & Services",
                "firstName": "Alex",
                "lastName": "Rivera",
                "email": "alex.rivera@google.com",
                "gender": Gender.MALE
            },
            {
                "company": "Razorpay",
                "dept": "Core Platform Engineering",
                "firstName": "Rahul",
                "lastName": "Sharma",
                "email": "rahul.sharma@razorpay.com",
                "gender": Gender.MALE
            },
            {
                "company": "Swiggy",
                "dept": "Logistics & Realtime Dispatch",
                "firstName": "Priya",
                "lastName": "Nair",
                "email": "priya.nair@swiggy.in",
                "gender": Gender.FEMALE
            },
            {
                "company": "Zerodha",
                "dept": "Trading Tech & Systems",
                "firstName": "Karthik",
                "lastName": "Venkatesh",
                "email": "karthik.v@zerodha.com",
                "gender": Gender.MALE
            },
            {
                "company": "Microsoft",
                "dept": "Azure Developer Division",
                "firstName": "Emily",
                "lastName": "Chen",
                "email": "emily.chen@microsoft.com",
                "gender": Gender.FEMALE
            },
            {
                "company": "Netflix",
                "dept": "Streaming & Playback",
                "firstName": "Marcus",
                "lastName": "Johnson",
                "email": "marcus.j@netflix.com",
                "gender": Gender.MALE
            },
            {
                "company": "Airbnb",
                "dept": "Host & Guest Experience",
                "firstName": "Elena",
                "lastName": "Rostova",
                "email": "elena.r@airbnb.com",
                "gender": Gender.FEMALE
            }
        ]

        hm_map = {}
        for hm_info in hms_to_create:
            comp = company_map[hm_info["company"]]
            # Department
            dept = db.query(Department).filter(
                Department.name == hm_info["dept"],
                Department.company_id == comp.id
            ).first()
            if not dept:
                dept = Department(name=hm_info["dept"], company_id=comp.id)
                db.add(dept)
                db.flush()
            
            # Hiring Manager
            existing_hm = db.query(HiringManager).filter(HiringManager.email == hm_info["email"]).first()
            if not existing_hm:
                existing_hm = HiringManager(
                    firstName=hm_info["firstName"],
                    lastName=hm_info["lastName"],
                    email=hm_info["email"],
                    gender=hm_info["gender"],
                    password=default_pwd,
                    department_id=dept.id
                )
                db.add(existing_hm)
                db.flush()
            hm_map[hm_info["company"]] = existing_hm
        # One hiring manager per additional company.
        first_names = ["Maya", "Daniel", "Aisha", "Rohan", "Meera", "Liam", "Nina", "Arjun",
                       "Sofia", "Vikram", "Chloe", "Ethan", "Ishita", "Noah", "Kavya"]
        last_names = ["Kapoor", "Williams", "Patel", "Kim", "Fernandez", "Mehta", "Brown",
                      "Singh", "Garcia", "Wilson", "Shah", "Martin", "Thomas", "Lee", "Das"]
        dept_names = [
            "Engineering", "Platform Engineering", "Data & AI", "Product Engineering",
            "Infrastructure", "Security Engineering", "Customer Technology", "Applied ML"
        ]
        existing_hm_companies = set(hm_map.keys())
        for idx, c_info in enumerate(extra_companies):
            if c_info[0] in existing_hm_companies:
                continue
            company_name = c_info[0]
            comp = company_map[company_name]
            dept_name = dept_names[idx % len(dept_names)]
            dept = db.query(Department).filter(
                Department.name == dept_name,
                Department.company_id == comp.id
            ).first()
            if not dept:
                dept = Department(name=dept_name, company_id=comp.id)
                db.add(dept)
                db.flush()

            first = first_names[idx % len(first_names)]
            last = last_names[idx % len(last_names)]
            email = f"{first.lower()}.{last.lower()}@{company_name.lower()}.example.com"
            existing_hm = db.query(HiringManager).filter(HiringManager.email == email).first()
            if not existing_hm:
                existing_hm = HiringManager(
                    firstName=first,
                    lastName=last,
                    email=email,
                    gender=[Gender.FEMALE, Gender.MALE][idx % 2],
                    password=default_pwd,
                    department_id=dept.id
                )
                db.add(existing_hm)
                db.flush()
            hm_map[company_name] = existing_hm

        print(f"✓ Seeded {len(hm_map)} Hiring Managers & Departments")

        # ----------------------------------------------------
        # 6. JOB POSTINGS & SKILL REQUIREMENTS
        # ----------------------------------------------------
        job_postings_data = [
            {
                "title": "Senior Backend Engineer - Financial Infrastructure",
                "company": "Stripe",
                "role": "Senior Backend Engineer",
                "description": "At Stripe, we are building the economic infrastructure for the internet. As a Senior Backend Engineer on Financial Infrastructure, you will architect fault-tolerant distributed ledger systems handling billions of dollars in daily transactions with zero downtime. You will work with distributed consensus, high-throughput microservices, and ensure sub-second global transaction processing.",
                "salaryLower": 3500000,
                "salaryHigher": 6000000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.REMOTE,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "minimumExperienceInMonths": 48,
                "workingHoursPerDay": 8,
                "skills": [
                    ("Go", Proficiency.ADVANCED, True),
                    ("PostgreSQL", Proficiency.EXPERT, True),
                    ("Microservices", Proficiency.ADVANCED, True),
                    ("Apache Kafka", Proficiency.INTERMEDIATE, False),
                    ("Docker", Proficiency.INTERMEDIATE, False),
                    ("REST APIs", Proficiency.ADVANCED, True)
                ]
            },
            {
                "title": "Full Stack Software Engineer - Cloud AI Console",
                "company": "Google",
                "role": "Full Stack Software Engineer",
                "description": "Join Google Cloud AI team to build developer platforms and interfaces for foundational models and Vertex AI. You will design elegant frontend interfaces in React/TypeScript and integrate high-performance backend microservices in Python and Go.",
                "salaryLower": 3000000,
                "salaryHigher": 5500000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.HYBRID,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "minimumExperienceInMonths": 36,
                "workingHoursPerDay": 8,
                "skills": [
                    ("TypeScript", Proficiency.ADVANCED, True),
                    ("React", Proficiency.ADVANCED, True),
                    ("Python", Proficiency.ADVANCED, True),
                    ("FastAPI", Proficiency.INTERMEDIATE, False),
                    ("GCP", Proficiency.INTERMEDIATE, False),
                    ("GraphQL", Proficiency.INTERMEDIATE, False)
                ]
            },
            {
                "title": "Staff Payments Engineer - Checkout Platform",
                "company": "Razorpay",
                "role": "Senior Backend Engineer",
                "description": "Razorpay powers payments for thousands of Indian and international businesses. You will build and scale our high-conversion checkout engine, supporting millions of transactions per minute with low latency and high availability.",
                "salaryLower": 2800000,
                "salaryHigher": 4800000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.HYBRID,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "minimumExperienceInMonths": 36,
                "workingHoursPerDay": 8,
                "skills": [
                    ("Java", Proficiency.ADVANCED, True),
                    ("Spring Boot", Proficiency.ADVANCED, True),
                    ("Redis", Proficiency.ADVANCED, True),
                    ("PostgreSQL", Proficiency.ADVANCED, True),
                    ("Docker", Proficiency.INTERMEDIATE, False)
                ]
            },
            {
                "title": "Machine Learning Engineer - Real-Time Dispatch & ETA",
                "company": "Swiggy",
                "role": "Machine Learning Engineer",
                "description": "Swiggy's logistics brain predicts travel times, delivery partner allocation, and order surges in real-time across hundreds of cities. You will train and deploy machine learning models processing millions of sensor pings and order events per second.",
                "salaryLower": 2600000,
                "salaryHigher": 4500000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.ONSITE,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "minimumExperienceInMonths": 24,
                "workingHoursPerDay": 8,
                "skills": [
                    ("Python", Proficiency.EXPERT, True),
                    ("PyTorch", Proficiency.ADVANCED, True),
                    ("Scikit-learn", Proficiency.ADVANCED, True),
                    ("Apache Kafka", Proficiency.INTERMEDIATE, False),
                    ("Docker", Proficiency.INTERMEDIATE, False)
                ]
            },
            {
                "title": "Systems Engineer - Ultra-Low Latency Order Routing",
                "company": "Zerodha",
                "role": "Site Reliability Engineer (SRE)",
                "description": "Zerodha is India's largest retail stockbroker. We value simplicity, clean systems, and high performance. You will maintain Kite's infrastructure, optimize network kernels, manage PostgreSQL clusters, and ensure high throughput during market peak hours.",
                "salaryLower": 2500000,
                "salaryHigher": 4200000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.REMOTE,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "minimumExperienceInMonths": 36,
                "workingHoursPerDay": 8,
                "skills": [
                    ("Go", Proficiency.ADVANCED, True),
                    ("PostgreSQL", Proficiency.EXPERT, True),
                    ("Redis", Proficiency.ADVANCED, True),
                    ("Kubernetes", Proficiency.INTERMEDIATE, True),
                    ("Docker", Proficiency.INTERMEDIATE, True)
                ]
            },
            {
                "title": "Frontend Engineer - Developer Experience & Tooling",
                "company": "Microsoft",
                "role": "Frontend Engineer",
                "description": "Help craft next-generation cloud dev tools and portals for Azure. You will create fast, accessible, and responsive user experiences using React, TypeScript, and modern component systems.",
                "salaryLower": 2400000,
                "salaryHigher": 4200000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.HYBRID,
                "country": "India",
                "state": "Telangana",
                "city": "Hyderabad",
                "minimumExperienceInMonths": 24,
                "workingHoursPerDay": 8,
                "skills": [
                    ("React", Proficiency.EXPERT, True),
                    ("TypeScript", Proficiency.ADVANCED, True),
                    ("JavaScript", Proficiency.EXPERT, True),
                    ("Next.js", Proficiency.INTERMEDIATE, False),
                    ("REST APIs", Proficiency.INTERMEDIATE, True)
                ]
            },
            {
                "title": "Senior Cloud & DevOps Engineer",
                "company": "Netflix",
                "role": "DevOps & Cloud Engineer",
                "description": "Netflix accounts for a significant portion of worldwide internet bandwidth. As a Cloud & DevOps engineer, you will maintain container fleets, automate continuous delivery pipelines, and ensure seamless video streaming for over 260 million subscribers worldwide.",
                "salaryLower": 4000000,
                "salaryHigher": 7000000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.REMOTE,
                "country": "United States",
                "state": "California",
                "city": "Los Gatos",
                "minimumExperienceInMonths": 48,
                "workingHoursPerDay": 8,
                "skills": [
                    ("AWS", Proficiency.EXPERT, True),
                    ("Kubernetes", Proficiency.ADVANCED, True),
                    ("Terraform", Proficiency.ADVANCED, True),
                    ("Docker", Proficiency.EXPERT, True),
                    ("CI/CD", Proficiency.ADVANCED, True),
                    ("Python", Proficiency.INTERMEDIATE, False)
                ]
            },
            {
                "title": "Product Designer (UI/UX) - Guest Experience",
                "company": "Airbnb",
                "role": "UI/UX Designer",
                "description": "Shape the future of global travel by designing seamless, intuitive, and delightful interfaces for millions of guests and hosts worldwide. Work closely with product and engineering teams from discovery to shipping.",
                "salaryLower": 2200000,
                "salaryHigher": 3800000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.REMOTE,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "minimumExperienceInMonths": 24,
                "workingHoursPerDay": 8,
                "skills": [
                    ("Figma", Proficiency.EXPERT, True),
                    ("Agile/Scrum", Proficiency.INTERMEDIATE, False),
                    ("JavaScript", Proficiency.BEGINNER, False)
                ]
            },
            {
                "title": "Software Engineering Intern - Summer 2026",
                "company": "Google",
                "role": "Full Stack Software Engineer",
                "description": "Join Google as a Software Engineering Intern! You will work directly with full-time software engineers on core products, shipping production code, solving algorithmic challenges, and scaling web services.",
                "salaryLower": 800000,
                "salaryHigher": 1200000,
                "status": PostingStatus.OPEN,
                "type": JobType.INTERN,
                "workMode": WorkMode.HYBRID,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "minimumExperienceInMonths": 0,
                "workingHoursPerDay": 8,
                "skills": [
                    ("Python", Proficiency.INTERMEDIATE, True),
                    ("JavaScript", Proficiency.INTERMEDIATE, True),
                    ("Git", Proficiency.INTERMEDIATE, True),
                    ("REST APIs", Proficiency.BEGINNER, False)
                ]
            },
            {
                "title": "Lead Data Scientist - Search & Personalization",
                "company": "Swiggy",
                "role": "Data Scientist",
                "description": "Lead the team responsible for restaurant ranking, dynamic search suggestions, and personalized dish recommendations for tens of millions of monthly food and grocery lovers.",
                "salaryLower": 3200000,
                "salaryHigher": 5200000,
                "status": PostingStatus.OPEN,
                "type": JobType.FULL_TIME,
                "workMode": WorkMode.HYBRID,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "minimumExperienceInMonths": 48,
                "workingHoursPerDay": 8,
                "skills": [
                    ("Python", Proficiency.EXPERT, True),
                    ("LLMs & GenAI", Proficiency.ADVANCED, True),
                    ("PyTorch", Proficiency.ADVANCED, True),
                    ("PostgreSQL", Proficiency.INTERMEDIATE, False)
                ]
            }
        ]

        # Generate additional job postings with varied roles, locations, seniority,
        # compensation, work modes, and skill combinations.
        rng = random.Random(20260820)
        job_templates = [
            ("Backend Platform Engineer", "Platform Engineer"),
            ("Data Platform Engineer", "Data Engineer"),
            ("AI/ML Engineer", "Machine Learning Engineer"),
            ("Cloud Security Engineer", "Cloud Security Engineer"),
            ("MLOps Engineer", "MLOps Engineer"),
            ("Solutions Architect", "Solutions Architect"),
            ("QA Automation Engineer", "QA Automation Engineer"),
            ("Product Designer", "Product Designer"),
            ("Technical Program Manager", "Technical Program Manager"),
            ("Mobile Engineer", "Mobile Developer (iOS/Android)"),
            ("Business Intelligence Analyst", "Business Intelligence Analyst"),
            ("AI Research Engineer", "AI Research Engineer"),
        ]
        locations = [
            ("India", "Karnataka", "Bengaluru"),
            ("India", "Telangana", "Hyderabad"),
            ("India", "Maharashtra", "Mumbai"),
            ("India", "Tamil Nadu", "Chennai"),
            ("India", "Haryana", "Gurugram"),
            ("India", "West Bengal", "Kolkata"),
            ("United States", "California", "San Francisco"),
            ("United States", "Washington", "Seattle"),
            ("United Kingdom", "England", "London"),
            ("Germany", "Berlin", "Berlin"),
            ("Singapore", "Central Region", "Singapore"),
            ("Canada", "Ontario", "Toronto"),
        ]
        skill_groups = [
            ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "REST APIs"],
            ["TypeScript", "React", "Next.js", "GraphQL", "Git", "REST APIs"],
            ["Python", "PyTorch", "LLMs & GenAI", "Scikit-learn", "MLflow", "RAG"],
            ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD", "Prometheus"],
            ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Redis", "Microservices"],
            ["Go", "Kubernetes", "gRPC", "Linux", "Distributed Systems", "Docker"],
            ["SQL", "Python", "Pandas", "Apache Spark", "Airflow", "Tableau"],
            ["Figma", "Agile/Scrum", "Product Analytics", "HTML/CSS", "JavaScript"],
            ["Selenium", "Playwright", "Pytest", "Java", "Git", "CI/CD"],
            ["Swift", "Kotlin", "REST APIs", "Git", "PostgreSQL", "Docker"],
        ]
        existing_job_titles = {j["title"] for j in job_postings_data}
        extra_company_names = [x[0] for x in extra_companies]
        for i in range(1, 37):
            base_title, role_name = job_templates[(i - 1) % len(job_templates)]
            company_name = extra_company_names[(i - 1) % len(extra_company_names)]
            city_loc = locations[(i - 1) % len(locations)]
            title = f"{base_title} - {company_name} #{i}"
            if title in existing_job_titles:
                continue
            lower = 700000 + (i % 6) * 250000
            upper = lower + 900000 + (i % 5) * 350000
            exp = [0, 6, 12, 18, 24, 36, 48, 60][i % 8]
            mode = [WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ONSITE][i % 3]
            job_postings_data.append({
                "title": title,
                "company": company_name,
                "role": role_name,
                "description": (
                    f"{company_name} is hiring a {base_title} to build reliable products, "
                    f"improve engineering velocity, and collaborate across product and platform teams. "
                    f"The role includes production ownership, observability, testing, and measurable delivery."
                ),
                "salaryLower": lower,
                "salaryHigher": upper,
                "status": [PostingStatus.OPEN, PostingStatus.OPEN, PostingStatus.OPEN][i % 3],
                "type": JobType.INTERN if i % 13 == 0 else JobType.FULL_TIME,
                "workMode": mode,
                "country": city_loc[0],
                "state": city_loc[1],
                "city": city_loc[2],
                "minimumExperienceInMonths": exp,
                "workingHoursPerDay": 8 if i % 5 else 7,
                "skills": [
                    (skill, [Proficiency.BEGINNER, Proficiency.INTERMEDIATE,
                             Proficiency.ADVANCED, Proficiency.EXPERT][(i + j) % 4],
                     j < 3)
                    for j, skill in enumerate(skill_groups[(i - 1) % len(skill_groups)])
                    if skill in skill_map
                ]
            })

        job_posting_map = {}
        for jp_info in job_postings_data:
            comp = company_map[jp_info["company"]]
            hm = hm_map[jp_info["company"]]
            role_ent = role_map[jp_info["role"]]

            existing_jp = db.query(JobPosting).filter(
                JobPosting.title == jp_info["title"],
                JobPosting.company_id == comp.id
            ).first()

            if not existing_jp:
                existing_jp = JobPosting(
                    title=jp_info["title"],
                    description=jp_info["description"],
                    salaryLower=jp_info["salaryLower"],
                    salaryHigher=jp_info["salaryHigher"],
                    status=jp_info["status"],
                    type=jp_info["type"],
                    workingHoursPerDay=jp_info["workingHoursPerDay"],
                    role_id=role_ent.id,
                    country=jp_info["country"],
                    state=jp_info["state"],
                    city=jp_info["city"],
                    company_id=comp.id,
                    workMode=jp_info["workMode"],
                    minimumExperienceInMonths=jp_info["minimumExperienceInMonths"],
                    postedAt=datetime.now(timezone.utc) - timedelta(days=2),
                    expiresAt=datetime.now(timezone.utc) + timedelta(days=30),
                    hiring_manager_id=hm.id
                )
                db.add(existing_jp)
                db.flush()

                # Add skill requirements
                for s_name, prof, req in jp_info["skills"]:
                    sk = skill_map.get(s_name)
                    if sk:
                        jsr = JobSkillRequirement(
                            job_posting_id=existing_jp.id,
                            skill_id=sk.id,
                            proficiency=prof,
                            required=req
                        )
                        db.add(jsr)
                db.flush()
            job_posting_map[jp_info["title"]] = existing_jp
        print(f"✓ Seeded {len(job_posting_map)} Job Postings with Skill Requirements")

        # ----------------------------------------------------
        # 7. CANDIDATES (Update Sai Teja & Add more)
        # ----------------------------------------------------
        candidates_data = [
            {
                "email": "saitejabrawl@gmail.com",
                "firstName": "Sai Teja",
                "lastName": "Bejavada",
                "gender": Gender.MALE,
                "country": "India",
                "state": "Andhra Pradesh",
                "city": "Vijayawada",
                "description": "Full Stack Engineer passionate about high performance backends, microservices architectures, and beautiful modern web applications.",
                "skills": [
                    ("Python", Proficiency.EXPERT),
                    ("FastAPI", Proficiency.ADVANCED),
                    ("React", Proficiency.ADVANCED),
                    ("TypeScript", Proficiency.ADVANCED),
                    ("PostgreSQL", Proficiency.ADVANCED),
                    ("Docker", Proficiency.INTERMEDIATE),
                    ("Redis", Proficiency.INTERMEDIATE)
                ],
                "experiences": [
                    {
                        "role": "Full Stack Software Engineer",
                        "org": "TechNova Solutions",
                        "desc": "Built scalable cloud microservices, optimized SQL queries and implemented real-time analytics dashboards.",
                        "fromDate": datetime(2023, 6, 1),
                        "toDate": None
                    },
                    {
                        "role": "Frontend Engineer",
                        "org": "InnoSoft Labs",
                        "desc": "Developed component library in React, improved Lighthouse score by 40% and built accessible user interfaces.",
                        "fromDate": datetime(2022, 1, 15),
                        "toDate": datetime(2023, 5, 30)
                    }
                ]
            },
            {
                "email": "aarav.sharma@example.com",
                "firstName": "Aarav",
                "lastName": "Sharma",
                "gender": Gender.MALE,
                "country": "India",
                "state": "Karnataka",
                "city": "Bengaluru",
                "description": "Senior Backend Architect with 6+ years of experience in high-throughput distributed payment and financial systems.",
                "skills": [
                    ("Go", Proficiency.EXPERT),
                    ("PostgreSQL", Proficiency.EXPERT),
                    ("Apache Kafka", Proficiency.ADVANCED),
                    ("Microservices", Proficiency.EXPERT),
                    ("Docker", Proficiency.ADVANCED),
                    ("Kubernetes", Proficiency.ADVANCED)
                ],
                "experiences": [
                    {
                        "role": "Senior Backend Engineer",
                        "org": "FinStack Global",
                        "desc": "Led core ledger team processing $50M daily volume with 99.999% uptime.",
                        "fromDate": datetime(2021, 3, 1),
                        "toDate": None
                    }
                ]
            },
            {
                "email": "ananya.iyer@example.com",
                "firstName": "Ananya",
                "lastName": "Iyer",
                "gender": Gender.FEMALE,
                "country": "India",
                "state": "Telangana",
                "city": "Hyderabad",
                "description": "Machine Learning Engineer specialized in Natural Language Processing, Large Language Models, and recommender systems.",
                "skills": [
                    ("Python", Proficiency.EXPERT),
                    ("PyTorch", Proficiency.ADVANCED),
                    ("LLMs & GenAI", Proficiency.ADVANCED),
                    ("Scikit-learn", Proficiency.ADVANCED),
                    ("FastAPI", Proficiency.INTERMEDIATE)
                ],
                "experiences": [
                    {
                        "role": "Machine Learning Engineer",
                        "org": "CognitiveAI Labs",
                        "desc": "Fine-tuned open-source LLMs and built retrieval-augmented generation (RAG) pipelines.",
                        "fromDate": datetime(2022, 8, 1),
                        "toDate": None
                    }
                ]
            }
        ]

        # Generate a diverse candidate pool for matching/search/filter testing.
        candidate_first = [
            "Aarav", "Ishaan", "Vivaan", "Aditya", "Kabir", "Arjun", "Riya", "Diya",
            "Meera", "Anika", "Sara", "Nisha", "Maya", "Daniel", "Lucas", "Emma",
            "Olivia", "Noah", "Ethan", "Sophia", "Zoe", "Mia", "Leo", "Amelia",
            "Yuki", "Kenji", "Hana", "Mateo", "Ava", "Elijah"
        ]
        candidate_last = [
            "Patel", "Shah", "Reddy", "Nair", "Gupta", "Kapoor", "Iyer", "Rao",
            "Mehta", "Joshi", "Brown", "Wilson", "Garcia", "Martin", "Kim",
            "Tanaka", "Singh", "Das", "Thomas", "Khan", "Verma", "Bose"
        ]
        candidate_locations = [
            ("India", "Karnataka", "Bengaluru"),
            ("India", "Telangana", "Hyderabad"),
            ("India", "Maharashtra", "Pune"),
            ("India", "Delhi", "New Delhi"),
            ("India", "Tamil Nadu", "Chennai"),
            ("India", "Kerala", "Kochi"),
            ("India", "Haryana", "Gurugram"),
            ("United States", "California", "San Jose"),
            ("United States", "Texas", "Austin"),
            ("United Kingdom", "England", "London"),
            ("Germany", "Berlin", "Berlin"),
            ("Singapore", "Central Region", "Singapore"),
            ("Canada", "Ontario", "Toronto"),
            ("Japan", "Tokyo", "Tokyo"),
        ]
        candidate_skill_sets = [
            ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "React"],
            ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Microservices", "Docker"],
            ["Python", "PyTorch", "LLMs & GenAI", "Scikit-learn", "RAG", "FastAPI"],
            ["TypeScript", "React", "Next.js", "GraphQL", "Git", "REST APIs"],
            ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD", "Linux"],
            ["Go", "Kubernetes", "gRPC", "PostgreSQL", "Redis", "Distributed Systems"],
            ["SQL", "Python", "Pandas", "Apache Spark", "Airflow", "Tableau"],
            ["Figma", "JavaScript", "HTML/CSS", "Agile/Scrum", "React"],
            ["Swift", "Kotlin", "REST APIs", "Git", "Docker"],
            ["Selenium", "Playwright", "Pytest", "Java", "Git", "CI/CD"],
        ]
        candidate_roles = [
            "Full Stack Software Engineer", "Senior Backend Engineer", "Frontend Engineer",
            "DevOps & Cloud Engineer", "Machine Learning Engineer", "Data Scientist",
            "Site Reliability Engineer (SRE)", "Mobile Developer (iOS/Android)",
            "Security Engineer", "QA Automation Engineer"
        ]
        existing_candidate_emails = {c["email"] for c in candidates_data}
        for i in range(1, 41):
            first = candidate_first[(i - 1) % len(candidate_first)]
            last = candidate_last[(i * 3 - 1) % len(candidate_last)]
            email = f"{first.lower()}.{last.lower()}.{i}@example.com"
            if email in existing_candidate_emails:
                continue
            loc = candidate_locations[(i - 1) % len(candidate_locations)]
            skills = candidate_skill_sets[(i - 1) % len(candidate_skill_sets)]
            years = i % 8
            candidates_data.append({
                "email": email,
                "firstName": first,
                "lastName": last,
                "gender": [Gender.MALE, Gender.FEMALE][i % 2],
                "country": loc[0],
                "state": loc[1],
                "city": loc[2],
                "description": (
                    f"{years}+ years of experience in {candidate_roles[(i - 1) % len(candidate_roles)]}. "
                    f"Experienced in production systems, collaborative development, testing, and cloud-native delivery."
                ),
                "skills": [
                    (skill, [Proficiency.INTERMEDIATE, Proficiency.ADVANCED,
                             Proficiency.EXPERT][(i + j) % 3])
                    for j, skill in enumerate(skills) if skill in skill_map
                ],
                "experiences": [
                    {
                        "role": candidate_roles[(i - 1) % len(candidate_roles)],
                        "org": ["Northstar Labs", "Vertex Systems", "BlueOrbit Tech",
                                "Apex Digital", "OrionWorks"][i % 5],
                        "desc": (
                            "Delivered production features, improved reliability, "
                            "and collaborated with engineering and product stakeholders."
                        ),
                        "fromDate": datetime(2020 + (i % 5), 1 + (i % 10), 1),
                        "toDate": None
                    }
                ]
            })

        candidate_map = {}
        for c_data in candidates_data:
            cand = db.query(Candidate).filter(Candidate.email == c_data["email"]).first()
            if not cand:
                cand = Candidate(
                    email=c_data["email"],
                    firstName=c_data["firstName"],
                    lastName=c_data["lastName"],
                    gender=c_data["gender"],
                    password=default_pwd,
                    country=c_data["country"],
                    state=c_data["state"],
                    city=c_data["city"],
                    description=c_data["description"]
                )
                db.add(cand)
                db.flush()
            else:
                cand.firstName = c_data["firstName"]
                cand.lastName = c_data["lastName"]
                cand.country = c_data["country"]
                cand.state = c_data["state"]
                cand.city = c_data["city"]
                cand.description = c_data["description"]
                db.flush()

            # Seed candidate skills if empty
            if not cand.candidateSkills:
                for s_name, prof in c_data["skills"]:
                    sk = skill_map.get(s_name)
                    if sk:
                        cs = CandidateSkill(
                            candidate_id=cand.id,
                            skill_id=sk.id,
                            proficiency=prof
                        )
                        db.add(cs)
                db.flush()

            # Seed candidate experiences if empty
            if not cand.candidateExperiences:
                for exp_data in c_data["experiences"]:
                    r_ent = role_map.get(exp_data["role"])
                    ce = CandidateExperience(
                        candidate_id=cand.id,
                        role_id=r_ent.id if r_ent else None,
                        organizationName=exp_data["org"],
                        description=exp_data["desc"],
                        fromDate=exp_data["fromDate"],
                        toDate=exp_data["toDate"]
                    )
                    db.add(ce)
                db.flush()

            candidate_map[c_data["email"]] = cand
        print(f"✓ Seeded {len(candidate_map)} Candidates with Skills & Experiences")

        # ----------------------------------------------------
        # 8. JOB APPLICATIONS
        # ----------------------------------------------------
        applications_data = [
            {
                "candidate_email": "saitejabrawl@gmail.com",
                "job_title": "Full Stack Software Engineer - Cloud AI Console",
                "status": ApplicationStatus.INTERVIEW,
                "coverLetter": "Hello hiring team, I am deeply excited about building responsive, robust frontend and microservice architectures for Google Cloud AI. I have extensive experience in React, TypeScript, and FastAPI."
            },
            {
                "candidate_email": "saitejabrawl@gmail.com",
                "job_title": "Frontend Engineer - Developer Experience & Tooling",
                "status": ApplicationStatus.SCREENING,
                "coverLetter": "Hi Microsoft team! My passion is building delightful developer tooling and component libraries with top-tier accessibility and performance."
            },
            {
                "candidate_email": "aarav.sharma@example.com",
                "job_title": "Senior Backend Engineer - Financial Infrastructure",
                "status": ApplicationStatus.OFFER,
                "coverLetter": "With over 6 years of expertise building ledger systems and high-throughput Go microservices, I would love to contribute to Stripe's financial infrastructure."
            },
            {
                "candidate_email": "aarav.sharma@example.com",
                "job_title": "Staff Payments Engineer - Checkout Platform",
                "status": ApplicationStatus.INTERVIEW,
                "coverLetter": "I have extensive background in Indian payment gateways, low latency routing, and Redis caching topologies."
            },
            {
                "candidate_email": "ananya.iyer@example.com",
                "job_title": "Machine Learning Engineer - Real-Time Dispatch & ETA",
                "status": ApplicationStatus.APPLIED,
                "coverLetter": "I specialize in time-series forecasting, reinforcement learning, and deploying PyTorch inference endpoints at scale."
            },
            {
                "candidate_email": "ananya.iyer@example.com",
                "job_title": "Lead Data Scientist - Search & Personalization",
                "status": ApplicationStatus.SCREENING,
                "coverLetter": "Excited about optimizing food search relevance and personalization algorithms."
            }
        ]

        # Create additional applications to exercise application lifecycle queries.
        application_statuses = [
            ApplicationStatus.APPLIED,
            ApplicationStatus.SCREENING,
            ApplicationStatus.INTERVIEW,
            ApplicationStatus.OFFER,
        ]
        all_candidate_emails = [c["email"] for c in candidates_data]
        all_job_titles = list(job_posting_map.keys())
        extra_app_count = 0
        for i, email in enumerate(all_candidate_emails):
            if email == "saitejabrawl@gmail.com":
                continue
            for offset in range(2):
                job_title = all_job_titles[(i * 3 + offset) % len(all_job_titles)]
                applications_data.append({
                    "candidate_email": email,
                    "job_title": job_title,
                    "status": application_statuses[(i + offset) % len(application_statuses)],
                    "coverLetter": (
                        f"I am interested in the {job_title} opportunity and believe my "
                        f"experience aligns well with the role's technical and product requirements."
                    )
                })

        app_count = 0
        for app_info in applications_data:
            cand = candidate_map.get(app_info["candidate_email"])
            jp = job_posting_map.get(app_info["job_title"])
            if cand and jp:
                existing_app = db.query(JobApplication).filter(
                    JobApplication.candidate_id == cand.id,
                    JobApplication.job_posting_id == jp.id
                ).first()
                if not existing_app:
                    app = JobApplication(
                        candidate_id=cand.id,
                        job_posting_id=jp.id,
                        status=app_info["status"],
                        coverLetter=app_info["coverLetter"],
                        appliedAt=datetime.now(timezone.utc) - timedelta(days=1)
                    )
                    db.add(app)
                    app_count += 1
        db.flush()
        print(f"✓ Seeded {app_count} Job Applications")

        # ----------------------------------------------------
        # 9. COMPANY REVIEWS
        # ----------------------------------------------------
        reviews_data = [
            {
                "company": "Google",
                "candidate_email": "saitejabrawl@gmail.com",
                "stars": 5,
                "text": "World-class engineering culture, thoughtful interviewers, and incredible technical challenges. Transparent feedback provided at each round."
            },
            {
                "company": "Stripe",
                "candidate_email": "aarav.sharma@example.com",
                "stars": 5,
                "text": "Best-in-class developer-first ethos, extremely high engineering bar, and respectful, collaborative interview loops."
            },
            {
                "company": "Razorpay",
                "candidate_email": "saitejabrawl@gmail.com",
                "stars": 4,
                "text": "Fast-paced environment with massive scale. You get real ownership of critical payment microservices from day one."
            },
            {
                "company": "Swiggy",
                "candidate_email": "ananya.iyer@example.com",
                "stars": 5,
                "text": "Great ML and data science problem spaces. Highly knowledgeable team working on real-time routing and recommendation engines."
            },
            {
                "company": "Zerodha",
                "candidate_email": "aarav.sharma@example.com",
                "stars": 5,
                "text": "Exceptional respect for technology simplicity and minimal bloat. True engineering pride in keeping systems lean and fast."
            }
        ]

        # Add varied ratings/reviews for analytics and company-profile testing.
        review_templates = [
            "Strong engineering ownership and challenging production problems.",
            "Supportive teammates with a good balance of autonomy and mentorship.",
            "Fast-paced environment with meaningful customer-facing work.",
            "Good technical depth, though priorities can change quickly.",
            "Excellent learning opportunities and exposure to large-scale systems.",
            "Collaborative culture with strong emphasis on reliability and quality.",
        ]
        review_candidates = [c["email"] for c in candidates_data if c["email"] in candidate_map]
        review_companies = [c[0] for c in extra_companies]
        for i, email in enumerate(review_candidates[:30]):
            company_name = review_companies[i % len(review_companies)]
            reviews_data.append({
                "company": company_name,
                "candidate_email": email,
                "stars": 1 + ((i * 7) % 5),
                "text": review_templates[i % len(review_templates)]
            })

        review_count = 0
        for rev_info in reviews_data:
            comp = company_map.get(rev_info["company"])
            cand = candidate_map.get(rev_info["candidate_email"])
            if comp and cand:
                existing_rev = db.query(CompanyReview).filter(
                    CompanyReview.company_id == comp.id,
                    CompanyReview.candidate_id == cand.id
                ).first()
                if not existing_rev:
                    rev = CompanyReview(
                        company_id=comp.id,
                        candidate_id=cand.id,
                        stars=rev_info["stars"],
                        text=rev_info["text"],
                        createdAt=datetime.now(timezone.utc) - timedelta(days=5)
                    )
                    db.add(rev)
                    review_count += 1
        db.flush()
        print(f"✓ Seeded {review_count} Company Reviews")

        db.commit()
        print("\n🎉 Database successfully seeded with rich mock data!")
        print("Default accounts for testing (Password: password123):")
        print(" - Candidate: saitejabrawl@gmail.com")
        print(" - Candidate: aarav.sharma@example.com")
        print(" - Company (Google): careers@google.com")
        print(" - Company (Stripe): contact@stripe.com")
        print(" - Hiring Manager (Stripe): sarah.jenkins@stripe.com")
        print(" - Hiring Manager (Google): alex.rivera@google.com")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()