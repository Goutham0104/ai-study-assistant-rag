"""
POST /api/chat — Question answering with RAG (TF-IDF retrieval + Ollama).
"""

import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.document_store import store
from services.ollama_client import chat_with_ollama
from services.retriever import retrieve_relevant_chunks

router = APIRouter()
logger = logging.getLogger(__name__)

# How many chunks to feed as context
TOP_K_CHUNKS = 5

# Maximum excerpt length returned to the frontend
MAX_EXCERPT_CHARS = 300


class ChatRequest(BaseModel):
    """Request body for the chat endpoint."""
    question: str = Field(..., min_length=1, max_length=2000)
    document_filename: str | None = Field(
        default=None,
        description="Optional filename to restrict search to a specific document.",
    )


class SourceReference(BaseModel):
    """A source citation returned alongside the answer."""
    filename: str
    page_number: int
    excerpt: str
    relevance_score: float


class ChatResponse(BaseModel):
    """Structured response from the chat endpoint."""
    answer: str
    sources: list[SourceReference]
    model: str
    chunks_used: int


@router.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Accept a user question, retrieve relevant document chunks,
    call Ollama with the evidence, and return the answer + sources.
    """
    question = request.question.strip()

    # -- check that documents have been uploaded --
    if request.document_filename:
        doc = store.get_document(request.document_filename)
        if not doc:
            raise HTTPException(
                status_code=404,
                detail=f"Document '{request.document_filename}' not found.",
            )
        target_chunks = doc.chunks
    else:
        target_chunks = store.get_all_chunks()

    if not target_chunks:
        raise HTTPException(
            status_code=400,
            detail=(
                "No documents have been uploaded yet. "
                "Please upload a PDF first via /api/upload."
            ),
        )

    # -- retrieve relevant chunks --
    relevant = retrieve_relevant_chunks(question, target_chunks, top_k=TOP_K_CHUNKS)

    # If no relevant chunks meet the relevance threshold, return a direct grounded response
    if not relevant:
        doc_note = f" in '{request.document_filename}'" if request.document_filename else " in the uploaded document(s)"
        return ChatResponse(
            answer=(
                f"I could not find relevant supporting evidence for your question{doc_note}. "
                "Please verify your query or select a document containing this topic."
            ),
            sources=[],
            model="gemma3:4b",
            chunks_used=0,
        )

    # -- build context for the LLM --
    context_parts = []
    for i, chunk in enumerate(relevant, 1):
        context_parts.append(
            f"[Source {i} — {chunk['filename']}, Page {chunk['page_number']}]\n"
            f"{chunk['text']}"
        )
    context_block = "\n\n---\n\n".join(context_parts)

    system_prompt = (
        "You are an AI Study Assistant answering questions strictly from the provided PDF excerpts.\n\n"
        "STRICT GROUNDING RULES:\n"
        "1. Base your answer ONLY on the provided document excerpts below.\n"
        "2. Do NOT guess, assume, or hallucinate algorithms, metrics, formulas, or implementation "
        "details that are not explicitly stated in the excerpts.\n"
        "3. If the excerpts state a fact, explain it accurately and cite the exact source and page "
        "(e.g., '[Source 1, Page 7]').\n"
        "4. If asked about how a system or project works, synthesize the concrete steps, user flow, "
        "or operational mechanisms explicitly present in the excerpts.\n"
        "5. Clearly distinguish facts directly stated in the document from any general concepts.\n"
        "6. If the excerpts lack sufficient evidence to fully answer the question, explicitly state: "
        "'The provided document does not mention [missing information].'\n\n"
        "DOCUMENT EXCERPTS:\n\n"
        f"{context_block}"
    )

    # -- call Ollama --
    try:
        answer = await chat_with_ollama(system_prompt, question)
    except RuntimeError as exc:
        logger.error("Ollama error: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc))

    # -- build source references --
    sources = [
        SourceReference(
            filename=chunk["filename"],
            page_number=chunk["page_number"],
            excerpt=chunk["text"][:MAX_EXCERPT_CHARS] + (
                "..." if len(chunk["text"]) > MAX_EXCERPT_CHARS else ""
            ),
            relevance_score=chunk["score"],
        )
        for chunk in relevant
    ]

    return ChatResponse(
        answer=answer,
        sources=sources,
        model="gemma3:4b",
        chunks_used=len(relevant),
    )
