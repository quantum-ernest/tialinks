from models import Base
from sqlalchemy import insert, select
from sqlalchemy.orm import Mapped, Session, relationship
from utils import extract_user_agent


class UserAgentMapper(Base):
    user_agent: Mapped[str | None]
    browser: Mapped[str | None]
    operating_system: Mapped[str | None]
    device: Mapped[str | None]

    click: Mapped["ClickMapper"] = relationship(back_populates="user_agent")

    @classmethod
    def create(cls, session: Session, **kwargs):
        user_agent_data = kwargs.get("user_agent")
        user_agent = extract_user_agent(user_agent_data)
        query = select(cls)
        if user_agent:
            if user_agent.get("browser"):
                query = query.filter_by(browser=user_agent["browser"])
            if user_agent.get("operating_system"):
                query = query.filter_by(operating_system=user_agent["operating_system"])
            if user_agent.get("device"):
                query = query.filter_by(device=user_agent["device"])
            record = session.scalars(query).first()
            return (
                record.id
                if record
                else session.scalars(insert(cls).returning(cls.id), user_agent).first()
            )
        return None
