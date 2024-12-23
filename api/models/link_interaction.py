from typing import Optional
from datetime import datetime

from sqlalchemy import PrimaryKeyConstraint

from models import Base
from sqlalchemy.orm import Mapped, mapped_column


class LinkInteractionMapper(Base):
    id: Mapped[int] = mapped_column(autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, index=True)
    link_id: Mapped[int] = mapped_column(index=True)
    shortcode: Mapped[str] = mapped_column(index=True)
    original_url: Mapped[str]
    campaign: Mapped[Optional[str]]
    source: Mapped[Optional[str]]
    medium: Mapped[Optional[str]]
    browser: Mapped[Optional[str]]
    operating_system: Mapped[Optional[str]]
    device: Mapped[Optional[str]]
    domain: Mapped[Optional[str]] = mapped_column(index=True)
    path: Mapped[Optional[str]]
    continent: Mapped[Optional[str]]
    country: Mapped[Optional[str]] = mapped_column(index=True)
    region: Mapped[Optional[str]]
    city: Mapped[Optional[str]]
    user_id: Mapped[int] = mapped_column(index=True)
    __table_args__ = (PrimaryKeyConstraint("id", "created_at"),)
