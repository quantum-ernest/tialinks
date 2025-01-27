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
    def create_from_link(cls, session: Session, **kwargs):
        ip_address = kwargs.get("ip_address")
        location_data = extract_location(ip_address)
        record = session.scalars(
            select(cls).filter_by(
                continent=location_data["continent"],
                country=location_data["country"],
                region=location_data["region"],
                city=location_data["city"],
            )
        ).first()
        return (
            record
            if record
            else session.scalars(insert(cls).returning(cls), location_data).first()
        )
