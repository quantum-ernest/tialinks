from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core import get_db_session
from models import LinkInteractionMapper, LinkMapper
from services import IsAuthenticated

router = APIRouter(prefix="/api/v1/analytics", tags=["ANALYSIS"])


@router.get("/dashboard")
async def get_dashboard_summary(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    total_clicks = LinkInteractionMapper.get_total_clicks(
        session=session, user_id=auth_user["user_id"]
    )
    total_links = LinkMapper.get_total_links(
        session=session, user_id=auth_user["user_id"]
    )
    distinct_total_links = LinkInteractionMapper.get_distinct_total_links(
        session=session, user_id=auth_user["user_id"]
    )
    result = {
        "total_links": total_links,
        "total_clicks": total_clicks,
        "average_clicks": round(total_clicks / total_links, 2)
        if total_links > 0
        else 0,
        "link_click_percentage": round(
            ((distinct_total_links / total_clicks) if total_links else 0) * 100, 2
        ),
        "top_performing_links": LinkInteractionMapper.get_top_performing_links(
            session=session, user_id=auth_user["user_id"]
        ),
        "total_clicks_per_day": LinkInteractionMapper.get_total_clicks_per_day(
            session=session, user_id=auth_user["user_id"]
        ),
        "top_referring_campaign": LinkInteractionMapper.get_top_referring_campaign(
            session=session, user_id=auth_user["user_id"]
        ),
        "top_referring_site": LinkInteractionMapper.get_top_referring_site(
            session=session, user_id=auth_user["user_id"]
        ),
        "top_device": LinkInteractionMapper.get_top_devices(
            session=session, user_id=auth_user["user_id"]
        ),
        "top_country": LinkInteractionMapper.get_geo_summary_data(
            session=session, user_id=auth_user["user_id"]
        ),
        "monthly_click_trend": LinkInteractionMapper.get_monthly_click_trend(
            session=session, user_id=auth_user["user_id"]
        ),
    }
    return result


@router.get("")
async def get_analytics(
    start_date: datetime,
    end_date: datetime,
    link_id: Optional[int] = None,
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    total_clicks = LinkInteractionMapper.get_total_clicks(
        session=session,
        user_id=auth_user["user_id"],
    )
    total_links = LinkMapper.get_total_links(
        session=session, user_id=auth_user["user_id"]
    )
    per_total_clicks = LinkInteractionMapper.get_total_clicks(
        session=session,
        user_id=auth_user["user_id"],
        start_date=start_date,
        end_date=end_date,
        link_id=link_id,
    )
    per_distinct_total_links = LinkInteractionMapper.get_distinct_total_links(
        session=session,
        user_id=auth_user["user_id"],
        start_date=start_date,
        end_date=end_date,
        link_id=link_id,
    )
    average_click_per_active_link = (
        per_total_clicks / per_distinct_total_links
        if per_distinct_total_links > 0
        else 0
    )

    result = {
        "total_links": total_links,
        "total_clicks": total_clicks,
        "average_clicks_per_active_link": round(average_click_per_active_link, 2),
        "top_performing_links": LinkInteractionMapper.get_top_performing_links(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
        "total_clicks_per_day": LinkInteractionMapper.get_total_clicks_per_day(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
        "referring_campaigns": LinkInteractionMapper.get_top_referring_campaign(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
        "referring_sites": LinkInteractionMapper.get_top_referring_site(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
        "devices": LinkInteractionMapper.get_top_devices(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
        "browsers": LinkInteractionMapper.get_top_browsers(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
        "operating_systems": LinkInteractionMapper.get_top_operating_systems(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
        "geographical_data": LinkInteractionMapper.get_geographical_data(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
        "monthly_click_trend": LinkInteractionMapper.get_monthly_click_trend(
            session=session,
            user_id=auth_user["user_id"],
            start_date=start_date,
            end_date=end_date,
            link_id=link_id,
        ),
    }
    return result
