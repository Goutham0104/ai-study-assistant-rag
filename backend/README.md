# AI Study Assistant — RAG Backend

Minimal PDF question-answering backend using **FastAPI**, **PyMuPDF**, **scikit-learn (TF-IDF)**, and **Ollama (gemma3:4b)**.

## Architecture

```
POST /api/upload (PDF) ──► PyMuPDF extraction ──► Chunking ──► In-memory store
                                                                     │
POST /api/chat (question) ──► TF-IDF retrieval ──► Ollama RAG ◄─────┘
                                                       │
                                              ◄── JSON response + sources
```

## Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.11+ |
| Ollama | Installed and running |
| Model | `gemma3:4b` pulled locally |
| RAM | 16 GB recommended |

## Windows Setup (step by step)

### 1. Install Ollama and pull the model

```powershell
# Download Ollama from https://ollama.com and install
# Then pull the model:
ollama pull gemma3:4b
```

### 2. Verify Ollama is running

```powershell
$body = @{
    model = "gemma3:4b"
    messages = @(
        @{
            role = "user"
            content = "Reply exactly: Gemma API is working."
        }
    )
    stream = $false
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod `
    -Uri "http://localhost:11434/api/chat" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$response.message.content
```

### 3. Create a virtual environment

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```powershell
pip install -r requirements.txt
```

### 5. Run the backend server

```powershell
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API is now available at **http://localhost:8000**.

- Interactive docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

### 6. Run tests

```powershell
python -m pytest tests/ -v
```

## API Endpoints

### `GET /api/health`

Check backend status and Ollama connectivity.

**Response:**
```json
{
  "status": "ok",
  "backend": "running",
  "model": "gemma3:4b",
  "documents_loaded": 0,
  "ollama": {
    "ollama_reachable": true,
    "model_available": true,
    "detail": "Ollama is running and model is available."
  }
}
```

### `POST /api/upload`

Upload a PDF for text extraction and indexing.

**Request:** `multipart/form-data` with field `file` (PDF only, max 20 MB).

```powershell
curl -X POST http://localhost:8000/api/upload -F "file=@lecture_notes.pdf"
```

**Response:**
```json
{
  "status": "success",
  "filename": "lecture_notes.pdf",
  "total_pages": 42,
  "total_chunks": 187,
  "documents_loaded": 1
}
```

### `POST /api/chat`

Ask a question about uploaded documents.

**Request:**
```json
{
  "question": "What is the Carnot cycle?"
}
```

```powershell
$body = '{"question": "What is the Carnot cycle?"}' 
Invoke-RestMethod -Uri "http://localhost:8000/api/chat" -Method Post -ContentType "application/json" -Body $body
```

**Response:**
```json
{
  "answer": "The Carnot cycle is a theoretical thermodynamic cycle...",
  "sources": [
    {
      "filename": "thermodynamics.pdf",
      "page_number": 12,
      "excerpt": "The Carnot cycle consists of four reversible processes...",
      "relevance_score": 0.7823
    }
  ],
  "model": "gemma3:4b",
  "chunks_used": 3
}
```

## Error Handling

| Scenario | HTTP Code | Detail |
|---|---|---|
| Non-PDF file uploaded | 400 | "Only PDF files are accepted" |
| Empty PDF / no text | 422 | "PDF appears to be empty" |
| No documents uploaded before chat | 400 | "No documents have been uploaded" |
| Ollama not running | 503 | "Cannot connect to Ollama" |
| Model not found | 503 | "Ollama returned HTTP ..." |
| Empty question | 422 | Pydantic validation error |

## Project Structure

```
backend/
├── main.py                    # FastAPI app, CORS, route registration
├── requirements.txt           # Python dependencies
├── README.md                  # This file
├── routes/
│   ├── __init__.py
│   ├── health.py              # GET /api/health
│   ├── upload.py              # POST /api/upload
│   └── chat.py                # POST /api/chat
├── services/
│   ├── __init__.py
│   ├── document_store.py      # In-memory document/chunk storage
│   ├── pdf_processor.py       # PyMuPDF text extraction + chunking
│   ├── retriever.py           # TF-IDF cosine-similarity retrieval
│   └── ollama_client.py       # Async Ollama API client
└── tests/
    ├── __init__.py
    └── test_api.py            # Pytest API + unit tests
```
