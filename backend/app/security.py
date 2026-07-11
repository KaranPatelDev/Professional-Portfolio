import secrets

import nh3
from fastapi import Cookie, HTTPException, Response, status
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.config import settings

SESSION_COOKIE = "admin_session"
SESSION_MAX_AGE = 60 * 60 * 12  # 12 hours

_serializer = URLSafeTimedSerializer(settings.session_secret, salt="admin-session")

ALLOWED_TAGS = {"p", "b", "strong", "i", "em", "a", "ul", "ol", "li", "h1", "h2", "h3", "h4", "br", "img", "blockquote", "code", "pre"}
ALLOWED_ATTRS = {"a": {"href", "target", "rel"}, "img": {"src", "alt"}}


def sanitize_html(raw_html: str) -> str:
    return nh3.clean(raw_html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS)


def verify_admin_credentials(username: str, password: str) -> bool:
    valid_user = secrets.compare_digest(username, settings.admin_username)
    valid_pass = secrets.compare_digest(password, settings.admin_password)
    return valid_user and valid_pass


def issue_session_cookie(response: Response) -> None:
    # samesite="none" is required because the admin panel (Next.js) and this API
    # live on different domains — the browser treats admin fetch calls as cross-site.
    token = _serializer.dumps({"user": settings.admin_username})
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        max_age=SESSION_MAX_AGE,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(SESSION_COOKIE, path="/")


def require_admin(admin_session: str | None = Cookie(default=None)) -> None:
    if not admin_session:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        _serializer.loads(admin_session, max_age=SESSION_MAX_AGE)
    except (BadSignature, SignatureExpired) as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session expired") from exc
