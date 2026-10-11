"""
FastAPI application entry point.

Configures CORS for the Vite frontend, registers all route handlers,
and sets up basic logging.
"""

import logging
import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.upload import router as upload_router
from routes.chat import router as chat_router

# ---------- logging setup ----------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)

# ---------- FastAPI app ----------
app = FastAPI(
    title="AI Study Assistant — RAG Backend",
    description=(
        "PDF question-answering backend using TF-IDF retrieval and "
        "Ollama (gemma3:4b) for the AI Study Assistant."
    ),
    version="1.0.0",
)

# ---------- CORS ----------
# Allow the Vite dev server, production frontend (Vercel), and custom origins
env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins.strip() == "*":
    ALLOWED_ORIGINS = ["*"]
else:
    ALLOWED_ORIGINS = [
        "http://localhost:5173",   # Vite default
        "http://localhost:5174",   # Vite fallback port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000",   # common alternative
        "https://ai-study-assistant-rag.vercel.app",  # Production Vercel frontend
        "https://ai-study-assistant-rag-gamma.vercel.app",  # New Vercel frontend URL
    ]
    if env_origins:
        ALLOWED_ORIGINS.extend([origin.strip() for origin in env_origins.split(",") if origin.strip()])

# If FRONTEND_URL is specified (e.g., custom domain), include it
frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
if frontend_url and frontend_url not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(frontend_url)

allow_all = "*" in ALLOWED_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else ALLOWED_ORIGINS,
    allow_origin_regex=None if allow_all else r"https:\/\/.*\.vercel\.app",  # Support preview deployments on Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- route registration ----------
app.include_router(health_router)
app.include_router(upload_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    """Root endpoint — quick confirmation the server is up."""
    return {
        "message": "AI Study Assistant RAG Backend",
        "docs": "/docs",
        "health": "/api/health",
    }


logger.info("AI Study Assistant backend initialised")
