"""Anthropic Claude client wrapper.

Responsibilities:
  - Call the Messages API with the system prompt cached (cost spec: prompt
    caching on all repeated content).
  - Request a strict JSON shape via structured outputs (`output_config.format`).
  - Record token usage + estimated USD cost per call, tagged by agent, so the
    Costs page and budget guard have data from day one.

Default model is Claude Haiku 4.5 — cheapest, sufficient for summarise/extract.
The model is configurable per agent via env (see config.py).
"""
from __future__ import annotations

import json
import logging
import re

import anthropic

from ..config import settings
from ..database import SessionLocal
from ..models import LlmCostLog
from .cost import Usage, estimate_cost_usd

logger = logging.getLogger(__name__)


class LLMClient:
    def __init__(self) -> None:
        # Anthropic() reads ANTHROPIC_API_KEY from env; we pass explicitly so a
        # missing key fails loudly rather than silently using ambient creds.
        self._client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    async def complete_json(
        self,
        *,
        agent: str,
        system_prompt: str,
        user_content: str,
        json_schema: dict,
        model: str | None = None,
        max_tokens: int | None = None,
    ) -> dict | None:
        """Run one extraction call and return the parsed JSON (or None on failure).

        The system prompt is sent as a cacheable block: stable instructions stay
        first so the 90%-cheaper cache read kicks in once the prefix is warm.
        (Note: Haiku 4.5 only caches prefixes ≥ 4096 tokens — short prompts
        silently won't cache, which is fine; cost is logged either way.)

        Uses structured outputs (`output_config.format`) when the installed SDK
        supports it, and falls back to prompt-driven JSON otherwise.
        """
        model = model or settings.default_llm_model
        max_tokens = max_tokens or settings.llm_max_output_tokens
        system = [
            {
                "type": "text",
                "text": system_prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ]
        messages = [{"role": "user", "content": user_content}]

        try:
            try:
                response = await self._client.messages.create(
                    model=model,
                    max_tokens=max_tokens,
                    system=system,
                    messages=messages,
                    output_config={
                        "format": {"type": "json_schema", "schema": json_schema}
                    },
                )
            except TypeError:
                # Older SDK without output_config: rely on the prompt's JSON rules.
                response = await self._client.messages.create(
                    model=model,
                    max_tokens=max_tokens,
                    system=system,
                    messages=messages,
                )
        except anthropic.APIError as exc:
            logger.error("LLM call failed for agent %s: %s", agent, exc)
            return None

        await self._record_cost(agent, model, response.usage)

        if response.stop_reason == "refusal":
            logger.warning("LLM refused request for agent %s", agent)
            return None

        text = next((b.text for b in response.content if b.type == "text"), None)
        if not text:
            return None
        return _parse_json(text, agent)

    async def _record_cost(self, agent: str, model: str, usage) -> None:
        u = Usage(
            input_tokens=getattr(usage, "input_tokens", 0) or 0,
            cache_write_tokens=getattr(usage, "cache_creation_input_tokens", 0) or 0,
            cache_read_tokens=getattr(usage, "cache_read_input_tokens", 0) or 0,
            output_tokens=getattr(usage, "output_tokens", 0) or 0,
        )
        cost = estimate_cost_usd(model, u)
        async with SessionLocal() as session:
            session.add(
                LlmCostLog(
                    agent=agent,
                    model=model,
                    input_tokens=u.input_tokens,
                    cache_write_tokens=u.cache_write_tokens,
                    cache_read_tokens=u.cache_read_tokens,
                    output_tokens=u.output_tokens,
                    cost_usd=cost,
                )
            )
            await session.commit()


_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


def _parse_json(text: str, agent: str) -> dict | None:
    """Parse JSON, tolerating Markdown code fences or surrounding prose."""
    candidate = _FENCE_RE.sub("", text).strip()
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        # Last resort: grab the outermost {...} block.
        match = re.search(r"\{.*\}", candidate, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
    logger.error("LLM returned non-JSON for agent %s: %s", agent, text[:200])
    return None


# Singleton used across agents.
llm_client = LLMClient()
