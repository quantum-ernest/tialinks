from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core import get_db_session, env
from typing import List
from models import LinkMapper, UtmMapper
from schemas import LinkSchemaOut, LinkSchemaIn, LinkSchemaUpdate
from services import IsAuthenticated
from utils import generate_readable_short_code, build_favicon_url, update_link_status

router = APIRouter(prefix="/api/v1/links", tags=["LINK"])


@router.get("", response_model=List[LinkSchemaOut])
async def get_all(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    return LinkMapper.get_all(session, auth_user.get("user_id"))


@router.post("", response_model=LinkSchemaOut)
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
    utm = (
        UtmMapper.get_by_id(
            session=session, pk_id=data.get("utm_id"), user_id=auth_user.get("user_id")
        )
        if data.get("utm_id")
        else UtmMapper.create_from_link(
            session=session,
            user_id=auth_user["user_id"],
            data=original_url,
        )
    )

    favicon_url = build_favicon_url(original_url)
    base_url = (
        env.BASE_URL
    )  # Todo: implement user configured url or default url(BASE_URL)
    data.update(
        {
            "original_url": original_url,
            "generated_url": base_url + "/" + shortcode,
            "shortcode": shortcode,
            "favicon_url": favicon_url,
            "utm_id": utm.id if utm else None,
            "user_id": auth_user.get("user_id"),
        }
    )
    return LinkMapper.create(session=session, data=data)


@router.put("/{id}", response_model=LinkSchemaOut)
async def update(
    id: int,
    data: LinkSchemaUpdate,
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    val_link = LinkMapper.get_by_id(session, id, user_id=auth_user["user_id"])
    if not val_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Link not found"
        )
    data = data.model_dump()
    if data.get("utm_id"):
        val_utm = UtmMapper.get_by_id(
            session, data["utm_id"], user_id=auth_user["user_id"]
        )
        if not val_utm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Utm not found"
            )
    data.update(
        {
            "id": id,
        }
    )
    return update_link_status([LinkMapper.update(session, data=data)])[0]
