"""
In-memory document store for uploaded PDF chunks.

Stores extracted text chunks with metadata (filename, page number, chunk index).
Thread-safe via a simple lock for concurrent FastAPI requests.
"""

import threading
from dataclasses import dataclass, field


@dataclass
class TextChunk:
    """A single chunk of extracted PDF text with source metadata."""
    text: str
    filename: str
    page_number: int       # 1-indexed page number from the PDF
    chunk_index: int       # position of this chunk within the document


@dataclass
class Document:
    """Represents a fully-processed uploaded PDF."""
    filename: str
    total_pages: int
    total_chunks: int
    chunks: list[TextChunk] = field(default_factory=list)


class DocumentStore:
    """
    Thread-safe in-memory storage for processed PDF documents.

    Keeps one Document per unique filename. Uploading a file with the
    same name replaces the previous version.
    """

    def __init__(self) -> None:
        self._documents: dict[str, Document] = {}
        self._lock = threading.Lock()

    # -- mutations --

    def add_document(self, doc: Document) -> None:
        """Store (or replace) a document by filename."""
        with self._lock:
            self._documents[doc.filename] = doc

    def clear(self) -> None:
        """Remove all stored documents."""
        with self._lock:
            self._documents.clear()

    # -- queries --

    def get_document(self, filename: str) -> Document | None:
        """Return a document by filename, or None if not found."""
        with self._lock:
            return self._documents.get(filename)

    def list_documents(self) -> list[dict]:
        """Return summary info for every stored document."""
        with self._lock:
            return [
                {
                    "filename": doc.filename,
                    "total_pages": doc.total_pages,
                    "total_chunks": doc.total_chunks,
                }
                for doc in self._documents.values()
            ]

    def get_all_chunks(self) -> list[TextChunk]:
        """Return a flat list of all chunks across every document."""
        with self._lock:
            chunks: list[TextChunk] = []
            for doc in self._documents.values():
                chunks.extend(doc.chunks)
            return chunks

    @property
    def document_count(self) -> int:
        with self._lock:
            return len(self._documents)


# ---------- singleton instance shared across the app ----------
store = DocumentStore()
