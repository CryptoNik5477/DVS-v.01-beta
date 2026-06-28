"""Telegram bot sender.

Secrets (bot token, chat id) come from env. If unconfigured, sending is a
no-op that logs a warning, so the rest of the pipeline still runs locally.
"""
from __future__ import annotations

import logging

import httpx

from ..config import settings

logger = logging.getLogger(__name__)


async def send_telegram(text: str) -> bool:
    """Send a Markdown message to the configured Telegram chat."""
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        logger.warning("Telegram not configured; would have sent:\n%s", text)
        return False

    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    payload = {
        "chat_id": settings.telegram_chat_id,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False,
    }
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
        return True
    except httpx.HTTPError as exc:
        logger.error("Telegram send failed: %s", exc)
        return False
