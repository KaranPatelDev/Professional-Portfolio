from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.config import settings
from app.database import Base, engine
from app.rate_limit import limiter
from app.routers import (
    admin_auth,
    availability,
    build_log,
    contact,
    content,
    experience,
    media,
    projects,
    resume,
    services,
    status,
    testimonials,
    whoami,
)

app = FastAPI(title="Karan Patel Portfolio API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health():
    return {"ok": True}


app.include_router(admin_auth.router)
app.include_router(projects.router)
app.include_router(experience.router)
app.include_router(testimonials.router)
app.include_router(services.router)
app.include_router(content.router)
app.include_router(availability.router)
app.include_router(resume.router)
app.include_router(contact.router)
app.include_router(media.router)
app.include_router(build_log.router)
app.include_router(whoami.router)
app.include_router(status.router)
