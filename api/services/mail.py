from fastapi import HTTPException, status
from pydantic import EmailStr

from core import env
import yagmail


class MailService:
    def __init__(self):
        self.SENDER_MAIL_ADDRESS = env.EMAIL_SERVER_ADDRESS
        self.SENDER_MAIL_PASSWORD = env.EMAIL_HOST_PASSWORD

    def send_mail(
        self, recipient_address: EmailStr, subject: str, contents: str
    ) -> bool:
        try:
            mail_service = yagmail.SMTP(
                self.SENDER_MAIL_ADDRESS, self.SENDER_MAIL_PASSWORD
            )
            mail_service.send(
                to=recipient_address,
                subject=subject,
                contents=contents,
            )
            return True
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Unable to send mail: {e}",
            )
