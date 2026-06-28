"""Async SQLAlchemy engine + session factory."""
from __future__ import annotations

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from .config import settings


class Base(DeclarativeBase):
    pass


engine = create_async_engine(settings.database_url, pool_pre_ping=True, future=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency yielding a session."""
    async with SessionLocal() as session:
        yield session


async def init_db() -> None:
    """Create tables if they do not exist (Phase 1 — no migrations yet)."""
    from . import models  # noqa: F401  (ensure models are imported/registered)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
