from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Availability, Experience, Project, SiteContent
from app.schemas import WhoamiOut
from app.text_utils import strip_html

router = APIRouter(prefix="/api/whoami", tags=["whoami"])


def _compute_tenure(start_date: str) -> str | None:
    try:
        start = datetime.strptime(start_date.strip(), "%b %Y")
    except ValueError:
        return None
    now = datetime.now()
    months = (now.year - start.year) * 12 + (now.month - start.month)
    if months < 1:
        return "just started"
    if months < 12:
        return f"{months} month{'s' if months != 1 else ''}"
    years, rem_months = divmod(months, 12)
    if rem_months == 0:
        return f"{years} year{'s' if years != 1 else ''}"
    return f"{years} year{'s' if years != 1 else ''} {rem_months} month{'s' if rem_months != 1 else ''}"


@router.get("", response_model=WhoamiOut)
def whoami(db: Session = Depends(get_db)):
    experience = db.scalar(select(Experience).order_by(Experience.display_order).limit(1))
    availability = db.scalar(select(Availability).limit(1))
    core_stack_block = db.scalar(select(SiteContent).where(SiteContent.key == "core_stack"))
    projects = db.scalars(select(Project).where(Project.hidden.is_(False))).all()

    core_stack = []
    if core_stack_block:
        core_stack = [s.strip() for s in strip_html(core_stack_block.value_html).split(",") if s.strip()]

    return WhoamiOut(
        name="Karan Patel",
        role=experience.role if experience else None,
        company=experience.company if experience else None,
        availability_status=availability.status_text if availability else "Status unavailable",
        core_stack=core_stack,
        tenure=_compute_tenure(experience.start_date) if experience else None,
        project_count=len(projects),
        client_project_count=len([p for p in projects if p.tags == "client_work"]),
        live_project_count=len([p for p in projects if p.status == "live"]),
    )
