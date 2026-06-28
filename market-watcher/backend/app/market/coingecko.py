"""CoinGecko provider — free Demo tier (10k calls/month, 100/min).

Uses the simple/price endpoint: one call covers all tracked coins.
Provider ids are CoinGecko coin ids, e.g. "bitcoin", "ethereum".
"""
from __future__ import annotations

import logging

import httpx

from ..config import settings
from .base import MarketDataProvider, Quote

logger = logging.getLogger(__name__)


class CoinGeckoProvider(MarketDataProvider):
    kind = "crypto"
    name = "coingecko"

    def __init__(self) -> None:
        self._base = settings.coingecko_base_url.rstrip("/")
        self._headers: dict[str, str] = {}
        # Demo key uses a dedicated header when present.
        if settings.coingecko_api_key:
            self._headers["x-cg-demo-api-key"] = settings.coingecko_api_key

    async def fetch_quotes(self, provider_ids: list[str]) -> dict[str, Quote]:
        if not provider_ids:
            return {}
        params = {
            "ids": ",".join(provider_ids),
            "vs_currencies": "usd",
            "include_24hr_change": "true",
            "include_24hr_vol": "true",
        }
        url = f"{self._base}/simple/price"
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(url, params=params, headers=self._headers)
                resp.raise_for_status()
                data = resp.json()
        except (httpx.HTTPError, ValueError) as exc:
            logger.warning("CoinGecko fetch failed: %s", exc)
            return {}

        quotes: dict[str, Quote] = {}
        for coin_id, fields in data.items():
            price = fields.get("usd")
            if price is None:
                continue
            quotes[coin_id] = Quote(
                symbol=coin_id,
                price=float(price),
                change_24h_pct=fields.get("usd_24h_change"),
                volume_24h=fields.get("usd_24h_vol"),
            )
        return quotes
