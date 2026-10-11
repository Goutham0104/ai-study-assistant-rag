import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Send,
  BookOpen,
  Copy,
  RefreshCw,
  Trash2,
  ChevronRight,
  HelpCircle,
  FileCheck,
  Search,
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

const DEFAULT_EXAMPLE_QUESTIONS = [
  'What is the core objective or problem statement of this document?',
  'Explain the key methodology, steps, or user flow described.',
  'What are the primary formulas, algorithms, or technical specifications?',
  'Summarize the main conclusions, findings, or recommendations.',
]

function UploadPage() {
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Document state (real from API)
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState('')
  const [isLoadingDocs, setIsLoadingDocs] = useState(true)

  // Upload state
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null) // { type: 'success' | 'error', message: string, filename?: string }

  // Chat state
  const [messages, setMessages] = useState([])
  const [inputQuestion, setInputQuestion] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [chatError, setChatError] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAsking])

  // Fetch documents from backend on mount
  const fetchDocuments = useCallback(async (autoSelectLatest = false, latestFilename = null) => {
    try {
      setIsLoadingDocs(true)
      const res = await fetch(API_ENDPOINTS.DOCUMENTS)
      if (res.ok) {
        const data = await res.json()
        const docs = Array.isArray(data.documents) ? data.documents : []
        setDocuments(docs)

        if (latestFilename) {
          setSelectedDoc(latestFilename)
        } else if (autoSelectLatest && docs.length > 0) {
          setSelectedDoc(docs[0].filename)
        } else if (docs.length > 0 && !selectedDoc) {
          setSelectedDoc(docs[0].filename)
        }
      }
    } catch {
      // Backend may be warming up
    } finally {
      setIsLoadingDocs(false)
    }
  }, [selectedDoc])

  useEffect(() => {
    fetchDocuments(true)
  }, [fetchDocuments])

  // Handle file upload
  const handleUploadFile = async (file) => {
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadStatus({
        type: 'error',
        message: 'Please choose a valid PDF file (.pdf extension).',
      })
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File exceeds 20MB limit. Please upload a smaller PDF.',
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(15)
    setUploadStatus(null)

    // Progress simulation while uploading & extracting
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 85) return prev + 12
        return prev
      })
    }, 250)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed')
      }

      setUploadStatus({
        type: 'success',
        filename: data.filename,
        message: `Successfully indexed "${data.filename}" (${data.total_pages} page${data.total_pages === 1 ? '' : 's'}, ${data.total_chunks} chunks). Ready for questions!`,
      })

      // Refresh documents and select the newly uploaded file
      await fetchDocuments(false, data.filename)
      // Reset chat for the new file
      setMessages([])
      setChatError(null)
    } catch (err) {
      clearInterval(progressInterval)
      setUploadProgress(0)
      setUploadStatus({
        type: 'error',
        message: err.message || 'Failed to connect to backend server. Please verify your connection.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleUploadFile(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUploadFile(file)
    }
    e.target.value = ''
  }

  // Handle switching document
  const handleSelectDocument = (filename) => {
    if (filename === selectedDoc) return
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setSelectedDoc(filename)
    setMessages([])
    setChatError(null)
    setIsAsking(false)
    setInputQuestion('')
  }

  // Send question to RAG
  const handleSendQuestion = async (questionTextOverride) => {
    const text = (typeof questionTextOverride === 'string' ? questionTextOverride : inputQuestion).trim()
    if (!text || isAsking) return

    if (!selectedDoc && documents.length === 0) {
      setChatError('Please upload a PDF first before asking questions.')
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    const userMessage = {
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputQuestion('')
    setChatError(null)
    setIsAsking(true)

    try {
      const payload = { question: text }
      const docTarget = selectedDoc || (documents.length > 0 ? documents[0].filename : null)
      if (docTarget) {
        payload.document_filename = docTarget
      }

      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate answer from study assistant')
      }

      const aiMessage = {
        role: 'ai',
        text: data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        model: data.model,
        chunksUsed: data.chunks_used,
        originalQuestion: text,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      if (err.name === 'AbortError') return
      setChatError(err.message || 'Error communicating with the study assistant backend.')
    } finally {
      setIsAsking(false)
      abortControllerRef.current = null
    }
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Dynamic suggested questions for selected doc
  const currentExampleQuestions = selectedDoc
    ? [
        `What are the key concepts explained in ${selectedDoc}?`,
        `Summarize the step-by-step process or mechanism in ${selectedDoc}`,
        `What are the main requirements and formulas in ${selectedDoc}?`,
        `What conclusions or key takeaways are highlighted in ${selectedDoc}?`,
      ]
    : DEFAULT_EXAMPLE_QUESTIONS

  return (
    <main className="space-y-6 pb-12">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ── SECTION 1: PROMINENT HERO UPLOAD AREA (FIRST SCREEN) ── */}
      <section className="surface-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="hero-pill">RAG Study Engine</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl lg:text-[40px]">
              Upload your PDF and start studying instantly
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              Drop textbooks, lecture notes, research papers, or syllabus guides. Our AI indexes the content into vector chunks with strict source-page citations.
            </p>
          </div>

          {selectedDoc && (
            <div className="flex items-center gap-3 rounded-2xl border border-[rgba(198,106,61,0.2)] bg-[rgba(198,106,61,0.06)] p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c66a3d_0%,#9f4f2a_100%)] text-white shadow-sm">
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 pr-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a4a2a]">Active Document</p>
                <p className="truncate text-sm font-semibold text-[var(--text)]" title={selectedDoc}>{selectedDoc}</p>
              </div>
            </div>
          )}
        </div>

        {/* Large Prominent Drag-and-Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`group mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-12 ${
            isDragging
              ? 'scale-[1.01] border-[#c66a3d] bg-[rgba(198,106,61,0.08)] shadow-glow'
              : 'border-[rgba(198,106,61,0.25)] bg-[linear-gradient(180deg,#ffffff_0%,#faf6f0_100%)] hover:border-[#c66a3d] hover:bg-[rgba(198,106,61,0.03)] hover:shadow-soft'
          }`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[rgba(198,106,61,0.1)] text-[#8a4a2a] transition duration-300 group-hover:scale-110 group-hover:bg-[linear-gradient(135deg,#c66a3d_0%,#9f4f2a_100%)] group-hover:text-white group-hover:shadow-glow">
            {isUploading ? (
              <Loader2 className="h-9 w-9 animate-spin text-[#c66a3d] group-hover:text-white" />
            ) : (
              <Upload className="h-9 w-9" />
            )}
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            {isDragging ? 'Drop your PDF right here' : 'Drag & Drop your PDF here'}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
            Supports PDF files up to 20MB. Lecture slides, exam notes, lab manuals, and research papers are processed in seconds.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              className="btn-primary px-8 py-3.5 text-base shadow-glow hover:scale-105"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing PDF...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Choose PDF from Computer
                </>
              )}
            </button>
            <span className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white/90 px-4 py-2 text-xs font-medium text-[var(--muted)] shadow-sm">
              PyMuPDF extraction & TF-IDF indexing
            </span>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="mt-8 w-full max-w-lg">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                <span className="text-[#8a4a2a]">Extracting text & creating chunks...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-[rgba(31,41,55,0.08)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(135deg,#c66a3d_0%,#9f4f2a_100%)] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Notification Message */}
        {uploadStatus && (
          <div
            className={`mt-6 flex items-start gap-3 rounded-[20px] border p-4.5 text-sm shadow-sm transition-all duration-300 ${
              uploadStatus.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-red-200 bg-red-50 text-red-900'
            }`}
          >
            {uploadStatus.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {uploadStatus.type === 'success' ? 'Upload & Indexing Complete' : 'Upload Failed'}
              </p>
              <p className="mt-1 leading-6">{uploadStatus.message}</p>
            </div>
          </div>
        )}
      </section>

      {/* ── SECTION 2: WORKSPACE GRID (DOCUMENTS & CHAT) ── */}
      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* LEFT COLUMN: UPLOADED DOCUMENTS & EXAMPLE QUESTIONS */}
        <aside className="space-y-6">
          {/* Document Switcher & List */}
          <div className="surface-card-strong p-6">
            <div className="flex items-center justify-between border-b border-[rgba(31,41,55,0.08)] pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#8a4a2a]" />
                <h3 className="text-lg font-bold text-[var(--text)]">Uploaded Documents</h3>
              </div>
              <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-2.5 py-0.5 text-xs font-semibold text-[#8a4a2a]">
                {documents.length}
              </span>
            </div>

            {isLoadingDocs ? (
              <div className="flex items-center justify-center py-8 text-sm text-[var(--muted)]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#8a4a2a]" />
                Loading indexed documents...
              </div>
            ) : documents.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--muted)]">
                <p className="font-medium text-[var(--text)]">No documents uploaded yet</p>
                <p className="mt-1 text-xs">Drop a PDF above to create your knowledge base.</p>
              </div>
            ) : (
              <div className="mt-4 max-h-[320px] space-y-2.5 overflow-y-auto pr-1">
                {documents.map((doc) => {
                  const isSelected = selectedDoc === doc.filename
                  return (
                    <button
                      key={doc.filename}
                      type="button"
                      onClick={() => handleSelectDocument(doc.filename)}
                      className={`group flex w-full items-start justify-between rounded-2xl border p-3.5 text-left transition duration-200 ${
                        isSelected
                          ? 'border-[#c66a3d] bg-[rgba(198,106,61,0.08)] shadow-sm'
                          : 'border-[rgba(31,41,55,0.08)] bg-white/70 hover:border-[rgba(198,106,61,0.3)] hover:bg-white'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-[#c66a3d]' : 'bg-slate-300'}`} />
                          <p className={`truncate text-sm font-semibold ${isSelected ? 'text-[#8a4a2a]' : 'text-[var(--text)]'}`}>
                            {doc.filename}
                          </p>
                        </div>
                        <p className="mt-1 pl-4 text-xs text-[var(--muted)]">
                          {doc.total_pages} page{doc.total_pages === 1 ? '' : 's'} • {doc.total_chunks} chunks
                        </p>
                      </div>
                      {isSelected ? (
                        <span className="rounded-full bg-[#c66a3d] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Active
                        </span>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[var(--muted)] opacity-0 transition group-hover:opacity-100" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Example Questions Widget */}
          <div className="surface-card-strong p-6">
            <div className="flex items-center gap-2 border-b border-[rgba(31,41,55,0.08)] pb-4">
              <HelpCircle className="h-5 w-5 text-[#8a4a2a]" />
              <h3 className="text-lg font-bold text-[var(--text)]">Example Questions</h3>
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
              Click any prompt to ask the AI assistant directly based on {selectedDoc ? `"${selectedDoc}"` : 'your documents'}:
            </p>
            <div className="mt-4 space-y-2">
              {currentExampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isAsking}
                  onClick={() => handleSendQuestion(q)}
                  className="flex w-full items-start gap-2.5 rounded-xl border border-[rgba(31,41,55,0.06)] bg-[rgba(198,106,61,0.04)] p-3 text-left text-xs font-medium text-[var(--text)] transition hover:border-[#c66a3d] hover:bg-[rgba(198,106,61,0.09)] disabled:opacity-50"
                >
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8a4a2a]" />
                  <span className="leading-5">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: INTERACTIVE CHAT INTERFACE WITH CITATIONS */}
        <section className="surface-card-strong flex min-h-[640px] flex-col overflow-hidden p-0">
          {/* Chat Header */}
          <div className="border-b border-[rgba(31,41,55,0.08)] px-6 py-4.5 sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-xl font-bold text-[var(--text)]">AI Study Assistant</h2>
                </div>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {selectedDoc ? (
                    <span>Strictly querying <strong className="text-[var(--text)]">{selectedDoc}</strong></span>
                  ) : (
                    <span>Upload or select a PDF on the left to start grounded question-answering</span>
                  )}
                </p>
              </div>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMessages([])
                    setChatError(null)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(31,41,55,0.1)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:border-[#c66a3d] hover:text-[#8a4a2a]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear chat
                </button>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-7">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[340px] flex-col items-center justify-center text-center p-6 text-[var(--muted)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(198,106,61,0.08)] text-[#8a4a2a]">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--text)]">
                  {selectedDoc ? `Ready to answer questions about ${selectedDoc}` : 'No document selected'}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6">
                  {selectedDoc
                    ? 'Type a question below or choose an example question from the left. Answers are generated with precise page citations.'
                    : 'Please drag-and-drop or choose a PDF above to begin.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[min(90%,720px)] rounded-[24px] border p-5 text-sm leading-7 shadow-sm ${
                        message.role === 'user'
                          ? 'border-[rgba(198,106,61,0.2)] bg-[rgba(198,106,61,0.08)] text-[var(--text)]'
                          : 'border-[rgba(31,41,55,0.08)] bg-white/95 text-[var(--text)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-[rgba(31,41,55,0.06)] pb-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a4a2a]">
                          {message.role === 'user' ? 'You' : 'AI Study Assistant'}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{message.time}</span>
                      </div>

                      <div className="mt-3 whitespace-pre-wrap text-[15px] leading-7 font-normal">
                        {message.text}
                      </div>

                      {/* Explicit Page Citations */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-5 border-t border-[rgba(31,41,55,0.08)] pt-3.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8a4a2a]">
                            <BookOpen className="h-4 w-4" />
                            <span>Source Citations ({message.sources.length})</span>
                          </div>

                          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                            {message.sources.map((src, sIdx) => (
                              <div
                                key={sIdx}
                                className="rounded-xl border border-[rgba(198,106,61,0.18)] bg-[rgba(198,106,61,0.04)] p-3 text-xs"
                              >
                                <div className="flex items-center justify-between font-semibold text-[var(--text)]">
                                  <span className="truncate pr-1">📄 {src.filename}</span>
                                  <span className="shrink-0 rounded-md bg-[#8a4a2a] px-2 py-0.5 text-[10px] font-bold text-white">
                                    Page {src.page_number}
                                  </span>
                                </div>
                                <p className="mt-1.5 line-clamp-3 text-[11px] italic text-[var(--muted)] leading-5">
                                  "{src.excerpt}"
                                </p>
                                <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--muted)]">
                                  <span>Relevance</span>
                                  <span className="font-semibold text-[#8a4a2a]">
                                    {(src.relevance_score * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Action Toolbar */}
                      {message.role === 'ai' && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[rgba(31,41,55,0.06)] pt-3">
                          <button
                            type="button"
                            onClick={() => handleCopy(message.text, index)}
                            className="btn-secondary px-3 py-1.5 text-xs"
                          >
                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                            {copiedIndex === index ? 'Copied to clipboard' : 'Copy answer'}
                          </button>
                          {message.originalQuestion && (
                            <button
                              type="button"
                              onClick={() => handleSendQuestion(message.originalQuestion)}
                              disabled={isAsking}
                              className="btn-secondary px-3 py-1.5 text-xs"
                            >
                              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                              Regenerate
                            </button>
                          )}
                          <span className="ml-auto text-[10px] text-[var(--muted)]">
                            Model: {message.model || 'LLM'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAsking && (
                  <div className="flex justify-start">
                    <div className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-white/95 px-5 py-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 text-[#8a4a2a]">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Searching chunks & generating answer...</span>
                      </div>
                      <div className="mt-3 flex gap-1.5">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#c66a3d]" />
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#c66a3d] [animation-delay:150ms]" />
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#c66a3d] [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-sm">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <div>
                      <p className="font-semibold">Unable to process question</p>
                      <p className="mt-1 text-xs">{chatError}</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="border-t border-[rgba(31,41,55,0.08)] bg-white/60 p-4 sm:p-5">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendQuestion()
              }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder={
                  selectedDoc
                    ? `Ask anything about ${selectedDoc}...`
                    : 'Upload a PDF to ask questions...'
                }
                disabled={isAsking}
                className="focus-ring flex-1 rounded-full border border-[rgba(31,41,55,0.12)] bg-white px-5 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
              <button
                type="submit"
                disabled={isAsking || !inputQuestion.trim()}
                className="btn-primary px-6 py-3 shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAsking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Question
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default UploadPage
