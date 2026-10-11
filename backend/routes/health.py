"""
GET /api/health — Backend and Ollama health check.
"""

from fastapi import APIRouter
from services.ollama_client import check_llm_health, check_ollama_health, MODEL_NAME, PROVIDER
from services.document_store import store

router = APIRouter()


@router.get("/api/health")
async def health_check():
    """
    Returns backend status, active LLM provider, and connectivity info.
    Always returns 200 so monitoring tools and deployment checks can inspect health.
    """
    llm_status = await check_llm_health()
    ollama_status = await check_ollama_health()

    return {
        "status": "ok",
        "backend": "running",
        "provider": PROVIDER,
        "model": MODEL_NAME,
        "documents_loaded": store.document_count,
        "llm": llm_status,
        "ollama": ollama_status,
    }
