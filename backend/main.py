"""
FastAPI application entry point.

Configures CORS for the Vite frontend, registers all route handlers,
and sets up basic logging.
"""

import logging
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
# Allow the Vite dev server and common local origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",   # Vite default
    "http://localhost:5174",   # Vite fallback port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",   # common alternative
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
