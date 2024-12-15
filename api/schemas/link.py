from datetime import datetime

from pydantic import BaseModel, AnyUrl

from schemas import UserSchemaIn


class LinkSchemaIn(BaseModel):
    original_url: AnyUrl


class LinkSchemaOut(LinkSchemaIn):
    shortcode: str
    count: int
    user: UserSchemaIn
    created_at: datetime
    id: int
