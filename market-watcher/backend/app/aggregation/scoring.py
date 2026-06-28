"""Per-asset pressure scoring over a sliding window.

Phase 1 keeps this deliberately simple: net pressure is the confidence-weighted,
intensity-weighted sum of directional signals over a recent window. Phase 2 will
add real volume/price corroboration to cut false positives (see README roadmap).
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Signal

_DIR_SIGN = {"bullish": 1.0, "bearish": -1.0, "neutral": 0.0}


@dataclass
class AssetScore:
    symbol: str
    score: float          # signed: >0 bullish pressure, <0 bearish
    signal_count: int
    last_signal_at: datetime | None


async def score_asset(
    session: AsyncSession, symbol: str, window_hours: int = 24
) -> AssetScore:
    since = datetime.now(timezone.utc) - timedelta(hours=window_hours)
    rows = await session.execute(
        select(Signal).where(
            Signal.asset_symbol == symbol, Signal.created_at >= since
        )
    )
    signals = rows.scalars().all()

    score = 0.0
    last_at: datetime | None = None
    for s in signals:
        score += _DIR_SIGN.get(s.direction, 0.0) * s.intensity * s.confidence
        if last_at is None or (s.created_at and s.created_at > last_at):
            last_at = s.created_at

    return AssetScore(
        symbol=symbol,
        score=round(score, 3),
        signal_count=len(signals),
        last_signal_at=last_at,
    )
