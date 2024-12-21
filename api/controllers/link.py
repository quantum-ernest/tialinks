import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from core import get_db_session, env
from typing import List
from models import LinkMapper, UtmMapper
from schemas import LinkSchemaOut, LinkSchemaIn
from services import IsAuthenticated, generate_qr_codes
from utils import generate_readable_short_code, extract_utm_data

router = APIRouter(prefix="/api/link", tags=["LINK"])


@router.get("/", response_model=List[LinkSchemaOut])
async def get_all(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    return LinkMapper.get_all(session=session, user_id=auth_user.get("user_id"))


@router.post("/", response_model=LinkSchemaOut)
async def create(
    data: LinkSchemaIn,
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    data = data.model_dump()
    shortcode = None
    while True:
        new_shortcode = generate_readable_short_code()
        val_shortcode = LinkMapper.validate_shortcode(
            session=session, shortcode=new_shortcode
        )
        if val_shortcode is True:
            continue
        else:
            shortcode = new_shortcode
            break
    original_url = str(data.get("original_url"))
    utm_data = extract_utm_data(original_url)
    utm = UtmMapper.validate_utm(
        session=session,
        campaign=utm_data.get("utm_campaign"),
        source=utm_data.get("utm_source"),
        user_id=auth_user.get("user_id"),
    )
    if not utm and utm_data.get("utm_campaign") and utm_data.get("utm_source"):
        utm = UtmMapper.create(
            session=session,
            data={
                "campaign": utm_data.get("utm_campaign"),
                "source": utm_data.get("utm_source"),
                "medium": utm_data.get("utm_medium"),
                "user_id": auth_user.get("user_id"),
            },
        )

    qrcode = generate_qr_codes(f"{env.BASE_URL}/{shortcode}")

    data.update(
        {
            "original_url": original_url,
            "shortcode": shortcode,
            "qrcode": qrcode,
            "utm_id": utm.id if utm else None,
            "user_id": auth_user.get("user_id"),
        }
    )
    return LinkMapper.create(session=session, data=data)


@router.get("/qrcode/{filename}")
async def get_qrcode(
    filename: str,
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    qrcode = LinkMapper.get_qrcode(
        session=session, filename=filename, user_id=auth_user.get("user_id")
    )
    if not qrcode:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Image not found"
        )
    file_path = f"assets/images/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Image not found"
        )
    return FileResponse(file_path)
