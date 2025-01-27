from sqlalchemy.util import hybridproperty

from models import Base
from sqlalchemy import ForeignKey, select, func, insert
from sqlalchemy.orm import Mapped, mapped_column, Session, relationship
from typing import Optional, List

from utils import extract_utm_data


class UtmMapper(Base):
    campaign: Mapped[str]
    source: Mapped[Optional[str]]
    medium: Mapped[Optional[str]]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="cascade"))
    user: Mapped["UserMapper"] = relationship(back_populates="utm")
    link: Mapped[List["LinkMapper"]] = relationship(back_populates="utm")

    @hybridproperty
    def link_count(self) -> int:
        return len(self.link)

    @classmethod
    def get_total_records(cls, session: Session, user_id: int) -> int:
        return session.scalars(
            select(func.count(cls.id).where(cls.user_id == user_id))
        ).first()

    @classmethod
    def get_by_id(cls, session: Session, pk_id: int, **kwargs):
        user_id = kwargs.get("user_id")
        return session.scalars(
            select(cls).where(cls.id == pk_id, cls.user_id == user_id)
        ).first()

    @classmethod
    def create_from_link(cls, session: Session, **kwargs):
        data = kwargs.get("data")
        user_id = kwargs.get("user_id")
        utm_data = extract_utm_data(data)
        record = session.scalars(
            select(cls).filter_by(
                user_id=user_id,
                campaign=utm_data["campaign"],
                source=utm_data["source"],
                medium=utm_data["medium"],
            )
        ).first()
        utm_data.update({"user_id": user_id})
        return (
            record
            if record
            else session.scalars(insert(cls).returning(cls), utm_data).first()
        )
