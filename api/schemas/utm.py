from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from schemas import UserSchemaOut


class UtmSchema(BaseModel):
    campaign: str
    source: Optional[str] = None
    medium: Optional[str] = None


class UtmSchemaOut(UtmSchema):
    id: int
    user: UserSchemaOut
    link_count: int
    created_at: datetime


class UtmLinkSchemaOut(UtmSchema):
    id: int
    created_at: datetime
