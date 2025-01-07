from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core import get_db_session
from models import UtmMapper
from schemas import UtmSchemaOut, UtmSchema
from services import IsAuthenticated

router = APIRouter(prefix="/api/utms", tags=["UTM"])


@router.get("", response_model=List[UtmSchemaOut])
async def get(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    return UtmMapper.get_all(session=session, user_id=auth_user.get("user_id"))


@router.post("", response_model=UtmSchemaOut)
async def create(
    data: UtmSchema,
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    data = data.model_dump()
    data.update({"user_id": auth_user.get("user_id")})
    return UtmMapper.create(session=session, data=data)


@router.put("/{id}", response_model=UtmSchemaOut)
async def update(
    id: int,
    data: UtmSchema,
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    utm = UtmMapper.get_by_id(
        session=session, pk_id=id, user_id=auth_user.get("user_id")
    )
    if not utm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Utm not found"
        )
    data = data.model_dump()
    data.update({"id": id, "user_id": auth_user.get("user_id")})
    return UtmMapper.update(session=session, data=data)
