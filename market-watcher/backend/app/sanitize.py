"""Sanitise web content before it ever reaches the LLM.

Scraped/RSS content is untrusted: it can carry prompt-injection payloads
("ignore previous instructions…"). We strip HTML, collapse whitespace, cap
length, and neutralise the most common injection markers. This is defence in
depth — the system prompt also tells the model to treat user content as data.
"""
from __future__ import annotations

import html
import re

_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")

# Phrases commonly used to hijack an LLM via scraped text.
_INJECTION_PATTERNS = [
    re.compile(r"ignore (all |the )?(previous|above|prior) instructions", re.I),
    re.compile(r"disregard (all |the )?(previous|above|prior)", re.I),
    re.compile(r"system prompt", re.I),
    re.compile(r"you are now", re.I),
    re.compile(r"</?(system|assistant|user)>", re.I),
]

MAX_LEN = 2000


def clean_text(raw: str | None, max_len: int = MAX_LEN) -> str:
    """Return plain, length-capped, injection-neutralised text."""
    if not raw:
        return ""
    text = html.unescape(raw)
    text = _TAG_RE.sub(" ", text)
    text = _WS_RE.sub(" ", text).strip()
    for pat in _INJECTION_PATTERNS:
        text = pat.sub("[filtered]", text)
    if len(text) > max_len:
        text = text[:max_len].rsplit(" ", 1)[0] + "…"
    return text
