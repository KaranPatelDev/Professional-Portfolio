import time

import httpx
from fastapi import HTTPException

# Simple in-memory TTL cache — avoids hammering GitHub's unauthenticated rate
# limit (60 req/hour/IP) on every page load. Fine at this traffic scale;
# swap for Redis if this ever needs to survive across multiple backend workers.
_CACHE: dict[str, tuple[float, list[dict]]] = {}
_CACHE_TTL_SECONDS = 15 * 60


def fetch_commits(repo: str, limit: int = 10) -> list[dict]:
    now = time.time()
    cached = _CACHE.get(repo)
    if cached and now - cached[0] < _CACHE_TTL_SECONDS:
        return cached[1]

    try:
        resp = httpx.get(
            f"https://api.github.com/repos/{repo}/commits",
            params={"per_page": limit},
            headers={"Accept": "application/vnd.github+json"},
            timeout=8.0,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(502, "Could not reach GitHub") from exc

    if resp.status_code == 404:
        raise HTTPException(404, f"GitHub repo '{repo}' not found or private")
    if resp.status_code != 200:
        raise HTTPException(502, "GitHub API error")

    commits = [
        {
            "sha": c["sha"][:7],
            "message": c["commit"]["message"].split("\n", 1)[0],
            "author": c["commit"]["author"]["name"],
            "date": c["commit"]["author"]["date"],
            "url": c["html_url"],
        }
        for c in resp.json()
    ]
    _CACHE[repo] = (now, commits)
    return commits
