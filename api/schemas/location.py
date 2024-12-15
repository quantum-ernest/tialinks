from pydantic import BaseModel
from typing import Optional


class LocationSchemaOut(BaseModel):
    id: int
    continent: Optional[str] = None
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
