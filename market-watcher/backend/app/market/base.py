"""Provider abstraction for market data.

Every concrete provider (CoinGecko, Twelve Data, Finnhub, …) implements this
interface, so we can swap a free/freemium source for a paid one later without
touching the rest of the app.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Quote:
    """A single price observation for an asset."""

    symbol: str
    price: float
    change_24h_pct: float | None = None
    volume_24h: float | None = None


class MarketDataProvider(ABC):
    """Fetch quotes for a set of provider-specific identifiers."""

    #: which asset kind this provider serves: crypto | stock | commodity
    kind: str = ""
    name: str = "base"

    @abstractmethod
    async def fetch_quotes(self, provider_ids: list[str]) -> dict[str, Quote]:
        """Return {provider_id: Quote} for the requested ids."""
        raise NotImplementedError
