"""News agent — Phase 1's single, end-to-end agent.

Scope: financial + crypto news via free RSS feeds. Concurrency-fetches all
feeds each cycle, then hands the items to the shared extract/store pipeline.
"""
from __future__ import annotations

import asyncio

from ..config import settings
from .base import Agent
from .sources import NEWS_FEEDS, RawItem, fetch_feed


class NewsAgent(Agent):
    name = "news"

    def __init__(self) -> None:
        super().__init__()
        self.interval_seconds = settings.news_agent_interval_seconds
        # Per-agent model override (cost lever), else the global default.
        self.model = settings.news_agent_model or settings.default_llm_model

    async def fetch_items(self) -> list[RawItem]:
        results = await asyncio.gather(
            *(fetch_feed(name, url) for name, url in NEWS_FEEDS.items()),
            return_exceptions=True,
        )
        items: list[RawItem] = []
        for r in results:
            if isinstance(r, list):
                items.extend(r)
        return items
