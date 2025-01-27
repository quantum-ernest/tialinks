from datetime import datetime

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
    link = LinkMapper.get_by_shortcode(session, shortcode)
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"TiaLinks: Unable to locate shortcode /{shortcode}",
        )
    if link.expires_at and link.expires_at < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TiaLinks: Shortcode not active",
        )
    user_agent_data = request.headers.get("User-Agent")
    user_agent = (
        UserAgentMapper.create_from_link(session=session, user_agent=user_agent_data)
        if user_agent_data
        else UserAgentMapper.create(session=session, data={"user_agent": "N/A","browser": "N/A","operating_system": "N/A","device": "N/A"})
    )

    ip_address = request.client.host
    location = (
        LocationMapper.create_from_link(session=session, ip_address=ip_address)
        if ip_address
        else LocationMapper.create(session=session, data={"continent": "N/A","country": "N/A","region": "N/A","city": "N/A"})
    )

    referer_data = request.headers.get("Referer")
    referer = (
        RefererMapper.create_from_link(session=session, referer=referer_data)
        if referer_data
        else RefererMapper.create(session=session, data={"full_url": "N/A","domain": "N/A"})
    )
    click_obj = {
        "link_id": link.id,
        "user_id": link.user_id,
        "user_agent_id": user_agent.id,
        "location_id": location.id,
        "referer_id": referer.id,
    }
    click = ClickMapper.create(session=session, data=click_obj)
    link.increment_count(session)
    utm = UtmMapper.get_by_id(session=session, pk_id=link.utm_id, user_id=link.user_id)

    link_interaction = {
        "created_at": click.created_at,
        "link_id": link.id,
        "shortcode": shortcode,
        "original_url": link.original_url,
        "generated_url": link.generated_url,
        "campaign": utm.campaign,
        "source": utm.source,
        "medium": utm.medium,
        "browser": user_agent.browser,
        "operating_system": user_agent.operating_system,
        "device": user_agent.device,
        "domain": referer.domain,
        "continent": location.continent,
        "country": location.country,
        "region": location.region,
        "city": location.city,
        "user_id": link.user_id,
    }
    LinkInteractionMapper.create(session=session, data=link_interaction)
    return link.original_url


@router.get("/api/v1/clicks/{link_id}", response_model=List[ClickSchemaOut])
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
