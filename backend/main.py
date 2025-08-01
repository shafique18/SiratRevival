from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from worker.scheduler import start_news_scheduler, stop_news_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_news_scheduler()
    yield
    # Shutdown (optional)
    stop_news_scheduler()

app = FastAPI(title="SiratRevival API", lifespan=lifespan)


origins = [
    "http://localhost:3000",  # your React frontend URL
    "http://127.0.0.1:8000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # allow your frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],              # allow all methods (GET, POST, OPTIONS, etc)
    allow_headers=["*"],              # allow all headers
)
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
from backend.api.auth import router as auth_router
from backend.api.users import router as users_router
from backend.api.content import router as content_router
from backend.api.translation import router as translation_router
from backend.api.learning_paths import router as learning_router
from backend.api.analytics import router as analytics_router
from backend.api.admin import router as admin_router
from fastapi.responses import JSONResponse
from fastapi import Request





# Register routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(content_router, prefix="/content", tags=["Content"])
app.include_router(translation_router, prefix="/ai", tags=["AI Translations"])
app.include_router(learning_router, prefix="/learning", tags=["Learning Paths"])
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(admin_router)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

