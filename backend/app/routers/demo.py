from fastapi import APIRouter, Request, Response

from app.rate_limit import limiter

router = APIRouter(prefix="/api/demo", tags=["demo"])


@router.get("/rate-limit")
@limiter.limit("5/10seconds")
def rate_limit_demo(request: Request, response: Response):
    """Deliberately tight limit — this endpoint exists purely so visitors can
    try to break it and watch the real 429/backoff happen live.

    The `response` param is required (not just unused boilerplate): with
    headers_enabled=True, slowapi injects X-RateLimit-* headers into it —
    omitting the param crashes with "parameter `response` must be an
    instance of starlette.responses.Response" on every allowed request.
    """
    return {"ok": True, "message": "Request allowed ✓"}
