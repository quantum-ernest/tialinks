from typing import Optional

from pydantic import BaseModel


class UserAgentSchemaOut(BaseModel):
    id: int
    user_agent: Optional[str] = None
    browser: Optional[str] = None
    operating_system: Optional[str] = None
    device: Optional[str] = None
