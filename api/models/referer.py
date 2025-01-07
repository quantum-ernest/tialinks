from typing import Optional

from models import Base
from sqlalchemy import insert, select
from sqlalchemy.orm import Mapped, Session, relationship
from utils import extract_referer


class RefererMapper(Base):
    full_url: Mapped[Optional[str]]
    domain: Mapped[Optional[str]]

    click: Mapped["ClickMapper"] = relationship(back_populates="referer")

    @classmethod
    def create(cls, session: Session, **kwargs):
        referer = kwargs.get("referer")
        referer_data = extract_referer(referer)
        record = session.scalars(
            select(cls).filter_by(domain=referer_data["domain"])
        ).first()
        return (
            record
            if record
            else session.scalars(insert(cls).returning(cls), referer_data).first()
        )
