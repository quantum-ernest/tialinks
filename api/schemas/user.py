from pydantic import BaseModel, EmailStr
from typing import Optional


class UserSchemaIn(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserSchemaOut(UserSchemaIn):
    id: int


class UserUpdateSchema(BaseModel):
    name: str
