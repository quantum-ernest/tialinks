from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core import get_db_session
from models import LinkInteractionMapper, LinkMapper
from services import IsAuthenticated

router = APIRouter(prefix="/api/analysis", tags=["ANALYSIS"])


@router.get("/dashboard/summary")
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
    result = {
        "total_links": total_links,
        "total_clicks": total_clicks,
        "average_clicks_per_link": round(total_clicks / total_links, 2)
        if total_links > 0
        else 0,
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
        "top_country": LinkInteractionMapper.get_top_country(
            session=session, user_id=auth_user["user_id"]
        ),
        "monthly_click_trend": LinkInteractionMapper.get_monthly_click_trend(
            session=session, user_id=auth_user["user_id"]
        ),
    }
    return result


@router.get("/summary")
async def get_summary(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    return LinkInteractionMapper.get_total_clicks(
        session=session, user_id=auth_user["user_id"]
    )


@router.get("/trend")
async def get_trend(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    return LinkInteractionMapper.get_clicks_trend_by_day(
        session=session, user_id=auth_user["user_id"]
    )


@router.get("/trend/country")
async def get_trend_country(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    return LinkInteractionMapper.get_clicks_by_country(
        session=session, user_id=auth_user["user_id"]
    )
