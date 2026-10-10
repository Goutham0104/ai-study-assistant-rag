"""
PDF text extraction and chunking using PyMuPDF (fitz).

Extracts text page-by-page, then splits each page into overlapping chunks
so that context isn't lost at chunk boundaries.
"""

import logging
from io import BytesIO

import fitz  # PyMuPDF

from .document_store import Document, TextChunk

logger = logging.getLogger(__name__)

# ---- configuration ----
MAX_CHUNK_CHARS = 800      # target characters per chunk
CHUNK_OVERLAP_CHARS = 100  # overlap between consecutive chunks on the same page


def extract_text_from_pdf(file_bytes: bytes, filename: str) -> Document:
    """
    Read a PDF from raw bytes, extract text per page, chunk it,
    and return a Document ready for storage.

    Raises ValueError for unreadable or empty PDFs.
    """
    try:
        pdf = fitz.open(stream=BytesIO(file_bytes), filetype="pdf")
    except Exception as exc:
        raise ValueError(f"Could not open PDF: {exc}") from exc

    if pdf.page_count == 0:
        pdf.close()
        raise ValueError("PDF has zero pages.")

    all_chunks: list[TextChunk] = []
    chunk_index = 0
    pages_with_text = 0

    for page_num in range(pdf.page_count):
        page = pdf.load_page(page_num)
        page_text = page.get_text("text").strip()

        if not page_text:
            continue

        pages_with_text += 1
        # Split this page's text into smaller chunks
        page_chunks = _split_text(page_text, MAX_CHUNK_CHARS, CHUNK_OVERLAP_CHARS)

        for chunk_text in page_chunks:
            all_chunks.append(
                TextChunk(
                    text=chunk_text,
                    filename=filename,
                    page_number=page_num + 1,  # 1-indexed
                    chunk_index=chunk_index,
                )
            )
            chunk_index += 1

    total_pages = pdf.page_count
    pdf.close()

    if pages_with_text == 0:
        raise ValueError(
            "PDF appears to be empty — no extractable text found on any page."
        )

    logger.info(
        "Extracted %d chunks from %d pages (of %d total) in '%s'",
        len(all_chunks),
        pages_with_text,
        total_pages,
        filename,
    )

    return Document(
        filename=filename,
        total_pages=total_pages,
        total_chunks=len(all_chunks),
        chunks=all_chunks,
    )


def _split_text(text: str, max_chars: int, overlap: int) -> list[str]:
    """
    Split *text* into chunks of at most *max_chars* characters,
    with *overlap* characters shared between consecutive chunks.
    Tries to break on sentence boundaries when possible.
    """
    if len(text) <= max_chars:
        return [text]

    chunks: list[str] = []
    start = 0

    while start < len(text):
        end = start + max_chars

        if end < len(text):
            # Try to break at the last sentence-ending punctuation
            break_point = _find_sentence_break(text, start, end)
            if break_point > start:
                end = break_point

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        # Advance, keeping overlap
        start = max(start + 1, end - overlap)

    return chunks


def _find_sentence_break(text: str, start: int, end: int) -> int:
    """
    Look backwards from *end* for the last sentence-ending character
    (., !, ?) followed by whitespace. Returns the position just after
    the punctuation, or *start* if no good break is found.
    """
    search_region = text[start:end]
    for marker in [". ", "! ", "? ", ".\n", "!\n", "?\n"]:
        idx = search_region.rfind(marker)
        if idx != -1:
            return start + idx + 1  # include the punctuation character
    return start
