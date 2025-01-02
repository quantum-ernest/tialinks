from typing import Optional
from datetime import datetime
from queries import *  # noqa: F403
from sqlalchemy import PrimaryKeyConstraint, text, select, func, cast, Date
from models import Base
from sqlalchemy.orm import Mapped, mapped_column, Session


class LinkInteractionMapper(Base):
    id: Mapped[int] = mapped_column(autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, index=True)
    link_id: Mapped[int] = mapped_column(index=True)
    shortcode: Mapped[str] = mapped_column(index=True)
    original_url: Mapped[str] = mapped_column(index=True)
    campaign: Mapped[Optional[str]] = mapped_column(index=True)
    source: Mapped[Optional[str]] = mapped_column(index=True)
    medium: Mapped[Optional[str]] = mapped_column(index=True)
    browser: Mapped[Optional[str]] = mapped_column(index=True)
    operating_system: Mapped[Optional[str]] = mapped_column(index=True)
    device: Mapped[Optional[str]] = mapped_column(index=True)
    domain: Mapped[Optional[str]] = mapped_column(index=True)
    path: Mapped[Optional[str]] = mapped_column(index=True)
    continent: Mapped[Optional[str]] = mapped_column(index=True)
    country: Mapped[Optional[str]] = mapped_column(index=True)
    region: Mapped[Optional[str]] = mapped_column(index=True)
    city: Mapped[Optional[str]] = mapped_column(index=True)
    user_id: Mapped[int] = mapped_column(index=True)
    __table_args__ = (PrimaryKeyConstraint("id", "created_at"),)

    @classmethod
    def get_total_clicks(cls, session: Session, user_id: int):
        return session.execute(
            select(func.count(cls.id)).where(cls.user_id == user_id)
        ).scalar_one()

    @classmethod
    def get_top_performing_links(cls, session: Session, user_id: int):
        records = session.execute(
            select(cls.link_id, cls.shortcode, func.count().label("click_count"))
            .where(cls.user_id == user_id)
            .group_by(cls.link_id, cls.shortcode)
            .order_by(func.count().desc())
        ).all()
        return [
            {
                "link_id": row.link_id,
                "shortcode": row.shortcode,
                "click_count": row.click_count,
            }
            for row in records
        ]

    @classmethod
    def get_total_clicks_per_day(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ):
        query = select(
            cast(cls.created_at, Date).label("date"), func.count().label("click_count")
        ).where(cls.user_id == user_id)
        if start_date:
            query = query.where(cls.created_at >= start_date)
        if end_date:
            query = query.where(cls.created_at <= end_date)
        query = query.group_by(cast(cls.created_at, Date)).order_by(
            cast(cls.created_at, Date)
        )
        records = session.execute(query).all()
        return [{"date": row.date, "click_count": row.click_count} for row in records]

    @classmethod
    def get_top_referring_campaign(cls, session: Session, user_id: int):
        query = (
            select(cls.campaign, func.count().label("click_count"))
            .where(cls.user_id == user_id)
            .group_by(cls.campaign)
            .order_by(func.count().desc())
        )
        records = session.execute(query).all()
        return [
            {"campaign": row.campaign, "click_count": row.click_count}
            for row in records
        ]

    @classmethod
    def get_top_referring_site(cls, session: Session, user_id: int):
        query = (
            select(cls.domain, func.count().label("click_count"))
            .where(cls.user_id == user_id)
            .group_by(cls.domain)
            .order_by(func.count().desc())
        )
        result = session.execute(query).all()
        return [
            {"domain": row.domain, "click_count": row.click_count} for row in result
        ]

    @classmethod
    def get_top_devices(cls, session: Session, user_id: int):
        query = (
            select(cls.device, func.count().label("click_count"))
            .where(cls.user_id == user_id)
            .group_by(cls.device)
            .order_by(func.count().desc())
        )
        result = session.execute(query).all()
        return [
            {"device": row.device, "click_count": row.click_count} for row in result
        ]

    @classmethod
    def get_top_country(cls, session: Session, user_id: int):
        query = (
            select(cls.country, func.count().label("click_count"))
            .where(cls.user_id == user_id)
            .group_by(cls.country)
            .order_by(func.count().desc())
        )
        result = session.execute(query).all()
        return [
            {"country": row.country, "click_count": row.click_count} for row in result
        ]

    @classmethod
    def get_monthly_click_trend(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ):
        query = select(
            func.date_trunc("month", cls.created_at).label("month"),
            func.count().label("click_count"),
        ).where(cls.user_id == user_id)
        if start_date:
            query = query.where(cls.created_at >= start_date)
        if end_date:
            query = query.where(cls.created_at <= end_date)
        query = query.group_by(func.date_trunc("month", cls.created_at)).order_by(
            func.date_trunc("month", cls.created_at)
        )
        records = session.execute(query).all()
        return [{"month": row.month, "click_count": row.click_count} for row in records]

    @classmethod
    def get_clicks_trend_by_day(cls, session: Session, user_id: int):
        result = session.execute(
            text(clicks_trend_by_day), {"user_id": user_id}
        ).fetchall()
        clicks_data = []
        for row in result:
            clicks_data.append(
                {
                    "date": row[0],
                    "shortcode": row[1],
                    "link_id": row[2],
                    "clicks": row[3],
                }
            )
        return clicks_data

    @classmethod
    def get_clicks_by_continent(cls, session: Session, user_id: int):
        result = session.execute(
            text(clicks_by_continent), {"user_id": user_id}
        ).fetchall()
        clicks_data = []
        for row in result:
            clicks_data.append(
                {
                    "continent": row[0],
                    "shortcode": row[1],
                    "link_id": row[2],
                    "clicks": row[3],
                }
            )
        return clicks_data

    @classmethod
    def get_clicks_by_country(cls, session: Session, user_id: int):
        result = session.execute(
            text(clicks_by_country), {"user_id": user_id}
        ).fetchall()
        clicks_data = []
        for row in result:
            clicks_data.append(
                {
                    "country": row[0],
                    "shortcode": row[1],
                    "link_id": row[2],
                    "clicks": row[3],
                }
            )
        return clicks_data

    @classmethod
    def get_clicks_by_region(cls, session: Session, user_id: int):
        result = session.execute(
            text(clicks_by_region), {"user_id": user_id}
        ).fetchall()
        clicks_data = []
        for row in result:
            clicks_data.append(
                {
                    "region": row[0],
                    "shortcode": row[1],
                    "link_id": row[2],
                    "clicks": row[3],
                }
            )
        return clicks_data

    @classmethod
    def get_clicks_by_city(cls, session: Session, user_id: int):
        result = session.execute(text(clicks_by_city), {"user_id": user_id}).fetchall()
        clicks_data = []
        for row in result:
            clicks_data.append(
                {
                    "city": row[0],
                    "shortcode": row[1],
                    "link_id": row[2],
                    "clicks": row[3],
                }
            )
        return clicks_data

    @classmethod
    def get_clicks_by_country_city(cls, session: Session, user_id: int):
        result = session.execute(
            text(clicks_by_country_city), {"user_id": user_id}
        ).fetchall()
        clicks_data = []
        for row in result:
            clicks_data.append(
                {
                    "country": row[0],
                    "city": row[1],
                    "shortcode": row[2],
                    "link_id": row[3],
                    "clicks": row[4],
                }
            )
        return clicks_data

    @classmethod
    def top_countries_for_shortcodes(cls, session: Session, user_id: int):
        result = session.execute(
            text(top_countries_for_shortcodes), {"user_id": user_id}
        ).fetchall()
        clicks_data = []
        for row in result:
            clicks_data.append(
                {
                    "country": row[0],
                    "shortcode": row[1],
                    "link_id": row[2],
                    "clicks": row[3],
                }
            )
        return clicks_data
