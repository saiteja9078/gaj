from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hirely"

    # Database — override via DATABASE_URL in .env
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/hirely"

    # JWT Auth
    # SECRET_KEY has NO default — it MUST be set in .env / environment.
    # Generate one with:  openssl rand -base64 32
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # CORS — comma-separated list of allowed origins, e.g. http://localhost:8080,https://yourdomain.com
    CORS_ALLOWED_ORIGINS: str = "http://localhost:8080"

    # Uploads
    UPLOAD_ROOT_DIR: str = "../uploads"
    MAX_RESUME_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_RESUME_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    MAX_IMAGE_SIZE: int = 1 * 1024 * 1024  # 1MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/png", "image/jpeg", "image/webp"]

    # Mail — MAIL_PASSWORD has NO default — it MUST be set in .env / environment.
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
