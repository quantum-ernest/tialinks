from typing import Optional

from models import Base
from sqlalchemy import insert, select
from sqlalchemy.orm import Mapped, Session, relationship
from utils import extract_user_agent


class UserAgentMapper(Base):
    user_agent: Mapped[Optional[str]]
    browser: Mapped[Optional[str]]
    operating_system: Mapped[Optional[str]]
    device: Mapped[Optional[str]]

    click: Mapped["ClickMapper"] = relationship(back_populates="user_agent")

    @classmethod
    def create(cls, session: Session, **kwargs):
        data = kwargs.get("user_agent")
        user_agent = extract_user_agent(data)
        record = session.scalars(
            select(cls).filter_by(
                browser=user_agent["browser"],
                operating_system=user_agent["operating_system"],
                device=user_agent["device"],
            )
        ).first()
        return (
            record
            if record
            else session.scalars(insert(cls).returning(cls), user_agent).first()
        )
