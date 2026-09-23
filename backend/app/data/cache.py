"""
Simple in-memory cache with a time-to-live (TTL). Used to avoid re-fetching
live data from FRED/Yahoo Finance on every single request — data is refreshed
at most every CACHE_TTL_SECONDS, keeping things fast while still genuinely live.
"""

import time
from functools import wraps

CACHE_TTL_SECONDS = 15 * 60  # 15 minutes

_cache_store: dict[str, tuple[float, any]] = {}


def cached(key: str, ttl_seconds: int = CACHE_TTL_SECONDS):
    """Decorator: caches a function's return value under `key` for ttl_seconds."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()

            if key in _cache_store:
                cached_at, cached_value = _cache_store[key]
                if now - cached_at < ttl_seconds:
                    return cached_value

            fresh_value = func(*args, **kwargs)

            if fresh_value:
                _cache_store[key] = (now, fresh_value)

            return fresh_value

        return wrapper
    return decorator


def clear_cache():
    """Useful for testing, or if you want to force a fresh fetch on demand."""
    _cache_store.clear()


def cache_status() -> dict:
    """Returns how old each cached entry is, in seconds — useful for debugging."""
    now = time.time()
    return {
        k: round(now - cached_at, 1)
        for k, (cached_at, _) in _cache_store.items()
    }