"""LLM cost estimation.

Prices are in USD per 1M tokens (input / output), verified late June 2026.
Prompt caching adjusts the effective input price:
  - cache *write*  ≈ 1.25× base input (5-minute TTL)
  - cache *read*   ≈ 0.10× base input
Keep this table in one place so the Costs page and the budget guard agree.
"""
from __future__ import annotations

from dataclasses import dataclass

# model -> (input_per_mtok, output_per_mtok)
MODEL_PRICES: dict[str, tuple[float, float]] = {
    "claude-haiku-4-5": (1.0, 5.0),
    "claude-sonnet-4-6": (3.0, 15.0),
    "claude-opus-4-8": (5.0, 25.0),
}

CACHE_WRITE_MULTIPLIER = 1.25
CACHE_READ_MULTIPLIER = 0.10


@dataclass(frozen=True)
class Usage:
    input_tokens: int = 0
    cache_write_tokens: int = 0
    cache_read_tokens: int = 0
    output_tokens: int = 0


def estimate_cost_usd(model: str, usage: Usage) -> float:
    """Return the estimated USD cost for a single call's token usage."""
    in_price, out_price = MODEL_PRICES.get(model, MODEL_PRICES["claude-haiku-4-5"])
    cost = (
        usage.input_tokens * in_price
        + usage.cache_write_tokens * in_price * CACHE_WRITE_MULTIPLIER
        + usage.cache_read_tokens * in_price * CACHE_READ_MULTIPLIER
        + usage.output_tokens * out_price
    ) / 1_000_000
    return round(cost, 6)
