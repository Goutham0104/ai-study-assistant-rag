"""
POST /api/upload — PDF upload, text extraction, and chunking.
"""

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile

from services.document_store import store
from services.pdf_processor import extract_text_from_pdf

router = APIRouter()
logger = logging.getLogger(__name__)

# 20 MB limit to prevent memory issues on 16 GB machine
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024


@router.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Accept a PDF upload, extract text, chunk it, and store in memory.

    Returns document metadata on success.
    """
    # -- validate file type --
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail=f"Only PDF files are accepted. Got: '{file.filename}'",
        )

    content_type = file.content_type or ""
    if content_type and content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail=f"Invalid content type: '{content_type}'. Expected 'application/pdf'.",
        )

    # -- read file bytes --
    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({len(file_bytes) / 1024 / 1024:.1f} MB). Max is 20 MB.",
        )

    # -- extract and chunk --
    try:
        document = extract_text_from_pdf(file_bytes, file.filename)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception:
        # Don't leak internal details
        logger.exception("Unexpected error processing PDF")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the PDF.",
        )

    # -- store --
    store.add_document(document)

    logger.info(
        "Stored document '%s': %d pages, %d chunks",
        document.filename,
        document.total_pages,
        document.total_chunks,
    )

    return {
        "status": "success",
        "filename": document.filename,
        "total_pages": document.total_pages,
        "total_chunks": document.total_chunks,
        "documents_loaded": store.document_count,
    }


@router.get("/api/documents")
async def list_documents():
    """Return all stored documents."""
    return {"documents": store.list_documents()}
