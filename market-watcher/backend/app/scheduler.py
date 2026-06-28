"""APScheduler setup — drives the 24/7 loops.

Phase 1 jobs:
  - market poll      (every MARKET_POLL_SECONDS)
  - news agent scan  (every NEWS_AGENT_INTERVAL_SECONDS) → alert eval → budget check

APScheduler (not Celery) is the right call for a single-worker MVP: no broker to
run, in-process, trivial to reason about. Swap to Celery+Redis when you need
multiple workers or distributed scheduling (Phase 2+).
"""
from __future__ import annotations

import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from .agents.news_agent import NewsAgent
from .alerts.engine import evaluate_and_alert
from .budget import check_budget, state
from .config import settings
from .market.service import poll_prices

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler(timezone="UTC")
_news_agent = NewsAgent()


async def _market_job() -> None:
    try:
        await poll_prices()
    except Exception:  # noqa: BLE001 — a job must never kill the scheduler
        logger.exception("market job failed")


async def _news_job() -> None:
    if state.agents_paused:
        logger.info("agents paused (%s); skipping news scan", state.paused_reason)
        return
    try:
        await _news_agent.run_once()
        await evaluate_and_alert()
        await check_budget()
    except Exception:  # noqa: BLE001
        logger.exception("news job failed")


def start_scheduler() -> None:
    scheduler.add_job(
        _market_job,
        "interval",
        seconds=settings.market_poll_seconds,
        id="market_poll",
        max_instances=1,
        coalesce=True,
        next_run_time=None,
    )
    scheduler.add_job(
        _news_job,
        "interval",
        seconds=settings.news_agent_interval_seconds,
        id="news_scan",
        max_instances=1,
        coalesce=True,
        next_run_time=None,
    )
    scheduler.start()
    logger.info(
        "Scheduler started: market every %ss, news every %ss",
        settings.market_poll_seconds,
        settings.news_agent_interval_seconds,
    )


def shutdown_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
