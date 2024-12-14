from models import Base
from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Mapped, Session, mapped_column, relationship


class UserMapper(Base):
    email: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str | None]

    link: Mapped["LinkMapper"] = relationship(back_populates="user")
    click: Mapped["ClickMapper"] = relationship(back_populates="user")

    @classmethod
    def get_by_email(cls, session: Session, email: EmailStr):
        return session.scalars(select(cls).where(cls.email == email)).first()
