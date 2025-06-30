import smtplib
from email.mime.text import MIMEText
from app.core.config import settings

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_USERNAME
    msg["To"] = to_email

    with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USERNAME, to_email, msg.as_string())
