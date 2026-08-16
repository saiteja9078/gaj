from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
import models
from api.routers import auth, candidate, company, job, catalog, hiring_manager

# Optional: Create all tables (In production, use alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hirely API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(candidate.router, prefix="/candidate", tags=["candidate"])
app.include_router(company.router, prefix="/company", tags=["company"])
app.include_router(hiring_manager.router, prefix="/hiring-manager", tags=["hiring-manager"])
app.include_router(job.router, prefix="/job", tags=["job"])
app.include_router(catalog.router, prefix="/catalog", tags=["catalog"])

@app.get("/")
def root():
    return {"message": "Welcome to Hirely API"}

@app.get("/notifications")
def get_notifications():
    # Placeholder for notifications
    return []
