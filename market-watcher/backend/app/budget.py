"""Budget guard + runtime agent state.

Tracks month-to-date LLM cost and, if it crosses the configured monthly budget,
notifies Telegram and (optionally) pauses the agents so a runaway scan can never
silently burn the budget. The pause flag is in-process state checked by the
scheduler before each agent run.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy import func, select

from .alerts.telegram import send_telegram
from .config import settings
from .database import SessionLocal
from .models import LlmCostLog

logger = logging.getLogger(__name__)


class RuntimeState:
    """In-process flags controlling whether agents run."""

    def __init__(self) -> None:
        self.agents_paused: bool = not settings.agents_enabled
        self.paused_reason: str | None = (
            None if settings.agents_enabled else "disabled_by_config"
        )
        self._budget_alerted: bool = False

    def pause(self, reason: str) -> None:
        self.agents_paused = True
        self.paused_reason = reason

    def resume(self) -> None:
        self.agents_paused = False
        self.paused_reason = None
        self._budget_alerted = False


state = RuntimeState()


async def month_to_date_cost() -> float:
    start = datetime.now(timezone.utc).replace(
        day=1, hour=0, minute=0, second=0, microsecond=0
    )
    async with SessionLocal() as session:
        result = await session.execute(
            select(func.coalesce(func.sum(LlmCostLog.cost_usd), 0.0)).where(
                LlmCostLog.ts >= start
            )
        )
        return float(result.scalar() or 0.0)


async def check_budget() -> None:
    """Compare MTD cost to the monthly budget; alert/pause once if exceeded."""
    cost = await month_to_date_cost()
    if cost < settings.monthly_budget_usd:
        return
    if state._budget_alerted:
        return

    state._budget_alerted = True
    msg = (
        f"⚠️ *Budget LLM dépassé*\n"
        f"Coût ce mois: ${cost:.2f} / budget ${settings.monthly_budget_usd:.2f}"
    )
    if settings.pause_agents_on_budget:
        state.pause("monthly_budget_exceeded")
        msg += "\nLes agents ont été *mis en pause*."
    await send_telegram(msg)
    logger.warning("Monthly budget exceeded: $%.2f", cost)
