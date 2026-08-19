# Security in Hirely FastAPI Backend

This document explains how authentication and authorization are implemented across the FastAPI backend. The design mirrors the original Spring Boot implementation.

---

## Table of Contents

1. [Authentication Flow](#1-authentication-flow)
2. [JWT Token Structure](#2-jwt-token-structure)
3. [Password Hashing](#3-password-hashing)
4. [Authorization — Dependency Injection Guards](#4-authorization--dependency-injection-guards)
5. [Role System](#5-role-system)
6. [Object-Level (Fine-Grained) Authorization](#6-object-level-fine-grained-authorization)
7. [Public vs Protected Routes](#7-public-vs-protected-routes)
8. [CORS](#8-cors)
9. [Configuration & Secrets](#9-configuration--secrets)

---

## 1. Authentication Flow

Authentication is **stateless** — no sessions. Every protected request must carry a signed JWT in the `Authorization` header.

```
Client                              FastAPI
  |                                    |
  |  POST /auth/login/candidate        |
  |  { email, password }  -----------> |
  |                                    |  1. Query DB for user by email
  |                                    |  2. bcrypt.checkpw(plain, hashed)
  |                                    |  3. create_access_token(email, id, type)
  |  <------ { token: "eyJ...", type } |
  |                                    |
  |  GET /candidate/me                 |
  |  Authorization: Bearer eyJ...  --> |
  |                                    |  4. HTTPBearer extracts token
  |                                    |  5. decode_access_token() — verifies sig + expiry
  |                                    |  6. Reads `type` claim → checks role
  |                                    |  7. Fetches live user from DB
  |  <------ 200 { ...profile }        |
```

There are **three separate login endpoints**, one per account type, because each type lives in a different DB table:

| Account Type    | Login endpoint                    | Signup endpoint                    |
|-----------------|-----------------------------------|------------------------------------|
| Candidate       | `POST /auth/login/candidate`      | `POST /auth/signup/candidate`      |
| Company         | `POST /auth/login/company`        | `POST /auth/signup/company`        |
| Hiring Manager  | `POST /auth/login/hiring-manager` | `POST /auth/signup/hiring-manager` |

> **Signup returns a JWT token** — after successful registration the user is immediately authenticated. No separate login step is required.

---

## 2. JWT Token Structure

Tokens are created in [`core/security.py`](./core/security.py) using `python-jose`.

**Algorithm:** `HS256`  
**Default expiry:** 1440 minutes (24 hours), configured via `ACCESS_TOKEN_EXPIRE_MINUTES` in [`core/config.py`](./core/config.py)

### Payload (claims)

```json
{
  "sub":    "user@example.com",
  "userId": 42,
  "type":   "CANDIDATE",
  "exp":    1724112000
}
```

| Claim    | Description                                                    |
|----------|----------------------------------------------------------------|
| `sub`    | The user's email address (subject)                             |
| `userId` | Primary key of the user in their respective table              |
| `type`   | Account type — `CANDIDATE`, `COMPANY`, or `HIRING_MANAGER`     |
| `exp`    | Unix timestamp when the token expires                          |

The `type` claim is critical — it tells every downstream dependency which DB table to look up and which permissions to apply.

### Token generation

```python
# core/security.py
def create_access_token(subject, user_id, user_type, expires_delta=None):
    to_encode = {
        "sub": str(subject),
        "userId": user_id,
        "type": user_type,
        "exp": datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
```

### Token decoding / validation

```python
# core/security.py
def decode_access_token(token):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.JWTError:
        return None   # expired or tampered tokens return None → 401
```

`python-jose` automatically verifies the signature **and** the expiry (`exp`) claim on every call to `jwt.decode()`.

---

## 3. Password Hashing

All passwords are hashed with **bcrypt** before storage and are never stored or returned in plain text.

```python
# core/security.py
def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
```

- Uses the **same** algorithm as Spring's `BCryptPasswordEncoder` — hashed passwords are cross-compatible.
- `bcrypt.gensalt()` generates a new random salt on every hash call — two users with the same password produce different hashes.

---

## 4. Authorization — Dependency Injection Guards

FastAPI's dependency injection replaces Spring Security's filter chain. All auth logic lives in [`api/deps.py`](./api/deps.py).

### Step 1 — Extract and validate the token

```python
security = HTTPBearer()

def get_current_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Could not validate credentials",
                            headers={"WWW-Authenticate": "Bearer"})
    return payload
```

`HTTPBearer()` reads the `Authorization: Bearer <token>` header automatically. If the header is absent, FastAPI returns `403` before the function is even called.

### Step 2 — Resolve the actual user from the DB

Each account type has its own dependency that:
1. Checks the `type` claim matches
2. Fetches the live user record from the database
3. Returns the ORM object, so route handlers get a real model instance

```python
def get_current_candidate(payload = Depends(get_current_user_token), db = Depends(get_db)) -> Candidate:
    if payload.get("type") != "CANDIDATE":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    candidate = db.query(Candidate).filter(Candidate.id == payload.get("userId")).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

# Similar for get_current_company and get_current_hiring_manager
```

> **Note:** The DB is queried on **every** request, not just at login. This ensures that if a user is deleted or deactivated, their token stops working immediately.

### Step 3 — Combined role guard (COMPANY or HIRING_MANAGER)

For endpoints that mirror Spring's `hasAnyRole("COMPANY", "HIRING_MANAGER")`, a `CompanyOrHMUser` helper is used:

```python
class CompanyOrHMUser:
    type: str               # "COMPANY" or "HIRING_MANAGER"
    company: Company        # populated when type == "COMPANY"
    hm: HiringManager       # populated when type == "HIRING_MANAGER"

    @property
    def is_company(self) -> bool: ...
    @property
    def is_hiring_manager(self) -> bool: ...

def get_current_company_or_hm(...) -> CompanyOrHMUser:
    # Accepts both COMPANY and HIRING_MANAGER tokens
    # Returns CompanyOrHMUser so routes can branch on .is_company / .is_hiring_manager
```

### How to protect a route

```python
# Single role
@router.get("/me")
def get_profile(current_candidate: Candidate = Depends(get_current_candidate)):
    return current_candidate

# Either COMPANY or HIRING_MANAGER
@router.post("/postings")
def create_job(current_user: CompanyOrHMUser = Depends(get_current_company_or_hm), ...):
    if current_user.is_company:
        company_id = current_user.company.id
    else:
        company_id = current_user.hm.hiringDepartment.company.id
```

---

## 5. Role System

There are three roles. Each maps to its own DB table and its own dependency guard:

| Role              | DB Table          | Guard dependency                |
|-------------------|-------------------|---------------------------------|
| `CANDIDATE`       | `candidates`      | `get_current_candidate`         |
| `COMPANY`         | `companies`       | `get_current_company`           |
| `HIRING_MANAGER`  | `hiring_managers` | `get_current_hiring_manager`    |
| `COMPANY` or `HIRING_MANAGER` | both | `get_current_company_or_hm`    |

Role enforcement is **explicit per route** — each endpoint declares exactly which guard it requires. There is no global middleware or URL-pattern matcher.

---

## 6. Object-Level (Fine-Grained) Authorization

Beyond role checks, many routes enforce **ownership** — users can only access or modify their own data. This is done by filtering DB queries with the current user's ID, not just any ID from the URL.

| Resource | Check |
|---|---|
| Candidate skills | `candidate_id == current_candidate.id` |
| Candidate experiences | `candidate_id == current_candidate.id` |
| Candidate resumes | `candidate_id == current_candidate.id` |
| Job applications (candidate) | `candidate_id == current_candidate.id` |
| HM job postings | `hiring_manager_id == current_hm.id` |
| HM applicant access | `job.hiring_manager_id == current_hm.id` |
| Company applicant access | `job.company_id == current_company.id` |
| Company → hiring manager deletion | `department.company_id == current_company.id` |
| Company review deletion | `candidate_id == current_candidate.id` |

---

## 7. Public vs Protected Routes

### Public (no token required)

| Method | Path                       | Description                  |
|--------|----------------------------|------------------------------|
| `POST` | `/auth/login/*`            | Login for all account types  |
| `POST` | `/auth/signup/*`           | Registration (returns token) |
| `GET`  | `/catalog/skills`          | All skills                   |
| `GET`  | `/catalog/roles`           | All job roles                |
| `GET`  | `/catalog/industries`      | All industries               |
| `GET`  | `/company`                 | List all companies           |
| `GET`  | `/company/{id}/reviews`    | Reviews for a company        |
| `GET`  | `/job/postings`            | Browse job listings          |

### Protected — CANDIDATE only

| Method   | Path                              | Description                      |
|----------|-----------------------------------|----------------------------------|
| `GET`    | `/candidate/me`                   | Get own profile                  |
| `PUT`    | `/candidate/me`                   | Update own profile               |
| `GET`    | `/candidate/skills`               | List own skills                  |
| `POST`   | `/candidate/skills`               | Add/update skills                |
| `DELETE` | `/candidate/skills/{id}`          | Remove a skill                   |
| `GET`    | `/candidate/experiences`          | List own experiences             |
| `POST`   | `/candidate/experiences`          | Add an experience                |
| `DELETE` | `/candidate/experiences/{id}`     | Delete an experience             |
| `GET`    | `/candidate/resumes`              | List own resumes                 |
| `POST`   | `/candidate/resumes`              | Upload a resume                  |
| `DELETE` | `/candidate/resumes/{id}`         | Delete a resume                  |
| `GET`    | `/candidate/resumes/{id}/blob`    | Download own resume file         |
| `POST`   | `/job/apply`                      | Apply for a job                  |
| `GET`    | `/job/applications/me`            | List own applications            |
| `GET`    | `/job/applications/{id}`          | Get application details          |
| `DELETE` | `/job/applications/{id}`          | Withdraw an application          |
| `GET`    | `/notifications`                  | Get own notifications            |
| `POST`   | `/company/reviews`                | Write a company review           |
| `DELETE` | `/company/reviews/{id}`           | Delete own review                |

### Protected — COMPANY only

| Method   | Path                              | Description                          |
|----------|-----------------------------------|--------------------------------------|
| `GET`    | `/company/me`                     | Get own company profile              |
| `PUT`    | `/company/me`                     | Update own company profile           |
| `POST`   | `/company/departments`            | Add a department                     |
| `POST`   | `/company/hiring-managers`        | Add a hiring manager                 |
| `GET`    | `/company/hiring-managers`        | List own hiring managers             |
| `DELETE` | `/company/hiring-managers/{id}`   | Remove a hiring manager              |

### Protected — HIRING_MANAGER only

| Method   | Path                              | Description                          |
|----------|-----------------------------------|--------------------------------------|
| `GET`    | `/hiring-manager/me`              | Get own profile                      |
| `PUT`    | `/hiring-manager/me`              | Update own profile                   |

### Protected — COMPANY or HIRING_MANAGER

| Method   | Path                              | Description                          |
|----------|-----------------------------------|--------------------------------------|
| `POST`   | `/job/postings`                   | Create a job posting                 |
| `DELETE` | `/job/postings/{id}`              | Delete a job posting (HM: own only)  |
| `GET`    | `/job/{id}/applicants`            | View applicants (own scope)          |
| `PUT`    | `/job/applications/{id}/status`   | Update application status            |
| `GET`    | `/job/applications/{id}/resume`   | Download applicant's resume          |

---

## 8. CORS

Cross-Origin Resource Sharing is configured in [`main.py`](./main.py) using FastAPI's built-in `CORSMiddleware`:

```python
allowed_origins = [o.strip() for o in settings.CORS_ALLOWED_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"],
    expose_headers=["Authorization"],
)
```

- Allowed origins are read from the `CORS_ALLOWED_ORIGINS` environment variable (comma-separated).
- Default: `http://localhost:8080` — override in `.env` for production.
- `allow_credentials=True` is required so the browser sends the `Authorization` header on cross-origin requests.

---

## 9. Configuration & Secrets

All security-related settings are defined in [`core/config.py`](./core/config.py) using `pydantic-settings`. Values are loaded from the `.env` file first; the in-code value is the fallback.

**`SECRET_KEY` and `MAIL_PASSWORD` have no default value** — the application will refuse to start if they are not set in the environment. This prevents accidental deployment with exposed secrets.

### Setup

```bash
cp .env.example .env
# Edit .env and fill in all required values
```

### Generating a secure `SECRET_KEY`

```bash
openssl rand -base64 32
```

### `.env.example`

See [`.env.example`](./.env.example) for all available variables and their descriptions.

### Key settings

| Variable                      | Default               | Required |
|-------------------------------|-----------------------|----------|
| `SECRET_KEY`                  | *(none)*              | ✅ Yes   |
| `DATABASE_URL`                | local postgres        | Recommended |
| `CORS_ALLOWED_ORIGINS`        | `http://localhost:8080` | Recommended |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` (24h)          | No       |
| `MAIL_PASSWORD`               | *(none)*              | If mail used |
