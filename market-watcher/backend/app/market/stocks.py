"""Stocks / gold / oil provider.

Two free implementations behind the same interface; pick via STOCKS_PROVIDER.
Phase 1 accepts delayed data (free tiers). Provider ids:
  - Twelve Data: symbols like "XAU/USD" (gold), "WTI/USD" or "CL", "AAPL".
  - Finnhub:     symbols like "OANDA:XAU_USD", "AAPL".
Choose the ids in the seed to match whichever provider is configured.
"""
from __future__ import annotations

import logging

import httpx

from ..config import settings
from .base import MarketDataProvider, Quote

logger = logging.getLogger(__name__)


class TwelveDataProvider(MarketDataProvider):
    name = "twelvedata"

    async def fetch_quotes(self, provider_ids: list[str]) -> dict[str, Quote]:
        if not provider_ids or not settings.twelvedata_api_key:
            if not settings.twelvedata_api_key:
                logger.info("TWELVEDATA_API_KEY not set; skipping stock/commodity quotes")
            return {}
        params = {
            "symbol": ",".join(provider_ids),
            "apikey": settings.twelvedata_api_key,
        }
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get("https://api.twelvedata.com/quote", params=params)
                resp.raise_for_status()
                data = resp.json()
        except (httpx.HTTPError, ValueError) as exc:
            logger.warning("TwelveData fetch failed: %s", exc)
            return {}

        # A single symbol returns a flat object; multiple return {symbol: {...}}.
        if len(provider_ids) == 1:
            data = {provider_ids[0]: data}

        quotes: dict[str, Quote] = {}
        for symbol, fields in data.items():
            if not isinstance(fields, dict) or "close" not in fields:
                continue
            try:
                price = float(fields["close"])
            except (TypeError, ValueError):
                continue
            change = fields.get("percent_change")
            quotes[symbol] = Quote(
                symbol=symbol,
                price=price,
                change_24h_pct=float(change) if change not in (None, "") else None,
                volume_24h=_maybe_float(fields.get("volume")),
            )
        return quotes


class FinnhubProvider(MarketDataProvider):
    name = "finnhub"

    async def fetch_quotes(self, provider_ids: list[str]) -> dict[str, Quote]:
        if not settings.finnhub_api_key:
            logger.info("FINNHUB_API_KEY not set; skipping stock/commodity quotes")
            return {}
        quotes: dict[str, Quote] = {}
        # Finnhub /quote takes one symbol per call.
        async with httpx.AsyncClient(timeout=15) as client:
            for symbol in provider_ids:
                try:
                    resp = await client.get(
                        "https://finnhub.io/api/v1/quote",
                        params={"symbol": symbol, "token": settings.finnhub_api_key},
                    )
                    resp.raise_for_status()
                    f = resp.json()
                except (httpx.HTTPError, ValueError) as exc:
                    logger.warning("Finnhub fetch failed for %s: %s", symbol, exc)
                    continue
                price = f.get("c")  # current price
                if not price:
                    continue
                quotes[symbol] = Quote(
                    symbol=symbol,
                    price=float(price),
                    change_24h_pct=f.get("dp"),  # percent change
                )
        return quotes


def _maybe_float(v) -> float | None:
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def get_stocks_provider() -> MarketDataProvider:
    if settings.stocks_provider == "finnhub":
        return FinnhubProvider()
    return TwelveDataProvider()
