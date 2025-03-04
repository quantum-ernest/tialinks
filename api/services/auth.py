from datetime import datetime, timedelta

from fastapi import HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr

from core import env, redis_db
from schemas import OtpEmailLoginSchemaIn
from services import MailService
from utils import generate_otp, login_otp_template

mail_service = MailService()


class AuthService:
    pwd_context = CryptContext(schemes=["sha256_crypt"])

    @classmethod
    def hash_password(cls, password: str) -> str:
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str):
        return cls.pwd_context.verify(plain_password, hashed_password)

    @classmethod
    def create_access_token(cls, data: dict) -> str:
        encoded_jwt = jwt.encode(
            data.copy(), env.AUTH_SECRETE_KEY, algorithm=env.AUTH_ALGORITHM
        )
        return encoded_jwt

    @classmethod
    def get_access_token(cls, user) -> dict:
        token = cls.create_access_token(
            data={"user_id": user.id, "exp": datetime.now() + timedelta(weeks=4)}
        )
        return {"token": token, "user": user}

    @classmethod
    def decode_token(cls, token: str):
        try:
            decode_token = jwt.decode(
                token, env.AUTH_SECRETE_KEY, algorithms=[env.AUTH_ALGORITHM]
            )
            exp = decode_token.get("exp")
            if exp and datetime.fromtimestamp(exp) > datetime.now():
                return decode_token
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token is expired",
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
            redis_db.setex(name=str(email), value=otp, time=300)
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
        if redis_db.get(name=str(credential.email)) == credential.otp:
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
