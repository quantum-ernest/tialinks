from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core import get_db_session
from typing import List
from models import LinkMapper
from schemas import LinkSchemaOut, LinkSchemaIn
from services import IsAuthenticated
from utils import generate_readable_short_code

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

    data.update(
        {
            "original_url": str(data.get("original_url")),
            "shortcode": shortcode,
            "user_id": auth_user.get("user_id"),
        }
    )

    return LinkMapper.create(session=session, data=data)
