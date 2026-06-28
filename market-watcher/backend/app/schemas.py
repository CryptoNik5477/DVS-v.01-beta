"""Pydantic response models for the read API."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class AssetOverview(BaseModel):
    symbol: str
    name: str
    kind: str
    price: float | None
    change_24h_pct: float | None
    score: float
    signal_count: int
    last_signal_at: datetime | None


class SignalOut(BaseModel):
    id: int
    agent: str
    asset_symbol: str | None
    direction: str
    intensity: int
    confidence: float
    summary: str
    source_url: str
    source_title: str | None
    published_at: datetime | None
    created_at: datetime


class PricePoint(BaseModel):
    price: float
    change_24h_pct: float | None
    ts: datetime


class AssetDetail(BaseModel):
    overview: AssetOverview
    signals: list[SignalOut]
    price_history: list[PricePoint]


class AlertOut(BaseModel):
    id: int
    asset_symbol: str | None
    direction: str
    score: float
    summary: str
    signal_ids: str
    delivered: bool
    created_at: datetime


class CostByAgentDay(BaseModel):
    agent: str
    day: str
    cost_usd: float
    input_tokens: int
    output_tokens: int


class CostSummary(BaseModel):
    month_to_date_usd: float
    monthly_budget_usd: float
    budget_used_pct: float
    by_agent_day: list[CostByAgentDay]


class SettingsOut(BaseModel):
    default_llm_model: str
    news_agent_interval_seconds: int
    market_poll_seconds: int
    alert_min_intensity: int
    alert_min_confidence: float
    alert_cooldown_minutes: int
    monthly_budget_usd: float
    agents_paused: bool
    paused_reason: str | None
