from core.database import SessionLocal
from models.enums import ApplicationStatus
from schemas.job import StatusUpdate
from services.job_service import update_application_status
from api.deps import CompanyOrHMUser
from models.company import Company, HiringManager
from models.job import JobApplication, JobPosting

db = SessionLocal()
# find app 1
app = db.query(JobApplication).filter_by(id=1).first()
if app:
    # mock a company user
    user = CompanyOrHMUser(is_company=True, is_hiring_manager=False, company=app.job.company)
    try:
        update_application_status(db, user, 1, StatusUpdate(status="SCREENING"))
        print("Success")
    except Exception as e:
        import traceback
        traceback.print_exc()
