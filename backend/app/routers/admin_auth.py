from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.rate_limit import limiter
from app.schemas import LoginRequest
from app.security import (
    clear_session_cookie,
    issue_session_cookie,
    require_admin,
    verify_admin_credentials,
)

router = APIRouter(prefix="/api/admin", tags=["admin-auth"])


@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, body: LoginRequest, response: Response):
    if not verify_admin_credentials(body.username, body.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    issue_session_cookie(response)
    return {"ok": True}


@router.post("/logout")
def logout(response: Response, _: None = Depends(require_admin)):
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/me")
def me(_: None = Depends(require_admin)):
    return {"ok": True}
