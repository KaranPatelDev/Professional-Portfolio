import smtplib
from email.message import EmailMessage

from app.config import settings


def send_contact_notification(name: str, email: str, message: str, budget_range: str | None, timeline: str | None) -> None:
    msg = EmailMessage()
    msg["Subject"] = f"New portfolio inquiry from {name}"
    msg["From"] = settings.smtp_user
    msg["To"] = settings.contact_to_email
    msg["Reply-To"] = email
    msg.set_content(
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Budget range: {budget_range or 'n/a'}\n"
        f"Timeline: {timeline or 'n/a'}\n\n"
        f"Message:\n{message}"
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as smtp:
        smtp.starttls()
        smtp.login(settings.smtp_user, settings.smtp_password)
        smtp.send_message(msg)
