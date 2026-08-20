from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
from core.config import settings
from models.candidate import Candidate
import models
from api.routers import auth, candidate, company, job, catalog, hiring_manager
from api.deps import get_current_candidate
from contextlib import asynccontextmanager
# Optional: Create all tables (In production, use alembic)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield
    # print("dropping tables")
    # Base.metadata.drop_all(bind=engine)
app = FastAPI(title=settings.PROJECT_NAME,lifespan=lifespan)

# CORS — origins are read from CORS_ALLOWED_ORIGINS env var (comma-separated)
allowed_origins = [o.strip() for o in settings.CORS_ALLOWED_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"],
    expose_headers=["Authorization"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(candidate.router, prefix="/candidate", tags=["candidate"])
app.include_router(company.router, prefix="/company", tags=["company"])
app.include_router(hiring_manager.router, prefix="/hiring-manager", tags=["hiring-manager"])
app.include_router(job.router, prefix="/job", tags=["job"])
app.include_router(catalog.router, prefix="/catalog", tags=["catalog"])

@app.get("/")
def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

@app.get("/notifications", tags=["notifications"])
def get_notifications(current_candidate: Candidate = Depends(get_current_candidate)):
    """
    Returns notifications for the authenticated candidate.
    Requires: CANDIDATE role (Bearer token).
    """
    # Placeholder — implement notification logic here
    return []
