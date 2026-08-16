from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from core.config import settings
from models.job import JobPosting
from datetime import datetime

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fast_mail = FastMail(conf)

def build_html_body(header: str, greeting: str, message: str, btn_text: str, btn_link: str) -> str:
    year = datetime.now().year
    return f"""
    <!DOCTYPE html>
    <html><head><style>
    body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333333; }}
    .container {{ background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #eaeaea; }}
    h2 {{ color: #1a1a1a; margin-top: 0; }}
    p {{ font-size: 16px; line-height: 1.6; color: #555555; }}
    .button {{ display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; }}
    .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #999999; text-align: center; }}
    </style></head><body>
    <div class='container'>
    <h2>{header}</h2>
    <p>{greeting}</p>
    <p>{message}</p>
    <a href="{btn_link}" class="button">{btn_text}</a>
    <div class='footer'>&copy; {year} Hirely. All rights reserved.</div>
    </div>
    </body></html>
    """

async def send_welcome_email(to: EmailStr, name: str, role: str):
    frontend_url = "http://localhost:8080"
    html_body = build_html_body(
        "Welcome to Hirely!",
        f"Hi {name},",
        f"We are thrilled to have you on board as a <strong>{role}</strong>! Hirely is dedicated to connecting top talent with amazing opportunities.",
        "Explore Hirely",
        f"{frontend_url}/jobs"
    )
    message = MessageSchema(
        subject="Welcome to Hirely!",
        recipients=[to],
        body=html_body,
        subtype=MessageType.html
    )
    await fast_mail.send_message(message)

async def send_job_application_email(to: EmailStr, candidate_name: str, job_title: str, company_name: str):
    frontend_url = "http://localhost:8080"
    html_body = build_html_body(
        "Application Successful",
        f"Hi {candidate_name},",
        f"Your application for the <strong>{job_title}</strong> position at <strong>{company_name}</strong> has been received successfully. The hiring team will review your profile and get back to you.",
        "View Jobs",
        f"{frontend_url}/jobs"
    )
    message = MessageSchema(
        subject=f"Application Received: {job_title}",
        recipients=[to],
        body=html_body,
        subtype=MessageType.html
    )
    await fast_mail.send_message(message)
