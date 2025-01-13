from fastapi import FastAPI
from controllers import (
    auth_router,
    user_router,
    link_router,
    click_router,
    utm_router,
    analysis_router,
)
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from core import engine, RequestTimeMiddleware
from models import Base

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="TiaLinks API",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

limiter = Limiter(key_func=get_remote_address, default_limits=["45/minutes"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(RequestTimeMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(link_router)
app.include_router(click_router)
app.include_router(utm_router)
app.include_router(analysis_router)


@app.get("/")
async def root():
    return RedirectResponse("/api/docs")
