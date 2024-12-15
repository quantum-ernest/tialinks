from typing import Optional

from pydantic import BaseModel, AnyUrl


class RefererSchemaOut(BaseModel):
    id: int
    full_url: Optional[AnyUrl] = None
    domain: Optional[str] = None
    path: Optional[str] = None
