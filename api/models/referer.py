from models import Base
from sqlalchemy import insert, select
from sqlalchemy.orm import Mapped, Session, relationship
from utils import extract_referer


class RefererMapper(Base):
    full_url: Mapped[str | None]
    domain: Mapped[str | None]
    path: Mapped[str | None]

    click: Mapped["ClickMapper"] = relationship(back_populates="referer")

    @classmethod
    def create(cls, session: Session, **kwargs):
        referer = kwargs.get("referer")
        referer_data = extract_referer(referer)
        query = select(cls)
        if referer_data.get("domain"):
            query = query.filter_by(domain=referer_data["domain"])
        if referer_data.get("path"):
            query = query.filter_by(path=referer_data["path"])
        record = session.scalars(query).first()
        return (
            record
            if record
            else session.scalars(insert(cls).returning(cls), referer_data).first()
        )
