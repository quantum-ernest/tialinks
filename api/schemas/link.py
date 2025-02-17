from datetime import datetime

from pydantic import BaseModel, AnyUrl
from typing import Optional
from schemas import UserSchemaOut, UtmLinkSchemaOut



class LinkSchemaIn(BaseModel):
    original_url: AnyUrl
    utm_id: Optional[int] = None
    expires_at: Optional[datetime] = None


class LinkSchemaUpdate(BaseModel):
    utm_id: Optional[int] = None
    expires_at: Optional[datetime] = None


class LinkSchemaOut(BaseModel):
    original_url: AnyUrl
    utm_id: Optional[int] = None
    expires_at: Optional[datetime] = None
    generated_url: str
    shortcode: str
    count: int
    utm: Optional[UtmLinkSchemaOut] = None
    user: UserSchemaOut
    created_at: datetime
    favicon_url: str
    status: Optional[str] = None
    password_protected: bool
    id: int


class SetPasswordSchema(BaseModel):
    password: Optional[str] = None
    id: int
