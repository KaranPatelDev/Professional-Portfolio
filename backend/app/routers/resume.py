from fastapi import APIRouter, Depends, File, Request, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.cloudinary_client import upload_file
from app.database import get_db
from app.models import Resume, ResumeDownloadEvent
from app.schemas import ResumeDownloadEventOut, ResumeDownloadTrack, ResumeOut
from app.security import require_admin

router = APIRouter(prefix="/api/resume", tags=["resume"])


def _get_or_create(db: Session) -> Resume:
    row = db.scalar(select(Resume).limit(1))
    if not row:
        row = Resume()
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("", response_model=ResumeOut)
def get_resume(db: Session = Depends(get_db)):
    return _get_or_create(db)


@router.post("/track", response_model=ResumeOut)
def track_download(body: ResumeDownloadTrack, request: Request, db: Session = Depends(get_db)):
    row = _get_or_create(db)
    row.download_count += 1
    db.add(
        ResumeDownloadEvent(
            referrer=body.referrer,
            user_agent=request.headers.get("user-agent"),
        )
    )
    db.commit()
    db.refresh(row)
    return row


@router.get("/downloads", response_model=list[ResumeDownloadEventOut], dependencies=[Depends(require_admin)])
def list_downloads(db: Session = Depends(get_db)):
    return db.scalars(select(ResumeDownloadEvent).order_by(ResumeDownloadEvent.created_at.desc())).all()


@router.put("/upload", response_model=ResumeOut, dependencies=[Depends(require_admin)])
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    url = upload_file(contents, folder="portfolio/resume", resource_type="raw", format="pdf")
    row = _get_or_create(db)
    row.file_url = url
    db.commit()
    db.refresh(row)
    return row
