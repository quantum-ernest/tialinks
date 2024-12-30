from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import IsAuthenticated
from core import get_db_session
from models import UserMapper
from schemas import UserUpdateSchema, UserSchemaOut

router = APIRouter(prefix="/api/users", tags=["USER"])


@router.get("", response_model=UserSchemaOut)
async def get(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    return UserMapper.get_by_id(session=session, pk_id=auth_user.get("user_id"))


@router.put("", response_model=UserSchemaOut)
async def update(
    user: UserUpdateSchema,
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    data = user.model_dump()
    data.update(
        {
            "id": auth_user.get("user_id"),
        }
    )
    return UserMapper.update(session, data=data)
