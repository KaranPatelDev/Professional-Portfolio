from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Experience
from app.rate_limit import limiter
from app.schemas import ExperienceBase, ExperienceOut
from app.security import require_admin, sanitize_html

router = APIRouter(prefix="/api/experience", tags=["experience"])


@router.get("", response_model=list[ExperienceOut])
@limiter.limit("30/minute")
def list_experience(request: Request, db: Session = Depends(get_db)):
    return db.scalars(select(Experience).order_by(Experience.display_order, Experience.id)).all()


@router.post("", response_model=ExperienceOut, dependencies=[Depends(require_admin)])
def create_experience(body: ExperienceBase, db: Session = Depends(get_db)):
    data = body.model_dump()
    if data.get("body_html"):
        data["body_html"] = sanitize_html(data["body_html"])
    entry = Experience(**data)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/{entry_id}", response_model=ExperienceOut, dependencies=[Depends(require_admin)])
def update_experience(entry_id: int, body: ExperienceBase, db: Session = Depends(get_db)):
    entry = db.get(Experience, entry_id)
    if not entry:
        raise HTTPException(404, "Experience entry not found")
    data = body.model_dump()
    if data.get("body_html"):
        data["body_html"] = sanitize_html(data["body_html"])
    for field, value in data.items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", dependencies=[Depends(require_admin)])
def delete_experience(entry_id: int, db: Session = Depends(get_db)):
    entry = db.get(Experience, entry_id)
    if not entry:
        raise HTTPException(404, "Experience entry not found")
    db.delete(entry)
    db.commit()
    return {"ok": True}
