"""Market service: poll providers for all active assets and store snapshots."""
from __future__ import annotations

import logging

from sqlalchemy import select

from ..database import SessionLocal
from ..models import Asset, PriceSnapshot
from .coingecko import CoinGeckoProvider
from .stocks import get_stocks_provider

logger = logging.getLogger(__name__)


async def poll_prices() -> int:
    """Fetch current quotes for all active assets and persist snapshots.

    Returns the number of snapshots written. Grouped by provider so each
    provider is hit with as few calls as possible (rate-limit friendly).
    """
    async with SessionLocal() as session:
        result = await session.execute(select(Asset).where(Asset.active.is_(True)))
        assets = result.scalars().all()

        if not assets:
            return 0

        crypto = [a for a in assets if a.kind == "crypto"]
        others = [a for a in assets if a.kind != "crypto"]

        written = 0

        if crypto:
            provider = CoinGeckoProvider()
            quotes = await provider.fetch_quotes([a.provider_id for a in crypto])
            written += await _store(session, crypto, quotes)

        if others:
            provider = get_stocks_provider()
            quotes = await provider.fetch_quotes([a.provider_id for a in others])
            written += await _store(session, others, quotes)

        await session.commit()
        logger.info("Market poll wrote %d snapshots", written)
        return written


async def _store(session, assets: list[Asset], quotes: dict) -> int:
    count = 0
    for asset in assets:
        quote = quotes.get(asset.provider_id)
        if not quote:
            continue
        session.add(
            PriceSnapshot(
                asset_id=asset.id,
                price=quote.price,
                change_24h_pct=quote.change_24h_pct,
                volume_24h=quote.volume_24h,
            )
        )
        count += 1
    return count
