from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.category import router as category_router
from app.api.v1.quizzes import router as quiz_router
from app.api.v1.questions import router as question_router
from app.api.v1.attempts import router as attempt_router
from app.api.v1.results import router as result_router
from app.api.v1.dashboard import router as dashboard_router
from app.dependencies.auth_dependency import get_current_user

app = FastAPI(
    title="Assessment Portal API",
    description="Backend API for Assessment Portal",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/home", tags=["Home"])
async def home():
    return {"message": "Assessment Portal API is running"}


@app.get("/api/health", tags=["Home"])
async def health():
    return {"status": "ok"}


@app.get("/api/profile", tags=["Authentication"])
async def profile(current_user=Depends(get_current_user)):
    return current_user


app.include_router(auth_router, prefix="/api")
app.include_router(category_router, prefix="/api")
app.include_router(quiz_router, prefix="/api")
app.include_router(question_router, prefix="/api")
app.include_router(attempt_router, prefix="/api")
app.include_router(result_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
