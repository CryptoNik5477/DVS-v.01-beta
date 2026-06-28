"""SQLAlchemy ORM models — the persisted domain for Phase 1.

Sources are *always* kept alongside every signal so they remain clickable and
auditable, per the spec.
"""
from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(primary_key=True)
    symbol: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(128))
    # crypto | stock | commodity
    kind: Mapped[str] = mapped_column(String(16), index=True)
    # Provider-specific identifier (e.g. CoinGecko id "bitcoin", or "XAU/USD").
    provider: Mapped[str] = mapped_column(String(32))
    provider_id: Mapped[str] = mapped_column(String(64))
    quote_currency: Mapped[str] = mapped_column(String(8), default="usd")
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    snapshots: Mapped[list["PriceSnapshot"]] = relationship(
        back_populates="asset", cascade="all, delete-orphan"
    )


class PriceSnapshot(Base):
    """Short price history used to detect abnormal volatility/volume moves."""

    __tablename__ = "price_snapshots"
    __table_args__ = (Index("ix_snapshot_asset_ts", "asset_id", "ts"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), index=True)
    price: Mapped[float] = mapped_column(Float)
    change_24h_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    volume_24h: Mapped[float | None] = mapped_column(Float, nullable=True)
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, index=True)

    asset: Mapped[Asset] = relationship(back_populates="snapshots")


class Signal(Base):
    """A structured, market-moving signal extracted by an agent from a source."""

    __tablename__ = "signals"
    __table_args__ = (
        # Dedup: one signal per source URL per agent.
        UniqueConstraint("agent", "source_url", name="uq_signal_agent_url"),
        Index("ix_signal_symbol_created", "asset_symbol", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    agent: Mapped[str] = mapped_column(String(32), index=True)
    asset_symbol: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    # bullish | bearish | neutral
    direction: Mapped[str] = mapped_column(String(8), default="neutral")
    intensity: Mapped[int] = mapped_column(Integer, default=1)  # 1..5
    confidence: Mapped[float] = mapped_column(Float, default=0.0)  # 0..1
    summary: Mapped[str] = mapped_column(Text)
    source_url: Mapped[str] = mapped_column(Text)
    source_title: Mapped[str | None] = mapped_column(Text, nullable=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, index=True)


class Alert(Base):
    """A dispatched (or attempted) alert, with the signals that triggered it."""

    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True)
    asset_symbol: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    direction: Mapped[str] = mapped_column(String(8), default="neutral")
    score: Mapped[float] = mapped_column(Float, default=0.0)
    summary: Mapped[str] = mapped_column(Text)
    # Comma-separated signal ids that motivated this alert (audit trail).
    signal_ids: Mapped[str] = mapped_column(Text, default="")
    channel: Mapped[str] = mapped_column(String(16), default="telegram")
    delivered: Mapped[bool] = mapped_column(Boolean, default=False)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, index=True)


class LlmCostLog(Base):
    """Per-call token + estimated USD cost, aggregated for the Costs page."""

    __tablename__ = "llm_cost_logs"
    __table_args__ = (Index("ix_cost_agent_ts", "agent", "ts"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    agent: Mapped[str] = mapped_column(String(32), index=True)
    model: Mapped[str] = mapped_column(String(48))
    input_tokens: Mapped[int] = mapped_column(Integer, default=0)
    cache_read_tokens: Mapped[int] = mapped_column(Integer, default=0)
    cache_write_tokens: Mapped[int] = mapped_column(Integer, default=0)
    output_tokens: Mapped[int] = mapped_column(Integer, default=0)
    cost_usd: Mapped[float] = mapped_column(Float, default=0.0)
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, index=True)
