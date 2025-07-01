from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.content import router as content_router
from app.api.ai_translation import router as ai_router
from app.api.learning_paths import router as learning_router
from app.api.analytics import router as analytics_router
from app.api.admin import router as admin_router
from app.api.content.subscribe import router as subscribe_router
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse


app = FastAPI(title="SiratRevival API")

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

# Register routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(content_router, prefix="/content", tags=["Content"])
app.include_router(ai_router, prefix="/ai", tags=["AI Translations"])
app.include_router(learning_router, prefix="/learning", tags=["Learning Paths"])
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(subscribe_router, prefix="/subscribe", tags=["Scubscribe"])
app.include_router(admin_router)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return PlainTextResponse(str(exc), status_code=422)

