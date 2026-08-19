# GAJ - Get a Job

GAJ is a full-stack job application tracking platform that connects **Candidates**, **Hiring Managers**, and **Companies**. It allows candidates to build profiles, upload resumes, and apply for jobs, while offering companies and hiring managers a dashboard to post jobs, review applicants, and track application statuses.

## Architecture & Tech Stack

This repository consists of two main components:

### Frontend (`/frontend`)
The frontend is a modern single-page application built for speed and excellent user experience.
- **Framework**: React with Vite
- **Routing**: TanStack Router
- **Styling**: TailwindCSS (if applicable) / Custom CSS
- **API Communication**: Native `fetch` wrapper communicating with the FastAPI backend

### Backend (`/backend`)
The backend is a high-performance RESTful API built with Python and FastAPI.
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT & bcrypt
- **File Storage**: Local filesystem for Resumes (PDFs)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL Database

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Configuration:**
   Ensure you have a running PostgreSQL database. Update the connection string in `backend/core/config.py` to match your credentials (default expects `postgresql://postgres:postgres@localhost/gaj_db`).

5. **Run the API Server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend will be available at `http://localhost:8000`. You can view the automatic Swagger UI documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or `http://localhost:8080` depending on your Vite config).

---

## Features

* **Candidate Profiles**: Candidates can manage their skills, work experiences, and upload multiple resumes.
* **Company Profiles**: Companies can manage their hiring departments, reviews, and detailed company information.
* **Hiring Manager Dashboards**: Hiring managers can post job listings and track applicants through multiple application stages (Applied, Screening, Interview, Offer, Rejected).
* **Job Board**: A unified job board where candidates can search and apply for jobs.


