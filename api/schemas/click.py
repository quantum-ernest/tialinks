from typing import Optional

from pydantic import BaseModel

from schemas import (
    UserSchemaOut,
    UserAgentSchemaOut,
    RefererSchemaOut,
    LocationSchemaOut,
)


class ClickSchemaOut(BaseModel):
    id: int
    user: Optional[UserSchemaOut] = None
    user_agent: Optional[UserAgentSchemaOut] = None
    referer: Optional[RefererSchemaOut] = None
    location: Optional[LocationSchemaOut] = None
