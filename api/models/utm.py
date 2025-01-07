from sqlalchemy.util import hybridproperty

from models import Base
from sqlalchemy import ForeignKey, select, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, Session, relationship
from typing import Optional, List


class UtmMapper(Base):
    campaign: Mapped[str]
    source: Mapped[str]
    medium: Mapped[Optional[str]]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="cascade"))
    user: Mapped["UserMapper"] = relationship(back_populates="utm")
    link: Mapped[List["LinkMapper"]] = relationship(back_populates="utm")

    __table_args__ = (UniqueConstraint("campaign", "source", "user_id"),)

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
    def validate_utm(
        cls, session: Session, campaign: str, source: str, medium: str, user_id: int
    ):
        query = select(cls).where(
            cls.campaign == campaign, cls.source == source, cls.user_id == user_id
        )
        if medium:
            query = query.where(cls.medium == medium)
        return session.scalars(query).first()
