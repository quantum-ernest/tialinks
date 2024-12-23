from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core import get_db_session
from services import IsAuthenticated

router = APIRouter(prefix="/api/analysis", tags=["ANALYSIS"])


@router.get("")
async def get(
    session: Session = Depends(get_db_session),
    auth_user: dict = Depends(IsAuthenticated()),
):
    return "Analysis Endpoint"
