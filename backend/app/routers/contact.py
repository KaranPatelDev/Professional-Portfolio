import logging

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.email_client import send_contact_notification
from app.models import ContactRequest
from app.rate_limit import limiter
from app.schemas import ContactCreate, ContactOut
from app.security import require_admin

router = APIRouter(prefix="/api", tags=["contact"])
logger = logging.getLogger(__name__)


@router.post("/contact", response_model=ContactOut)
@limiter.limit("5/minute")
def submit_contact(request: Request, response: Response, body: ContactCreate, db: Session = Depends(get_db)):
    if body.website:
        # honeypot field was filled in — silently pretend success, drop the submission
        raise HTTPException(400, "Invalid submission")

    entry = ContactRequest(
        name=body.name,
        email=body.email,
        message=body.message,
        budget_range=body.budget_range,
        timeline=body.timeline,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    try:
        send_contact_notification(body.name, body.email, body.message, body.budget_range, body.timeline)
    except Exception:
        logger.exception("Failed to send contact notification email")

    return entry


@router.get("/admin/contact-requests", response_model=list[ContactOut], dependencies=[Depends(require_admin)])
def list_contact_requests(db: Session = Depends(get_db)):
    return db.scalars(select(ContactRequest).order_by(ContactRequest.created_at.desc())).all()


@router.delete("/admin/contact-requests/{request_id}", dependencies=[Depends(require_admin)])
def delete_contact_request(request_id: int, db: Session = Depends(get_db)):
    entry = db.get(ContactRequest, request_id)
    if not entry:
        raise HTTPException(404, "Contact request not found")
    db.delete(entry)
    db.commit()
    return {"ok": True}
