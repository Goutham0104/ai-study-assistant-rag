"""
API tests for the AI Study Assistant backend.

Run with:  python -m pytest tests/ -v
"""

import os
import sys

import pytest
from fastapi.testclient import TestClient

# Ensure the backend package root is on sys.path so imports resolve
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from services.document_store import store


@pytest.fixture(autouse=True)
def clear_store():
    """Reset the document store before each test."""
    store.clear()
    yield
    store.clear()


client = TestClient(app)


# ─── Health endpoint ─────────────────────────────────────────────

class TestHealth:
    def test_health_returns_200(self):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["backend"] == "running"
        assert data["model"] == "gemma3:4b"
        assert "ollama" in data

    def test_root_returns_info(self):
        resp = client.get("/")
        assert resp.status_code == 200
        data = resp.json()
        assert "docs" in data


# ─── Upload endpoint ─────────────────────────────────────────────

class TestUpload:
    def test_upload_rejects_non_pdf(self):
        resp = client.post(
            "/api/upload",
            files={"file": ("test.txt", b"hello world", "text/plain")},
        )
        assert resp.status_code == 400
        assert "PDF" in resp.json()["detail"]

    def test_upload_rejects_empty_file(self):
        resp = client.post(
            "/api/upload",
            files={"file": ("empty.pdf", b"", "application/pdf")},
        )
        assert resp.status_code == 400
        assert "empty" in resp.json()["detail"].lower()

    def test_upload_rejects_invalid_pdf(self):
        resp = client.post(
            "/api/upload",
            files={"file": ("bad.pdf", b"this is not a pdf", "application/pdf")},
        )
        # Should be 422 (unprocessable) because it's not valid PDF bytes
        assert resp.status_code == 422

    def test_upload_accepts_valid_pdf(self):
        """Upload a minimal valid PDF generated with PyMuPDF."""
        import fitz
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((72, 72), "Hello, this is a test document for RAG.")
        pdf_bytes = doc.tobytes()
        doc.close()

        resp = client.post(
            "/api/upload",
            files={"file": ("test_doc.pdf", pdf_bytes, "application/pdf")},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert data["filename"] == "test_doc.pdf"
        assert data["total_pages"] >= 1
        assert data["total_chunks"] >= 1

    def test_upload_replaces_same_filename(self):
        """Uploading the same filename again replaces the old document."""
        import fitz
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((72, 72), "Version 1 content.")
        pdf_bytes_v1 = doc.tobytes()
        doc.close()

        client.post(
            "/api/upload",
            files={"file": ("same.pdf", pdf_bytes_v1, "application/pdf")},
        )
        assert store.document_count == 1

        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((72, 72), "Version 2 content.")
        pdf_bytes_v2 = doc.tobytes()
        doc.close()

        client.post(
            "/api/upload",
            files={"file": ("same.pdf", pdf_bytes_v2, "application/pdf")},
        )
        # Still only 1 document (replaced)
        assert store.document_count == 1


# ─── Chat endpoint ───────────────────────────────────────────────

class TestChat:
    def test_chat_rejects_empty_question(self):
        resp = client.post("/api/chat", json={"question": ""})
        assert resp.status_code == 422  # pydantic validation

    def test_chat_rejects_when_no_documents(self):
        resp = client.post("/api/chat", json={"question": "What is entropy?"})
        assert resp.status_code == 400
        assert "No documents" in resp.json()["detail"]

    def test_chat_missing_question_field(self):
        resp = client.post("/api/chat", json={})
        assert resp.status_code == 422


# ─── Document store unit tests ───────────────────────────────────

class TestDocumentStore:
    def test_store_starts_empty(self):
        assert store.document_count == 0
        assert store.get_all_chunks() == []

    def test_list_documents_empty(self):
        assert store.list_documents() == []


# ─── PDF processor unit tests ────────────────────────────────────

class TestPdfProcessor:
    def test_extract_raises_on_garbage(self):
        from services.pdf_processor import extract_text_from_pdf
        with pytest.raises(ValueError):
            extract_text_from_pdf(b"not a pdf", "garbage.pdf")

    def test_extract_valid_pdf(self):
        import fitz
        from services.pdf_processor import extract_text_from_pdf

        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((72, 72), "Engineering thermodynamics lecture notes.")
        pdf_bytes = doc.tobytes()
        doc.close()

        result = extract_text_from_pdf(pdf_bytes, "thermo.pdf")
        assert result.filename == "thermo.pdf"
        assert result.total_pages == 1
        assert result.total_chunks >= 1
        assert "thermodynamics" in result.chunks[0].text.lower()


# ─── Retriever unit tests ────────────────────────────────────────

class TestRetriever:
    def test_retrieve_empty_chunks(self):
        from services.retriever import retrieve_relevant_chunks
        results = retrieve_relevant_chunks("some query", [])
        assert results == []

    def test_retrieve_finds_relevant(self):
        from services.retriever import retrieve_relevant_chunks
        from services.document_store import TextChunk

        chunks = [
            TextChunk(text="Thermodynamics deals with heat and energy transfer.", filename="thermo.pdf", page_number=1, chunk_index=0),
            TextChunk(text="Data structures include arrays, linked lists and trees.", filename="dsa.pdf", page_number=1, chunk_index=0),
            TextChunk(text="The Carnot cycle is the most efficient heat engine cycle.", filename="thermo.pdf", page_number=3, chunk_index=1),
        ]

        results = retrieve_relevant_chunks("What is the Carnot cycle?", chunks, top_k=2)
        assert len(results) > 0
        # The Carnot chunk should rank highest
        assert "Carnot" in results[0]["text"]

    def test_retrieve_functional_intent_expansion(self):
        from services.retriever import retrieve_relevant_chunks
        from services.document_store import TextChunk

        chunks = [
            TextChunk(text="Project Name: ThinkFirst AI. An introductory description.", filename="project.pdf", page_number=1, chunk_index=0),
            TextChunk(text="User Flow: The student logs in, asks a question, and the system executes sequential hints.", filename="project.pdf", page_number=7, chunk_index=1),
            TextChunk(text="Test sample dummy text for unrelated module.", filename="test_sample.pdf", page_number=1, chunk_index=0),
        ]

        results = retrieve_relevant_chunks("working of the project", chunks, top_k=2)
        assert len(results) > 0
        # User flow / operational chunk should be retrieved
        retrieved_texts = [r["text"] for r in results]
        assert any("User Flow" in t for t in retrieved_texts)

    def test_chat_restricts_to_selected_document(self):
        import fitz
        from services.pdf_processor import extract_text_from_pdf

        doc1 = fitz.open()
        p1 = doc1.new_page()
        p1.insert_text((72, 72), "Document A specifies quantum computing qubits.")
        bytes1 = doc1.tobytes()
        doc1.close()

        doc2 = fitz.open()
        p2 = doc2.new_page()
        p2.insert_text((72, 72), "Document B specifies organic chemistry hydrocarbons.")
        bytes2 = doc2.tobytes()
        doc2.close()

        client.post("/api/upload", files={"file": ("doc_a.pdf", bytes1, "application/pdf")})
        client.post("/api/upload", files={"file": ("doc_b.pdf", bytes2, "application/pdf")})

        # Query restricted to doc_b should not retrieve doc_a
        from services.document_store import store
        doc_b = store.get_document("doc_b.pdf")
        assert doc_b is not None

        resp = client.post("/api/chat", json={"question": "Tell me about quantum qubits", "document_filename": "non_existent.pdf"})
        assert resp.status_code == 404

    def test_retrieve_filters_out_weak_unrelated_chunks(self):
        from services.retriever import retrieve_relevant_chunks
        from services.document_store import TextChunk

        chunks = [
            TextChunk(text="Thermodynamics deals with heat and energy transfer.", filename="thermo.pdf", page_number=1, chunk_index=0),
            TextChunk(text="Unrelated dummy text about something completely different.", filename="dummy.pdf", page_number=1, chunk_index=0),
        ]

        # Asking a completely unrelated question should return 0 chunks (below threshold)
        results = retrieve_relevant_chunks("quantum entanglement photon spin", chunks)
        assert len(results) == 0

    def test_chat_returns_no_evidence_response_when_unrelated(self):
        import fitz

        doc = fitz.open()
        p = doc.new_page()
        p.insert_text((72, 72), "This chapter covers structural civil engineering bridge designs.")
        pdf_bytes = doc.tobytes()
        doc.close()

        client.post("/api/upload", files={"file": ("bridges.pdf", pdf_bytes, "application/pdf")})

        # Query completely absent from the document
        resp = client.post(
            "/api/chat",
            json={"question": "What is mitochondrial DNA sequencing?", "document_filename": "bridges.pdf"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["chunks_used"] == 0
        assert data["sources"] == []
        assert "could not find relevant supporting evidence" in data["answer"].lower()
