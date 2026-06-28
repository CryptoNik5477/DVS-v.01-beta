"""FastAPI application entrypoint.

On startup: create tables, seed the default watchlist, start the scheduler
(market poll + news agent). On shutdown: stop the scheduler cleanly.
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from .api.routes import router as api_router
from .config import settings
from .database import init_db
from .scheduler import shutdown_scheduler, start_scheduler
from .seed import seed_assets

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("market_watcher")

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.rate_limit_per_minute}/minute"],
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_assets()
    start_scheduler()
    logger.info("Market Watcher started.")
    try:
        yield
    finally:
        shutdown_scheduler()
        logger.info("Market Watcher stopped.")


app = FastAPI(title="Market Watcher", version="0.1.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/")
async def root() -> dict:
    return {"service": "market-watcher", "version": "0.1.0", "docs": "/docs"}
