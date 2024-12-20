from datetime import datetime

from pydantic import BaseModel, AnyUrl
from typing import Optional
from schemas import UserSchemaOut, UtmLinkSchemaOut


class LinkSchemaIn(BaseModel):
    original_url: AnyUrl


class LinkSchemaOut(LinkSchemaIn):
    shortcode: str
    count: int
    utm: Optional[UtmLinkSchemaOut] = None
    user: UserSchemaOut
    created_at: datetime
    id: int
