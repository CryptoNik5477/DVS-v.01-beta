"""Seed the default watchlist (3-5 hardcoded assets for Phase 1).

Provider ids are chosen to match the default providers:
  - crypto    → CoinGecko coin ids
  - commodity → Twelve Data symbols (gold, oil)
Idempotent: only inserts assets whose symbol doesn't already exist.
"""
from __future__ import annotations

import logging

from sqlalchemy import select

from .database import SessionLocal
from .models import Asset

logger = logging.getLogger(__name__)

DEFAULT_ASSETS = [
    # symbol, name, kind, provider, provider_id
    ("BTC", "Bitcoin", "crypto", "coingecko", "bitcoin"),
    ("ETH", "Ethereum", "crypto", "coingecko", "ethereum"),
    ("SOL", "Solana", "crypto", "coingecko", "solana"),
    ("XAU", "Gold (spot)", "commodity", "twelvedata", "XAU/USD"),
    ("WTI", "Crude Oil WTI", "commodity", "twelvedata", "WTI/USD"),
]


async def seed_assets() -> None:
    async with SessionLocal() as session:
        existing = await session.execute(select(Asset.symbol))
        have = {s for (s,) in existing.all()}
        added = 0
        for symbol, name, kind, provider, provider_id in DEFAULT_ASSETS:
            if symbol in have:
                continue
            session.add(
                Asset(
                    symbol=symbol,
                    name=name,
                    kind=kind,
                    provider=provider,
                    provider_id=provider_id,
                )
            )
            added += 1
        await session.commit()
    if added:
        logger.info("Seeded %d default assets", added)
