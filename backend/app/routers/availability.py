from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Availability
from app.schemas import AvailabilityOut, AvailabilityUpdate
from app.security import require_admin

router = APIRouter(prefix="/api/availability", tags=["availability"])


def _get_or_create(db: Session) -> Availability:
    row = db.scalar(select(Availability).limit(1))
    if not row:
        row = Availability()
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("", response_model=AvailabilityOut)
def get_availability(db: Session = Depends(get_db)):
    return _get_or_create(db)


@router.put("", response_model=AvailabilityOut, dependencies=[Depends(require_admin)])
def update_availability(body: AvailabilityUpdate, db: Session = Depends(get_db)):
    row = _get_or_create(db)
    row.status_text = body.status_text
    db.commit()
    db.refresh(row)
    return row
