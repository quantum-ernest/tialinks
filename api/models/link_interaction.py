from typing import Optional, List
from datetime import datetime
from sqlalchemy import PrimaryKeyConstraint, select, func, cast, Date
from sqlalchemy.sql import Select
from models import Base
from sqlalchemy.orm import Mapped, mapped_column, Session


class LinkInteractionMapper(Base):
    id: Mapped[int] = mapped_column(autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, index=True)
    link_id: Mapped[int] = mapped_column(index=True)
    shortcode: Mapped[str] = mapped_column(index=True)
    original_url: Mapped[str] = mapped_column(index=True)
    generated_url: Mapped[str] = mapped_column(index=True)
    campaign: Mapped[Optional[str]] = mapped_column(index=True)
    source: Mapped[Optional[str]] = mapped_column(index=True)
    medium: Mapped[Optional[str]] = mapped_column(index=True)
    browser: Mapped[Optional[str]] = mapped_column(index=True)
    operating_system: Mapped[Optional[str]] = mapped_column(index=True)
    device: Mapped[Optional[str]] = mapped_column(index=True)
    domain: Mapped[Optional[str]] = mapped_column(index=True)
    continent: Mapped[Optional[str]] = mapped_column(index=True)
    country: Mapped[Optional[str]] = mapped_column(index=True)
    region: Mapped[Optional[str]] = mapped_column(index=True)
    city: Mapped[Optional[str]] = mapped_column(index=True)
    user_id: Mapped[int] = mapped_column(index=True)
    __table_args__ = (PrimaryKeyConstraint("id", "created_at"),)

    @classmethod
    def _build_where_clause(
        cls,
        query: Select,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ) -> Select:
        query = query.where(cls.user_id == user_id)
        if link_id:
            query = query.where(cls.link_id == link_id)
        if start_date:
            query = query.where(cls.created_at >= start_date)
        if end_date:
            query = query.where(cls.created_at <= end_date)
        return query

    @classmethod
    def _base_group_by_clause(cls, query: Select) -> Select:
        query = query.order_by(func.count().desc())
        return query

    @classmethod
    def _execute_query(cls, session: Session, query: Select) -> List[dict]:
        return [dict(row._mapping) for row in session.execute(query).all()]

    @classmethod
    def get_total_clicks(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(func.count(cls.id))
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        return session.execute(query).scalar_one()

    @classmethod
    def get_distinct_total_links(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(func.count(cls.link_id.distinct().label("active_links")))
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        return session.execute(query).scalar_one()

    @classmethod
    def get_top_performing_links(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            cls.link_id,
            cls.shortcode,
            cls.original_url,
            cls.campaign,
            cls.generated_url,
            func.count().label("click_count"),
        ).group_by(
            cls.link_id,
            cls.shortcode,
            cls.original_url,
            cls.campaign,
            cls.generated_url,
        )
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_total_clicks_per_day(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            cast(cls.created_at, Date).label("date"), func.count().label("click_count")
        )
        query = query.group_by(cast(cls.created_at, Date)).order_by(
            cast(cls.created_at, Date)
        )
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        return cls._execute_query(session, query)

    @classmethod
    def get_top_referring_campaign(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(cls.campaign, func.count().label("click_count")).group_by(
            cls.campaign
        )
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_top_referring_site(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(cls.domain, func.count().label("click_count")).group_by(
            cls.domain
        )
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_top_devices(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(cls.device, func.count().label("click_count")).group_by(
            cls.device
        )
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_top_browsers(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(cls.browser, func.count().label("click_count")).group_by(
            cls.browser
        )
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_top_operating_systems(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            cls.operating_system, func.count().label("click_count")
        ).group_by(cls.operating_system)
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_geographical_data(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        return {
            "geo_summary": cls.get_geo_summary_data(
                session, user_id, start_date, end_date, link_id
            ),
            "continents": cls.get_continents(
                session, user_id, start_date, end_date, link_id
            ),
            "countries": cls.get_countries(
                session, user_id, start_date, end_date, link_id
            ),
            "regions": cls.get_regions(session, user_id, start_date, end_date, link_id),
            "cities": cls.get_cities(session, user_id, start_date, end_date, link_id),
        }

    @classmethod
    def get_geo_summary_data(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            cls.continent,
            cls.country,
            cls.region,
            func.coalesce(cls.city, "Unknown City").label("city"),
            func.count().label("click_count"),
        ).group_by(cls.continent, cls.country, cls.region, cls.city)
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_continents(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            cls.continent.label("name"), func.count().label("click_count")
        ).group_by(cls.continent)
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_countries(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            cls.country.label("name"), func.count().label("click_count")
        ).group_by(cls.country)
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_regions(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            cls.region.label("name"), func.count().label("click_count")
        ).group_by(cls.region)
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_cities(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            cls.city.label("name"), func.count().label("click_count")
        ).group_by(cls.city)
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        query = cls._base_group_by_clause(query)
        return cls._execute_query(session, query)

    @classmethod
    def get_monthly_click_trend(
        cls,
        session: Session,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        link_id: int | None = None,
    ):
        query = select(
            func.date_trunc("month", cls.created_at).label("month"),
            func.count().label("click_count"),
        )
        query = query.group_by(func.date_trunc("month", cls.created_at)).order_by(
            func.date_trunc("month", cls.created_at)
        )
        query = cls._build_where_clause(query, user_id, start_date, end_date, link_id)
        return cls._execute_query(session, query)
