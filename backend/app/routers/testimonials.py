from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Testimonial
from app.schemas import TestimonialBase, TestimonialOut
from app.security import require_admin

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])


@router.get("", response_model=list[TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    # public callers only ever need permission_granted=true ones
    return db.scalars(select(Testimonial).where(Testimonial.permission_granted.is_(True))).all()


@router.get("/all", response_model=list[TestimonialOut], dependencies=[Depends(require_admin)])
def list_all_testimonials(db: Session = Depends(get_db)):
    return db.scalars(select(Testimonial)).all()


@router.post("", response_model=TestimonialOut, dependencies=[Depends(require_admin)])
def create_testimonial(body: TestimonialBase, db: Session = Depends(get_db)):
    entry = Testimonial(**body.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/{testimonial_id}", response_model=TestimonialOut, dependencies=[Depends(require_admin)])
def update_testimonial(testimonial_id: int, body: TestimonialBase, db: Session = Depends(get_db)):
    entry = db.get(Testimonial, testimonial_id)
    if not entry:
        raise HTTPException(404, "Testimonial not found")
    for field, value in body.model_dump().items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{testimonial_id}", dependencies=[Depends(require_admin)])
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    entry = db.get(Testimonial, testimonial_id)
    if not entry:
        raise HTTPException(404, "Testimonial not found")
    db.delete(entry)
    db.commit()
    return {"ok": True}
