"""Dashboard API routes."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..aggregation.scoring import score_asset
from ..budget import month_to_date_cost, state
from ..config import settings
from ..database import get_session
from ..models import Alert, Asset, LlmCostLog, PriceSnapshot, Signal
from ..schemas import (
    AlertOut,
    AssetDetail,
    AssetOverview,
    CostByAgentDay,
    CostSummary,
    PricePoint,
    SettingsOut,
    SignalOut,
)
from .deps import require_token

router = APIRouter(dependencies=[Depends(require_token)])


@router.get("/health")
async def health() -> dict:
    return {"status": "ok", "agents_paused": state.agents_paused}


async def _latest_snapshot(session: AsyncSession, asset_id: int) -> PriceSnapshot | None:
    res = await session.execute(
        select(PriceSnapshot)
        .where(PriceSnapshot.asset_id == asset_id)
        .order_by(PriceSnapshot.ts.desc())
        .limit(1)
    )
    return res.scalars().first()


async def _overview(session: AsyncSession, asset: Asset) -> AssetOverview:
    snap = await _latest_snapshot(session, asset.id)
    sc = await score_asset(session, asset.symbol)
    return AssetOverview(
        symbol=asset.symbol,
        name=asset.name,
        kind=asset.kind,
        price=snap.price if snap else None,
        change_24h_pct=snap.change_24h_pct if snap else None,
        score=sc.score,
        signal_count=sc.signal_count,
        last_signal_at=sc.last_signal_at,
    )


@router.get("/assets", response_model=list[AssetOverview])
async def list_assets(session: AsyncSession = Depends(get_session)):
    res = await session.execute(select(Asset).where(Asset.active.is_(True)).order_by(Asset.kind, Asset.symbol))
    return [await _overview(session, a) for a in res.scalars().all()]


@router.get("/assets/{symbol}", response_model=AssetDetail)
async def asset_detail(symbol: str, session: AsyncSession = Depends(get_session)):
    res = await session.execute(select(Asset).where(Asset.symbol == symbol.upper()))
    asset = res.scalars().first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    overview = await _overview(session, asset)

    sig_res = await session.execute(
        select(Signal)
        .where(Signal.asset_symbol == asset.symbol)
        .order_by(Signal.created_at.desc())
        .limit(50)
    )
    signals = [SignalOut.model_validate(s, from_attributes=True) for s in sig_res.scalars().all()]

    ph_res = await session.execute(
        select(PriceSnapshot)
        .where(PriceSnapshot.asset_id == asset.id)
        .order_by(PriceSnapshot.ts.desc())
        .limit(100)
    )
    price_history = [
        PricePoint(price=p.price, change_24h_pct=p.change_24h_pct, ts=p.ts)
        for p in reversed(ph_res.scalars().all())
    ]

    return AssetDetail(overview=overview, signals=signals, price_history=price_history)


@router.get("/signals", response_model=list[SignalOut])
async def list_signals(limit: int = 50, session: AsyncSession = Depends(get_session)):
    res = await session.execute(
        select(Signal).order_by(Signal.created_at.desc()).limit(min(limit, 200))
    )
    return [SignalOut.model_validate(s, from_attributes=True) for s in res.scalars().all()]


@router.get("/alerts", response_model=list[AlertOut])
async def list_alerts(limit: int = 50, session: AsyncSession = Depends(get_session)):
    res = await session.execute(
        select(Alert).order_by(Alert.created_at.desc()).limit(min(limit, 200))
    )
    return [AlertOut.model_validate(a, from_attributes=True) for a in res.scalars().all()]


@router.get("/costs", response_model=CostSummary)
async def costs(session: AsyncSession = Depends(get_session)):
    mtd = await month_to_date_cost()
    day = func.date(LlmCostLog.ts)
    res = await session.execute(
        select(
            LlmCostLog.agent,
            day.label("day"),
            func.sum(LlmCostLog.cost_usd),
            func.sum(LlmCostLog.input_tokens),
            func.sum(LlmCostLog.output_tokens),
        )
        .group_by(LlmCostLog.agent, day)
        .order_by(day.desc())
        .limit(60)
    )
    by_agent_day = [
        CostByAgentDay(
            agent=agent,
            day=str(d),
            cost_usd=round(float(cost or 0), 6),
            input_tokens=int(it or 0),
            output_tokens=int(ot or 0),
        )
        for agent, d, cost, it, ot in res.all()
    ]
    budget = settings.monthly_budget_usd
    return CostSummary(
        month_to_date_usd=round(mtd, 4),
        monthly_budget_usd=budget,
        budget_used_pct=round(100 * mtd / budget, 1) if budget else 0.0,
        by_agent_day=by_agent_day,
    )


@router.get("/settings", response_model=SettingsOut)
async def get_settings_view():
    return SettingsOut(
        default_llm_model=settings.default_llm_model,
        news_agent_interval_seconds=settings.news_agent_interval_seconds,
        market_poll_seconds=settings.market_poll_seconds,
        alert_min_intensity=settings.alert_min_intensity,
        alert_min_confidence=settings.alert_min_confidence,
        alert_cooldown_minutes=settings.alert_cooldown_minutes,
        monthly_budget_usd=settings.monthly_budget_usd,
        agents_paused=state.agents_paused,
        paused_reason=state.paused_reason,
    )


@router.post("/agents/pause")
async def pause_agents():
    state.pause("manual")
    return {"agents_paused": True, "reason": state.paused_reason}


@router.post("/agents/resume")
async def resume_agents():
    state.resume()
    return {"agents_paused": False}
