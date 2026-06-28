"""Central configuration loaded from environment variables / .env.

Everything that can vary between deployments lives here so we never hardcode
secrets or tunables. Each agent's scan interval and model is configurable per
the cost-optimisation spec.
"""
from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # --- Core infra -------------------------------------------------------
    database_url: str = Field(
        default="postgresql+asyncpg://watcher:watcher@db:5432/watcher",
        alias="DATABASE_URL",
    )
    redis_url: str = Field(default="redis://redis:6379/0", alias="REDIS_URL")

    # --- API / auth -------------------------------------------------------
    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    # Simple shared bearer token protecting the read API when exposed online.
    dashboard_api_token: str = Field(default="", alias="DASHBOARD_API_TOKEN")
    cors_origins: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")
    rate_limit_per_minute: int = Field(default=120, alias="RATE_LIMIT_PER_MINUTE")

    # --- Anthropic / LLM --------------------------------------------------
    anthropic_api_key: str = Field(default="", alias="ANTHROPIC_API_KEY")
    # Default model for every agent (cheapest, sufficient for extract/summarise).
    default_llm_model: str = Field(
        default="claude-haiku-4-5", alias="DEFAULT_LLM_MODEL"
    )
    # Reserved for occasional complex syntheses (Phase 2+).
    synthesis_llm_model: str = Field(
        default="claude-sonnet-4-6", alias="SYNTHESIS_LLM_MODEL"
    )
    llm_max_output_tokens: int = Field(default=1024, alias="LLM_MAX_OUTPUT_TOKENS")

    # --- Market data providers -------------------------------------------
    coingecko_api_key: str = Field(default="", alias="COINGECKO_API_KEY")
    coingecko_base_url: str = Field(
        default="https://api.coingecko.com/api/v3", alias="COINGECKO_BASE_URL"
    )
    # "twelvedata" or "finnhub" — abstracted behind a common interface.
    stocks_provider: str = Field(default="twelvedata", alias="STOCKS_PROVIDER")
    twelvedata_api_key: str = Field(default="", alias="TWELVEDATA_API_KEY")
    finnhub_api_key: str = Field(default="", alias="FINNHUB_API_KEY")

    # --- Telegram alerts --------------------------------------------------
    telegram_bot_token: str = Field(default="", alias="TELEGRAM_BOT_TOKEN")
    telegram_chat_id: str = Field(default="", alias="TELEGRAM_CHAT_ID")

    # --- Scheduling (cost lever #1: scan frequency) ----------------------
    market_poll_seconds: int = Field(default=120, alias="MARKET_POLL_SECONDS")
    news_agent_interval_seconds: int = Field(
        default=300, alias="NEWS_AGENT_INTERVAL_SECONDS"
    )
    news_agent_model: str = Field(default="", alias="NEWS_AGENT_MODEL")
    agents_enabled: bool = Field(default=True, alias="AGENTS_ENABLED")

    # --- Alert engine -----------------------------------------------------
    alert_min_intensity: int = Field(default=4, alias="ALERT_MIN_INTENSITY")
    alert_min_confidence: float = Field(default=0.6, alias="ALERT_MIN_CONFIDENCE")
    alert_cooldown_minutes: int = Field(default=30, alias="ALERT_COOLDOWN_MINUTES")

    # --- Budget guard -----------------------------------------------------
    monthly_budget_usd: float = Field(default=50.0, alias="MONTHLY_BUDGET_USD")
    pause_agents_on_budget: bool = Field(
        default=True, alias="PAUSE_AGENTS_ON_BUDGET"
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
