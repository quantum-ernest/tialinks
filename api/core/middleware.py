import time
from contextvars import ContextVar
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

process_time_ctx = ContextVar("process_time", default=0.0)


class RequestTimeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        process_time_ctx.set(process_time)
        return response
