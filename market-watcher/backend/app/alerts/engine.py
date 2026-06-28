"""Phase 1 alert engine.

Basic rule (kept intentionally simple): when a freshly-stored signal for a
watched asset crosses the intensity + confidence thresholds, and we haven't
alerted on that asset within the cooldown window, send a Telegram alert and
log it. Each alert records the signal(s) that triggered it for later auditing.

Phase 2 will require corroboration by a real volume/price move before firing.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from ..config import settings
from ..database import SessionLocal
from ..models import Alert, Signal
from .telegram import send_telegram

logger = logging.getLogger(__name__)


async def evaluate_and_alert() -> int:
    """Scan recent strong signals and dispatch alerts. Returns alerts sent."""
    now = datetime.now(timezone.utc)
    lookback = now - timedelta(minutes=settings.alert_cooldown_minutes)
    sent = 0

    async with SessionLocal() as session:
        # Candidate strong signals from the recent window.
        rows = await session.execute(
            select(Signal)
            .where(
                Signal.created_at >= lookback,
                Signal.intensity >= settings.alert_min_intensity,
                Signal.confidence >= settings.alert_min_confidence,
                Signal.asset_symbol.is_not(None),
                Signal.direction != "neutral",
            )
            .order_by(Signal.created_at.desc())
        )
        signals = rows.scalars().all()

        # One alert per asset per cooldown window.
        seen_assets: set[str] = set()
        for sig in signals:
            symbol = sig.asset_symbol
            if symbol in seen_assets:
                continue
            seen_assets.add(symbol)

            if await self_recently_alerted(session, symbol, lookback):
                continue

            score = round(_DIR_SIGN(sig.direction) * sig.intensity * sig.confidence, 2)
            text = _format_alert(sig, score)

            delivered = await send_telegram(text)
            session.add(
                Alert(
                    asset_symbol=symbol,
                    direction=sig.direction,
                    score=score,
                    summary=sig.summary,
                    signal_ids=str(sig.id),
                    delivered=delivered,
                    error=None if delivered else "telegram_not_configured_or_failed",
                )
            )
            sent += 1
        await session.commit()

    if sent:
        logger.info("Alert engine dispatched %d alerts", sent)
    return sent


async def self_recently_alerted(session, symbol: str, since: datetime) -> bool:
    existing = await session.execute(
        select(Alert.id).where(
            Alert.asset_symbol == symbol, Alert.created_at >= since
        )
    )
    return existing.first() is not None


def _DIR_SIGN(direction: str) -> float:
    return {"bullish": 1.0, "bearish": -1.0}.get(direction, 0.0)


def _format_alert(sig: Signal, score: float) -> str:
    arrow = "🟢⬆️" if sig.direction == "bullish" else "🔴⬇️"
    return (
        f"{arrow} *Mouvement probable — {sig.asset_symbol}*\n"
        f"Direction: *{sig.direction}*  |  Intensité: {sig.intensity}/5  |  "
        f"Confiance: {sig.confidence:.0%}\n"
        f"Score: {score}\n\n"
        f"_{sig.summary}_\n\n"
        f"Source: [{sig.source_title or 'lien'}]({sig.source_url})"
    )
