"""Source definitions + fetching.

Phase 1 uses free RSS feeds for financial/crypto news (zero cost). Each agent
owns its own list of sources; adding a niche later = a new list here.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from time import mktime

import feedparser
import httpx

from ..sanitize import clean_text

logger = logging.getLogger(__name__)


@dataclass
class RawItem:
    title: str
    summary: str
    url: str
    source_name: str
    published_at: datetime | None


# Financial / crypto news — all free RSS.
NEWS_FEEDS: dict[str, str] = {
    "Reuters Business": "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
    "CoinDesk": "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "CoinTelegraph": "https://cointelegraph.com/rss",
    "Yahoo Finance": "https://finance.yahoo.com/news/rssindex",
    "Investing.com": "https://www.investing.com/rss/news.rss",
}


async def fetch_feed(name: str, url: str, limit: int = 10) -> list[RawItem]:
    """Fetch and parse one RSS feed into sanitised RawItems."""
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "MarketWatcher/0.1"})
            resp.raise_for_status()
            content = resp.content
    except httpx.HTTPError as exc:
        logger.warning("Feed fetch failed (%s): %s", name, exc)
        return []

    parsed = feedparser.parse(content)
    items: list[RawItem] = []
    for entry in parsed.entries[:limit]:
        link = entry.get("link")
        title = clean_text(entry.get("title"), max_len=300)
        if not link or not title:
            continue
        items.append(
            RawItem(
                title=title,
                summary=clean_text(entry.get("summary") or entry.get("description")),
                url=link,
                source_name=name,
                published_at=_parse_published(entry),
            )
        )
    return items


def _parse_published(entry) -> datetime | None:
    tm = entry.get("published_parsed") or entry.get("updated_parsed")
    if not tm:
        return None
    try:
        return datetime.fromtimestamp(mktime(tm), tz=timezone.utc)
    except (TypeError, ValueError, OverflowError):
        return None
