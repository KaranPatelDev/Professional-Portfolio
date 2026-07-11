from slowapi import Limiter
from slowapi.util import get_remote_address

# headers_enabled exposes X-RateLimit-Limit/Remaining/Reset on every
# rate-limited response — the "break my rate limiter" demo widget reads
# these to show a live countdown, not just a bare 429.
limiter = Limiter(key_func=get_remote_address, headers_enabled=True)
