from datetime import datetime

from pydantic import BaseModel, AnyUrl
from typing import Optional
from schemas import UserSchemaOut, UtmLinkSchemaOut


class LinkSchemaIn(BaseModel):
    original_url: AnyUrl


class LinkSchemaUpdate(BaseModel):
    utm_id: Optional[int] = None
    expires_at: Optional[datetime] = None


class LinkSchemaOut(LinkSchemaIn):
    generated_url: str
    shortcode: str
    count: int
    utm: Optional[UtmLinkSchemaOut] = None
    expires_at: Optional[datetime] = None
    user: UserSchemaOut
    created_at: datetime
    id: int
