from typing import Optional
from datetime import datetime
from queries import *  # noqa: F403
from sqlalchemy import PrimaryKeyConstraint, text

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
        return session.scalars(text(total_clicks), {"user_id": user_id}).first()

    @classmethod
    def get_top_performing_links(cls, session: Session, user_id: int):
        result = session.execute(text(top_performing_links), {"user_id": user_id}).all()
        clicks_data = []
        for row in result:
            clicks_data.append(
                {"link_id": row[0], "shortcode": row[1], "click_count": row[2]}
            )
        return clicks_data

    @classmethod
    def get_top_referring_campaign(cls, session: Session, user_id: int):
        result = session.execute(
            text(top_referring_campaign), {"user_id": user_id}
        ).all()
        clicks_data = []
        for row in result:
            clicks_data.append({"source": row[0], "click_count": row[1]})
        return clicks_data

    @classmethod
    def get_top_referring_site(cls, session: Session, user_id: int):
        result = session.execute(text(top_referring_site), {"user_id": user_id}).all()
        clicks_data = []
        for row in result:
            clicks_data.append({"domain": row[0], "click_count": row[1]})
        return clicks_data

    @classmethod
    def get_top_devices(cls, session: Session, user_id: int):
        result = session.execute(text(top_device), {"user_id": user_id}).all()
        clicks_data = []
        for row in result:
            clicks_data.append({"device": row[0], "click_count": row[1]})
        return clicks_data

    @classmethod
    def get_top_country(cls, session: Session, user_id: int):
        result = session.execute(text(top_country), {"user_id": user_id}).all()
        clicks_data = []
        for row in result:
            clicks_data.append({"country": row[0], "click_count": row[1]})
        return clicks_data

    @classmethod
    def get_peak_click_month(cls, session: Session, user_id: int):
        result = session.execute(text(peak_click_month), {"user_id": user_id}).all()
        clicks_data = []
        for row in result:
            clicks_data.append({"month": row[0], "click_count": row[1]})
        return clicks_data

    @classmethod
    def get_total_clicks_per_day(cls, session: Session, user_id: int):
        result = session.execute(text(total_clicks_per_day), {"user_id": user_id}).all()
        clicks_data = []
        for row in result:
            clicks_data.append({"day": row[0], "year": row[1], "click_count": row[2]})
        return clicks_data

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
