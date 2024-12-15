from pydantic import BaseModel

from schemas import (
    UserSchemaOut,
    UserAgentSchemaOut,
    RefererSchemaOut,
    LocationSchemaOut,
)


class ClickSchemaOut(BaseModel):
    id: int
    user: UserSchemaOut
    user_agent: UserAgentSchemaOut
    referrer: RefererSchemaOut
    location: LocationSchemaOut
