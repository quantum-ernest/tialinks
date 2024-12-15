from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from typing import List, Optional
from sqlalchemy.orm import Session
from core import get_db_session
from models import (
    ClickMapper,
    LinkMapper,
    UserAgentMapper,
    LocationMapper,
    RefererMapper,
)
from schemas import ClickSchemaOut
from services import IsAuthenticated

router = APIRouter(tags=["CLICK"])


@router.get("/{shortcode}")
async def redirect(
    shortcode: str,
    request: Request,
    session: Session = Depends(get_db_session),
):
    link = LinkMapper.get_by_shortcode(session=session, shortcode=shortcode)
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"TiaLinks: Unable to locate short url /{shortcode}",
        )
    link.count += 1
    session.commit()
    user_agent_data = request.headers.get("User-Agent")
    user_agent_id = (
        UserAgentMapper.create(session=session, user_agent=user_agent_data)
        if user_agent_data
        else None
    )

    ip_address = request.client.host
    location_id = (
        LocationMapper.create(session=session, ip_address=ip_address)
        if user_agent_data
        else None
    )

    referer = request.headers.get("Referer")
    referer_id = (
        RefererMapper.create(session=session, referer=referer) if referer else None
    )
    click_obj = {
        "link_id": link.id,
        "user_id": link.user_id,
        "user_agent_id": user_agent_id,
        "location_id": location_id,
        "referrer": referer_id,
    }
    ClickMapper.create(session=session, data=click_obj)
    return RedirectResponse(url=link.original_url)


@router.get("/link/{link_id}", response_model=List[ClickSchemaOut])
async def get(
    link_id: Optional[int] = None,
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    if link_id:
        return ClickMapper.get_by_link_id(
            session=session, link_id=link_id, user_id=auth_user.get("user_id")
        )
    return ClickMapper.get_all(session=session, user_id=auth_user.get("user_id"))
