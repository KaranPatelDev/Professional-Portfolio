from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas import StatusOut

router = APIRouter(prefix="/api/status", tags=["status"])

_STARTED_AT = datetime.now(timezone.utc)


@router.get("", response_model=StatusOut)
def get_status():
    now = datetime.now(timezone.utc)
    return StatusOut(
        status="operational",
        started_at=_STARTED_AT,
        uptime_seconds=int((now - _STARTED_AT).total_seconds()),
    )
