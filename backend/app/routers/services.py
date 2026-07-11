from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Service
from app.rate_limit import limiter
from app.schemas import ServiceBase, ServiceOut
from app.security import require_admin

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=list[ServiceOut])
@limiter.limit("30/minute")
def list_services(request: Request, response: Response, db: Session = Depends(get_db)):
    return db.scalars(
        select(Service).where(Service.public.is_(True)).order_by(Service.display_order, Service.id)
    ).all()


@router.get("/all", response_model=list[ServiceOut], dependencies=[Depends(require_admin)])
def list_all_services(db: Session = Depends(get_db)):
    return db.scalars(select(Service).order_by(Service.display_order, Service.id)).all()


@router.post("", response_model=ServiceOut, dependencies=[Depends(require_admin)])
def create_service(body: ServiceBase, db: Session = Depends(get_db)):
    entry = Service(**body.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/{service_id}", response_model=ServiceOut, dependencies=[Depends(require_admin)])
def update_service(service_id: int, body: ServiceBase, db: Session = Depends(get_db)):
    entry = db.get(Service, service_id)
    if not entry:
        raise HTTPException(404, "Service not found")
    for field, value in body.model_dump().items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{service_id}", dependencies=[Depends(require_admin)])
def delete_service(service_id: int, db: Session = Depends(get_db)):
    entry = db.get(Service, service_id)
    if not entry:
        raise HTTPException(404, "Service not found")
    db.delete(entry)
    db.commit()
    return {"ok": True}
