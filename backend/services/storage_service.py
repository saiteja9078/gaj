import os
import shutil
from fastapi import UploadFile
from typing import Tuple
from core.config import settings

def save_pdf(file: UploadFile, candidate_id: int) -> Tuple[str, str]:
    """
    Saves a PDF and extracts its text.
    Returns (stored_path, extracted_text).
    """
    # Create directory if it doesn't exist
    upload_dir = os.path.join(settings.UPLOAD_ROOT_DIR, str(candidate_id))
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    
    # Store file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Extract text (mocked for simplicity, in production use PyMuPDF or Tika)
    extracted_text = "Mocked PDF text extraction for " + file.filename
    
    return file_path, extracted_text
