import { useState, useRef, useEffect } from 'react'
import { chatHistory, chatMessages as initialChatMessages, suggestedPrompts } from '../data/mockData'
import { AlertCircle, BookOpen, CheckCheck, Copy, Loader2, RefreshCw, Search, Send, Sparkles } from 'lucide-react'

function ChatPage() {
  const [messages, setMessages] = useState([])
  const [inputQuestion, setInputQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [availableDocuments, setAvailableDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState('')
  const messagesEndRef = useRef(null)
  const abortControllerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Fetch uploaded documents on mount and auto-select the first document if available
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/documents')
        if (res.ok) {
          const data = await res.json()
          if (data.documents && Array.isArray(data.documents)) {
            setAvailableDocuments(data.documents)
            if (data.documents.length > 0 && !selectedDocument) {
              setSelectedDocument(data.documents[0].filename)
            }
          }
        }
      } catch {
        // Silently continue if backend is starting or offline
      }
    }
    fetchDocs()
  }, [])

  // 1. PDF switching: clear previous messages, citations, input, errors,
  // and abort any in-flight request so pending responses don't leak into new chat
  const handleDocumentChange = (newDocFilename) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setSelectedDocument(newDocFilename)
    setMessages([])
    setInputQuestion('')
    setErrorMessage(null)
    setIsLoading(false)
    setCopiedIndex(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = async (textToSend) => {
    const questionText = (typeof textToSend === 'string' ? textToSend : inputQuestion).trim()
    if (!questionText || isLoading) return

    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    setErrorMessage(null)
    setInputQuestion('')

    const userMessage = {
      role: 'user',
      text: questionText,
      time: getCurrentTime(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // 4. Document isolation: ensure every chat request includes selectedDocument
      const payload = { question: questionText }
      const docToQuery = selectedDocument || (availableDocuments.length > 0 ? availableDocuments[0].filename : null)
      if (docToQuery) {
        payload.document_filename = docToQuery
      }

      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get answer from study assistant')
      }

      const aiMessage = {
        role: 'ai',
        text: data.answer,
        time: getCurrentTime(),
        sources: data.sources || [],
        model: data.model,
        chunksUsed: data.chunks_used,
        originalQuestion: questionText,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled due to PDF switch or navigation; ignore
        return
      }
      setErrorMessage(err.message || 'Network error or backend unreachable')
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleRegenerate = (originalQuestion) => {
    if (originalQuestion) {
      handleSendMessage(originalQuestion)
    }
  }

  // Derive document-specific suggested prompts when a document is selected
  const activeSuggestedPrompts = selectedDocument
    ? [
        `Summarize the key concepts in ${selectedDocument}`,
        `Explain the core mechanism described in ${selectedDocument}`,
        `What are the main requirements and steps in ${selectedDocument}?`,
      ]
    : suggestedPrompts

  return (
    <main className="space-y-6 pb-8">
      <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
        <aside className="surface-card-strong p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Conversation history</p>
              <h1 className="mt-2 text-2xl font-semibold text-[var(--text)]">Study conversations</h1>
            </div>
            <button
              className="btn-secondary px-4 py-2 text-sm"
              onClick={() => {
                setMessages([])
                setErrorMessage(null)
              }}
            >
              New
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 px-4 py-3 text-[var(--muted)] shadow-sm">
              <Search className="h-4 w-4 text-[#8a4a2a]" />
              <input placeholder="Search chats" className="ml-3 w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]" />
            </div>
            {chatHistory.map((chat) => (
              <div key={chat.title} className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)]">
                <p className="font-semibold text-[var(--text)]">{chat.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{chat.preview}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="surface-card-strong flex min-h-[760px] flex-col overflow-hidden p-0">
          <div className="border-b border-[rgba(31,41,55,0.08)] px-6 py-5 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">AI Chat</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Engineering help</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {availableDocuments.length > 0 && (
                  <select
                    value={selectedDocument}
                    onChange={(e) => handleDocumentChange(e.target.value)}
                    className="rounded-full border border-[rgba(31,41,55,0.12)] bg-white px-3 py-1 text-xs font-semibold text-[#8a4a2a] outline-none transition focus:border-[rgba(198,106,61,0.4)]"
                    title="Select PDF document for isolated chat"
                  >
                    {availableDocuments.map((doc) => (
                      <option key={doc.filename} value={doc.filename}>
                        📄 {doc.filename}
                      </option>
                    ))}
                  </select>
                )}
                <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a4a2a]">Context enabled</span>
                <span className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white/80 px-3 py-1 text-xs text-[var(--muted)]">RAG Active</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-7">
            <div className="space-y-5">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center p-6 text-[var(--muted)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(198,106,61,0.08)] text-[#8a4a2a]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--text)]">
                    {selectedDocument ? `Chatting with ${selectedDocument}` : 'Select a PDF document'}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6">
                    Ask questions specifically about this document. Answers and citations are strictly grounded in its contents.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[min(88%,760px)] rounded-[24px] border px-5 py-4 text-sm leading-7 shadow-sm ${
                      message.role === 'user'
                        ? 'border-[rgba(198,106,61,0.14)] bg-[rgba(198,106,61,0.08)] text-[var(--text)]'
                        : 'border-[rgba(31,41,55,0.08)] bg-white/90 text-[var(--text)]'
                    }`}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a4a2a]">
                          {message.role === 'user' ? 'You' : 'Assistant'}
                        </p>
                        <span className="text-xs text-[var(--muted)]">{message.time}</span>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-base leading-7">{message.text}</p>

                      {/* Source citations */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 border-t border-[rgba(31,41,55,0.08)] pt-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8a4a2a]">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Sources ({message.sources.length})</span>
                          </div>
                          <div className="mt-2 space-y-2">
                            {message.sources.map((src, sIdx) => (
                              <div
                                key={sIdx}
                                className="rounded-[14px] border border-[rgba(31,41,55,0.06)] bg-[rgba(198,106,61,0.04)] p-2.5 text-xs text-[var(--muted)]"
                              >
                                <div className="flex items-center justify-between font-medium text-[var(--text)]">
                                  <span>{src.filename} — Page {src.page_number}</span>
                                  <span className="text-[10px] text-[#8a4a2a]">Score: {(src.relevance_score * 100).toFixed(0)}%</span>
                                </div>
                                <p className="mt-1 line-clamp-2 italic">{src.excerpt}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {message.role === 'ai' ? (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="btn-secondary px-3 py-2 text-xs"
                            onClick={() => handleCopy(message.text, index)}
                          >
                            <Copy className="mr-2 h-3.5 w-3.5" />
                            {copiedIndex === index ? 'Copied!' : 'Copy response'}
                          </button>
                          {message.originalQuestion && (
                            <button
                              type="button"
                              className="btn-secondary px-3 py-2 text-xs"
                              onClick={() => handleRegenerate(message.originalQuestion)}
                              disabled={isLoading}
                            >
                              <RefreshCw className="mr-2 h-3.5 w-3.5" />
                              Regenerate
                            </button>
                          )}
                          {message.sources && message.sources.length > 0 && (
                            <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#8a4a2a]">
                              Sources attached
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-white/90 px-5 py-4 text-sm text-[var(--muted)] shadow-sm">
                    <div className="flex items-center gap-2 text-[#8a4a2a]">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-semibold uppercase tracking-[0.24em]">Assistant is thinking</span>
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgba(198,106,61,0.45)]" />
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgba(198,106,61,0.45)] [animation-delay:150ms]" />
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgba(198,106,61,0.45)] [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <div>
                      <p className="font-semibold">Unable to complete request</p>
                      <p className="mt-1 text-xs text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-[rgba(31,41,55,0.08)] px-6 py-5 sm:px-7">
            <div className="rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
              <p className="text-sm font-semibold text-[var(--text)]">Suggested prompts</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {activeSuggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white px-4 py-2 text-sm text-[var(--muted)] transition hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)] hover:text-[var(--text)] disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="mt-4 flex flex-col gap-3 rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your engineering PDF..."
                disabled={isLoading}
                className="focus-ring min-w-0 flex-1 rounded-full border border-[rgba(31,41,55,0.08)] bg-white px-5 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuestion.trim()}
                className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    Asking...
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {[
                'Reference sources are displayed inline for every answer.',
                'Markdown rendering keeps explanations structured and readable.',
                'Code examples can be copied directly from the response panel.',
              ].map((item) => (
                <div key={item} className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-[rgba(198,106,61,0.05)] p-4 text-sm text-[var(--muted)]">
                  <div className="flex items-center gap-2 font-semibold text-[var(--text)]"><CheckCheck className="h-4 w-4 text-[#8a4a2a]" /> Premium chat affordance</div>
                  <p className="mt-2">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ChatPage
