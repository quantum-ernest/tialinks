from models import Base
from sqlalchemy import insert, select
from sqlalchemy.orm import Mapped, Session, relationship
from utils import extract_location


class LocationMapper(Base):
    continent: Mapped[str | None]
    country: Mapped[str | None]
    region: Mapped[str | None]
    city: Mapped[str | None]

    click: Mapped["ClickMapper"] = relationship(back_populates="location")

    @classmethod
    def create(cls, session: Session, **kwargs):
        ip_address = kwargs.get("ip_address")
        location_data = extract_location(ip_address)
        query = select(cls)
        if location_data:
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
                record
                if record
                else session.scalars(insert(cls).returning(cls), location_data).first()
            )
        return None
