from pydantic import BaseModel, EmailStr
from schemas import UserSchemaIn


class LoginSchemaOut(BaseModel):
    token: str
    user: UserSchemaIn


class OtpEmailLoginSchemaIn(BaseModel):
    email: EmailStr
    otp: str


class OtpEmailGenerateSchemaIn(BaseModel):
    email: EmailStr


class OtpEmailGenerateSchemaOut(BaseModel):
    message: str
