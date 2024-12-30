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
    LinkInteractionMapper,
    UtmMapper,
)
from schemas import ClickSchemaOut
from services import IsAuthenticated

router = APIRouter(tags=["CLICK"])


@router.get("/{shortcode}", response_class=RedirectResponse)
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
    user_agent_data = request.headers.get("User-Agent")
    user_agent = (
        UserAgentMapper.create(session=session, user_agent=user_agent_data)
        if user_agent_data
        else None
    )

    ip_address = request.client.host
    location = (
        LocationMapper.create(session=session, ip_address=ip_address)
        if user_agent_data
        else None
    )

    referer_data = request.headers.get("Referer")
    referer = (
        RefererMapper.create(session=session, referer=referer_data)
        if referer_data
        else None
    )
    click_obj = {
        "link_id": link.id,
        "user_id": link.user_id,
        "user_agent_id": user_agent.id if user_agent else None,
        "location_id": location.id if location else None,
        "referer_id": referer.id if referer else None,
    }
    click = ClickMapper.create(session=session, data=click_obj)
    link.count += 1
    session.commit()
    utm = (
        UtmMapper.get_by_id(session=session, pk_id=link.utm_id, user_id=link.user_id)
        if link.utm_id
        else None
    )
    link_interaction = {
        "created_at": click.created_at,
        "link_id": link.id,
        "shortcode": shortcode,
        "original_url": link.original_url,
        "campaign": utm.campaign if utm else None,
        "source": utm.source if utm else None,
        "medium": utm.medium if utm else None,
        "browser": user_agent.browser if user_agent else None,
        "operating_system": user_agent.operating_system if user_agent else None,
        "device": user_agent.device if user_agent else None,
        "domain": referer.domain if referer else None,
        "path": referer.path if referer else None,
        "continent": location.continent if location else None,
        "country": location.country if location else None,
        "region": location.region if location else None,
        "city": location.city if location else None,
        "user_id": link.user_id,
    }
    LinkInteractionMapper.create(session=session, data=link_interaction)
    return link.original_url


@router.get("/links/{link_id}", response_model=List[ClickSchemaOut])
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
