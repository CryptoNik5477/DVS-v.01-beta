"""API dependencies: optional bearer-token auth for the dashboard API.

If DASHBOARD_API_TOKEN is unset (local dev), auth is disabled. When set (online
deployment), every request must send `Authorization: Bearer <token>`.
"""
from __future__ import annotations

from fastapi import Header, HTTPException, status

from ..config import settings


async def require_token(authorization: str | None = Header(default=None)) -> None:
    if not settings.dashboard_api_token:
        return  # auth disabled locally
    expected = f"Bearer {settings.dashboard_api_token}"
    if authorization != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API token",
        )
