from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "gaj"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/gaj"
    
    # JWT Auth
    SECRET_KEY: str = "ZDLlXLDRfPqKkcYdZfXalFXYEvL5dxm2dbAUcdE83uy"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 86400000 ms = 24 hours
    
    # Uploads
    UPLOAD_ROOT_DIR: str = "../uploads"
    MAX_RESUME_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_RESUME_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    
    MAX_IMAGE_SIZE: int = 1 * 1024 * 1024  # 1MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/png", "image/jpeg", "image/webp"]
    
    # Mail
    MAIL_USERNAME: str = "akagami.no.shanks71821@gmail.com"
    MAIL_PASSWORD: str = "waogsatyjbbmksevon"
    MAIL_FROM: str = "akagami.no.shanks71821@gmail.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
