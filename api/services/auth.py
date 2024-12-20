import redis
from fastapi import HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr

from core import env
from schemas import OtpEmailLoginSchemaIn
from services import MailService
from utils import generate_otp, login_otp_template

_redis = redis.Redis(host=env.REDIS_HOST, port=env.REDIS_PORT, decode_responses=True)
mail_service = MailService()


class AuthService:
    pwd_context = CryptContext(schemes=["sha256_crypt"])

    @classmethod
    def create_access_token(cls, data: dict) -> str:
        encoded_jwt = jwt.encode(
            data.copy(), env.AUTH_SECRETE_KEY, algorithm=env.AUTH_ALGORITHM
        )
        return encoded_jwt

    @classmethod
    def get_access_token(cls, user) -> dict:
        token = cls.create_access_token(
            data={
                "user_id": user.id,
            }
        )
        return {"token": token, "user": user}

    @classmethod
    def decode_token(cls, token: str):
        try:
            return jwt.decode(
                token, env.AUTH_SECRETE_KEY, algorithms=[env.AUTH_ALGORITHM]
            )
        except JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid Token: {e}"
            )

    @classmethod
    def otp_login_via_email(cls, credential: OtpEmailLoginSchemaIn, user) -> dict:
        verified_otp = cls.verity_email_otp(credential)
        if verified_otp:
            return cls.get_access_token(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect Verification Code",
            )

    @classmethod
    def generate_otp_via_email(cls, email: EmailStr) -> dict:
        cls.send_otp_via_email(email)
        return {"message": "OTP sent successfully"}

    @classmethod
    def send_otp_via_email(cls, email: EmailStr) -> bool:
        otp = generate_otp()
        try:
            _redis.setex(name=email, value=otp, time=300)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error while saving OTP: {e}",
            )
        mail_massage = login_otp_template.replace("{{otp}}", otp)
        mail_service.send_mail(email, "OTP for Login", mail_massage)
        return True

    @classmethod
    def verity_email_otp(cls, credential: OtpEmailLoginSchemaIn) -> bool:
        if _redis.get(name=credential.email) == credential.otp:
            return True
        return False


class UserAuthenticated(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(UserAuthenticated, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        token: HTTPAuthorizationCredentials = await super(
            UserAuthenticated, self
        ).__call__(request)
        if token:
            return AuthService.decode_token(token.credentials)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Token"
            )


class IsAuthenticated(UserAuthenticated):
    async def __call__(self, request: Request):
        user: dict = await UserAuthenticated.__call__(self, request)
        return user
