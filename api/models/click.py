from models import Base
from sqlalchemy import ForeignKey, select
from sqlalchemy.orm import Mapped, Session, mapped_column, relationship


class ClickMapper(Base):
    link_id: Mapped[int] = mapped_column(ForeignKey("link.id", ondelete="SET NULL"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"))
    user_agent_id: Mapped[int] = mapped_column(
        ForeignKey("user_agent.id", ondelete="SET NULL")
    )
    referer_id: Mapped[int | None] = mapped_column(
        ForeignKey("referer.id", ondelete="SET NULL")
    )
    location_id: Mapped[int] = mapped_column(
        ForeignKey("location.id", ondelete="SET NULL")
    )

    link: Mapped["LinkMapper"] = relationship(back_populates="click")
    user: Mapped["UserMapper"] = relationship(back_populates="click")
    user_agent: Mapped["UserAgentMapper"] = relationship(back_populates="click")
    referer: Mapped["RefererMapper"] = relationship(back_populates="click")
    location: Mapped["LocationMapper"] = relationship(back_populates="click")

    @classmethod
    def get_all(cls, session: Session, user_id: int):
        return session.scalars(
            select(cls).where(cls.user_id == user_id).order_by(cls.id.desc())
        ).all()

    @classmethod
    def get_by_link_id(cls, session: Session, link_id: int, user_id: int):
        return session.scalars(
            select(cls).where(cls.user_id == user_id, cls.link_id == link_id)
        ).all()
