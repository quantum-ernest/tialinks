from models import Base
from sqlalchemy import ForeignKey, select
from sqlalchemy.orm import Mapped, Session, mapped_column, relationship
from typing import Optional


class LinkMapper(Base):
    original_url: Mapped[str]
    shortcode: Mapped[str] = mapped_column(unique=True)
    count: Mapped[int] = mapped_column(default=0)
    utm_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("utm.id", ondelete="SET NULL")
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="SET NULL"),
    )

    user: Mapped["UserMapper"] = relationship(back_populates="link")
    click: Mapped["ClickMapper"] = relationship(back_populates="link")
    utm: Mapped["UtmMapper"] = relationship(back_populates="link")

    @classmethod
    def get_all(cls, session: Session, user_id: int):
        return session.scalars(
            select(cls).where(cls.user_id == user_id).order_by(cls.id.desc())
        ).all()

    @classmethod
    def get_by_shortcode(cls, session: Session, shortcode: str):
        return session.scalars(select(cls).where(cls.shortcode == shortcode)).first()

    @classmethod
    def validate_shortcode(cls, session: Session, shortcode: str) -> bool:
        record = session.scalars(select(cls).where(cls.shortcode == shortcode)).all()
        return True if record else False
