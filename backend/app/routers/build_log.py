from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.github_client import fetch_commits
from app.models import BuildLogPost
from app.schemas import BuildLogPostBase, BuildLogPostOut, GitCommitOut
from app.security import require_admin, sanitize_html

router = APIRouter(prefix="/api/build-log", tags=["build-log"])


@router.get("", response_model=list[BuildLogPostOut])
def list_posts(db: Session = Depends(get_db)):
    return db.scalars(
        select(BuildLogPost).where(BuildLogPost.published.is_(True)).order_by(BuildLogPost.published_at.desc())
    ).all()


@router.get("/all", response_model=list[BuildLogPostOut], dependencies=[Depends(require_admin)])
def list_all_posts(db: Session = Depends(get_db)):
    return db.scalars(select(BuildLogPost).order_by(BuildLogPost.published_at.desc())).all()


@router.get("/{slug}", response_model=BuildLogPostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.scalar(select(BuildLogPost).where(BuildLogPost.slug == slug))
    if not post:
        raise HTTPException(404, "Post not found")
    return post


@router.get("/{slug}/commits", response_model=list[GitCommitOut])
def get_commits(slug: str, db: Session = Depends(get_db)):
    post = db.scalar(select(BuildLogPost).where(BuildLogPost.slug == slug))
    if not post:
        raise HTTPException(404, "Post not found")
    if not post.github_repo:
        return []
    return fetch_commits(post.github_repo)


@router.post("", response_model=BuildLogPostOut, dependencies=[Depends(require_admin)])
def create_post(body: BuildLogPostBase, db: Session = Depends(get_db)):
    data = body.model_dump()
    data["body_html"] = sanitize_html(data["body_html"])
    post = BuildLogPost(**data)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/{post_id}", response_model=BuildLogPostOut, dependencies=[Depends(require_admin)])
def update_post(post_id: int, body: BuildLogPostBase, db: Session = Depends(get_db)):
    post = db.get(BuildLogPost, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    data = body.model_dump()
    data["body_html"] = sanitize_html(data["body_html"])
    for field, value in data.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", dependencies=[Depends(require_admin)])
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.get(BuildLogPost, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    db.delete(post)
    db.commit()
    return {"ok": True}
