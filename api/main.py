from fastapi import FastAPI
from controllers import auth_router, user_router, link_router, click_router, utm_router
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TiaLinks API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

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


@app.get("/")
async def root():
    return RedirectResponse("/api/docs")
