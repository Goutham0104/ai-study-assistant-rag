"""
GET /api/health — Backend and Ollama health check.
"""

from fastapi import APIRouter
from services.ollama_client import check_ollama_health, MODEL_NAME
from services.document_store import store

router = APIRouter()


@router.get("/api/health")
async def health_check():
    """
    Returns backend status and Ollama connectivity info.
    Always returns 200 so monitoring tools can see the full picture.
    """
    ollama_status = await check_ollama_health()

    return {
        "status": "ok",
        "backend": "running",
        "model": MODEL_NAME,
        "documents_loaded": store.document_count,
        "ollama": ollama_status,
    }
