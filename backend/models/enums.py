import enum

class ApplicationStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    SCREENING = "SCREENING"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    REJECTED = "REJECTED"
    APPROVED = "APPROVED"

class Gender(str, enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"

class PostingStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    OPEN = "OPEN"
    CLOSED = "CLOSED"

class Proficiency(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    EXPERT = "EXPERT"

class JobType(str, enum.Enum):
    INTERN = "INTERN"
    FULL_TIME = "FULL_TIME"
    PART_TIME = "PART_TIME"

class WorkMode(str, enum.Enum):
    REMOTE = "REMOTE"
    ONSITE = "ONSITE"
    HYBRID = "HYBRID"
