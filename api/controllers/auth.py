from core import get_db_session
from fastapi import APIRouter, Depends
from models import UserMapper
from schemas import (
    LoginSchemaOut,
    OtpEmailGenerateSchemaOut,
    OtpEmailGenerateSchemaIn,
    OtpEmailLoginSchemaIn,
)
from services.auth import AuthService
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/auth", tags=["AUTH"])


@router.post("/otp/email/login", response_model=LoginSchemaOut)
async def login_otp_email(
    credential: OtpEmailLoginSchemaIn, session: Session = Depends(get_db_session)
):
    user = UserMapper.get_by_email(session, credential.email)
    if not user:
        user = UserMapper.create(session, data={"email": credential.email})
    return AuthService.otp_login_via_email(credential, user)


@router.post("/otp/email/generate", response_model=OtpEmailGenerateSchemaOut)
async def generate_otp_email(credential: OtpEmailGenerateSchemaIn):
    return AuthService.generate_otp_via_email(credential.email)
