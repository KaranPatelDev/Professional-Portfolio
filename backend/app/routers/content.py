from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import SiteContent
from app.schemas import SiteContentBase, SiteContentOut
from app.security import require_admin, sanitize_html

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("", response_model=list[SiteContentOut])
def list_content(db: Session = Depends(get_db)):
    return db.scalars(select(SiteContent)).all()


@router.get("/{key}", response_model=SiteContentOut)
def get_content(key: str, db: Session = Depends(get_db)):
    entry = db.scalar(select(SiteContent).where(SiteContent.key == key))
    if not entry:
        raise HTTPException(404, "Content block not found")
    return entry


@router.put("/{key}", response_model=SiteContentOut, dependencies=[Depends(require_admin)])
def upsert_content(key: str, body: SiteContentBase, db: Session = Depends(get_db)):
    entry = db.scalar(select(SiteContent).where(SiteContent.key == key))
    value_html = sanitize_html(body.value_html)
    if entry:
        entry.label = body.label
        entry.value_html = value_html
        entry.page = body.page
    else:
        entry = SiteContent(key=key, label=body.label, value_html=value_html, page=body.page)
        db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
