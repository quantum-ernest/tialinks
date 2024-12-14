from typing import Optional

from models import Base
from sqlalchemy import insert, select
from sqlalchemy.orm import Mapped, Session, relationship
from utils import extract_location


class LocationMapper(Base):
    continent: Mapped[Optional[str]]
    country: Mapped[Optional[str]]
    region: Mapped[Optional[str]]
    city: Mapped[Optional[str]]

    click: Mapped["ClickMapper"] = relationship(back_populates="location")

    @classmethod
    def create(cls, session: Session, **kwargs):
        ip_address = kwargs.get("ip_address")
        location_data = extract_location(ip_address)
        query = select(cls)
        if location_data.get("continent"):
            query = query.filter_by(continent=location_data["continent"])
        if location_data.get("country"):
            query = query.filter_by(country=location_data["country"])
        if location_data.get("region"):
            query = query.filter_by(region=location_data["region"])
        if location_data.get("city"):
            query = query.filter_by(city=location_data["city"])
        record = session.scalars(query).first()
        return (
            record.id
            if record
            else session.scalars(insert(cls).returning(cls.id), location_data).first()
        )
