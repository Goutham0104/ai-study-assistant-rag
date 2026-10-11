# AI Study Assistant | Full-Stack RAG Application

A full-stack AI-powered study assistant designed to help engineering students learn from their study materials. Users can upload PDF documents and ask questions about their content. The application retrieves relevant passages and uses a Large Language Model (LLM) to generate document-grounded answers with source-page references.

## 🌐 Live Demo

**Try the application:** https://ai-study-assistant-rag-gamma.vercel.app/

## 📂 GitHub Repository

**Source code:** https://github.com/Goutham0104/ai-study-assistant-rag

## ✨ Features

- **PDF Upload:** Upload PDF documents for processing and analysis.
- **Document-Based Chat:** Ask questions about the content of uploaded documents.
- **Retrieval-Augmented Generation (RAG):** Retrieve relevant text passages to provide context for AI-generated answers.
- **Source References:** Display source-page references to help users verify answers against their documents.
- **Document Isolation:** Keep retrieval scoped to the selected document when switching between PDFs.
- **Context-Grounded Responses:** Handle questions when the selected document does not contain sufficient supporting information.
- **Interactive Dashboard:** Navigate between the dashboard, PDF upload, chat, documents, and about pages.
- **Backend API Tests:** Test core API functionality.

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Lucide React icons

### Backend
- Python
- FastAPI
- PyMuPDF for PDF text extraction
- TF-IDF and cosine similarity for information retrieval
- Ollama for local LLM inference
- Gemma 3 (4B) language model

## 🏗️ Architecture

1. **Upload:** The user uploads a PDF document.
2. **Extract:** PyMuPDF extracts text from the PDF.
3. **Process:** The extracted text is divided into chunks and stored for retrieval.
4. **Retrieve:** TF-IDF and cosine similarity identify relevant passages for the user's question.
5. **Generate:** The retrieved context is passed to the Gemma 3 (4B) model through Ollama.
6. **Respond:** The application returns an answer grounded in the retrieved document content, with source-page references when available.

## 📄 Pages Included

- Landing Page
- Dashboard
- Upload PDF Page
- AI Chat Page
- Documents Page
- About Page

## 📁 Project Structure

```text
ai-study-assistant-rag/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── chat.py
│   │   ├── health.py
│   │   └── upload.py
│   ├── services/
│   │   ├── document_store.py
│   │   ├── ollama_client.py
│   │   ├── pdf_processor.py
│   │   └── retriever.py
│   └── tests/
│       └── test_api.py
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── App.jsx
│   └── index.css
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Python 3.10 or a compatible version
- Ollama installed locally
- The `gemma3:4b` model available in Ollama

### 1. Clone the repository

```bash
git clone https://github.com/Goutham0104/ai-study-assistant-rag.git
cd ai-study-assistant-rag
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required packages:

```bash
pip install -r requirements.txt
```

### 4. Start Ollama

Make sure Ollama is installed and the model is available:

```bash
ollama pull gemma3:4b
```

### 5. Start the backend

From the `backend/` directory:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend API will be available at `http://127.0.0.1:8000`.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 6. Start the frontend

Open a separate terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

### 7. Build the frontend

```bash
npm run build
```

## 🧪 Testing

Run the backend tests from the `backend/` directory:

```bash
python -m pytest
```

## 🎯 Project Objective

To make engineering study materials easier to explore by combining document retrieval with generative AI, allowing students to ask questions and receive answers grounded in their uploaded PDFs.

## 🔮 Future Improvements

- Semantic retrieval using embedding models
- Vector database integration
- Persistent document storage
- Improved retrieval evaluation and relevance ranking
- Deployment of the backend for complete online access

## 📌 Notes

The frontend is deployed on Vercel. The backend uses FastAPI and local Ollama inference. Running the complete application locally requires the backend and Ollama to be configured and running.

The live website's PDF upload and chat functionality depends on the backend being reachable from the deployed frontend.

## 📄 License

See the repository for licensing information.