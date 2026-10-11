import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  FileText,
  Upload,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

function DocumentsPage() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(null)

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(API_ENDPOINTS.DOCUMENTS)
        if (res.ok) {
          const data = await res.json()
          const docs = Array.isArray(data.documents) ? data.documents : []
          setDocuments(docs)
          if (docs.length > 0) {
            setSelectedDoc(docs[0])
          }
        }
      } catch {
        // Backend offline or loading
      } finally {
        setIsLoading(false)
      }
    }
    fetchDocs()
  }, [])

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="space-y-6 pb-8">
      <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="hero-pill">Document library</span>
            <h1 className="mt-5 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">
              Indexed Study PDFs
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">
              Browse all uploaded textbooks, lecture notes, and study files currently active in your RAG vector knowledge base.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a4a2a]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus-ring w-full rounded-full border border-[rgba(31,41,55,0.08)] bg-white/85 py-3 pl-12 pr-4 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                placeholder="Search uploaded documents..."
              />
            </div>
            <button
              onClick={() => navigate('/upload')}
              className="btn-primary gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload New PDF
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Documents Table */}
          <div className="surface-card-strong p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-[rgba(31,41,55,0.08)] px-1 pb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <FileText className="h-4 w-4 text-[#8a4a2a]" />
                Document Store ({filteredDocs.length})
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-sm text-[var(--muted)]">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#8a4a2a]" />
                Loading documents...
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="py-16 text-center text-sm text-[var(--muted)]">
                <p className="text-base font-semibold text-[var(--text)]">No indexed documents found</p>
                <p className="mt-2 text-xs">
                  {searchQuery ? 'Try a different search term.' : 'Upload your first PDF to begin.'}
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="btn-secondary mt-5"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload PDF Now
                </button>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-[20px] border border-[rgba(31,41,55,0.08)] bg-white/85 shadow-sm">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-[rgba(198,106,61,0.04)] text-[var(--muted)]">
                    <tr>
                      <th className="px-6 py-4">Filename</th>
                      <th className="px-6 py-4">Pages</th>
                      <th className="px-6 py-4">Chunks</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(31,41,55,0.06)] bg-white">
                    {filteredDocs.map((doc) => {
                      const isSelected = selectedDoc?.filename === doc.filename
                      return (
                        <tr
                          key={doc.filename}
                          onClick={() => setSelectedDoc(doc)}
                          className={`cursor-pointer transition ${
                            isSelected
                              ? 'bg-[rgba(198,106,61,0.08)] font-semibold'
                              : 'hover:bg-[rgba(198,106,61,0.04)]'
                          }`}
                        >
                          <td className="px-6 py-4 text-[var(--text)]">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-[#8a4a2a]" />
                              <span>{doc.filename}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[var(--muted)]">{doc.total_pages}</td>
                          <td className="px-6 py-4 text-[var(--muted)]">{doc.total_chunks}</td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 border border-emerald-100">
                              Indexed
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Selected File Details */}
          <div className="space-y-4">
            <div className="surface-card-strong p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">
                    Active File
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Document Details</h2>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              {selectedDoc ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-[20px] border border-[rgba(31,41,55,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f9f5ef_100%)] p-5 shadow-sm">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a4a2a]">
                      {selectedDoc.filename}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/90 p-3 border border-[rgba(31,41,55,0.06)]">
                        <p className="text-xs text-[var(--muted)]">Total Pages</p>
                        <p className="text-xl font-bold text-[var(--text)]">{selectedDoc.total_pages}</p>
                      </div>
                      <div className="rounded-xl bg-white/90 p-3 border border-[rgba(31,41,55,0.06)]">
                        <p className="text-xs text-[var(--muted)]">Vector Chunks</p>
                        <p className="text-xl font-bold text-[var(--text)]">{selectedDoc.total_chunks}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                      Indexed and ready for RAG retrieval with cited references and strict grounding.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/upload')}
                    className="btn-primary w-full gap-2 justify-center"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Open Chat with this PDF
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-[var(--muted)]">
                  Select a document from the table to view details.
                </div>
              )}
            </div>

            {/* Quick summary card */}
            <div className="surface-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">
                RAG Pipeline Status
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
                  <p className="text-xs text-[var(--muted)]">Active Documents</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--text)]">{documents.length}</p>
                </div>
                <div className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
                  <p className="text-xs text-[var(--muted)]">Total Chunks</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--text)]">
                    {documents.reduce((acc, d) => acc + (d.total_chunks || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DocumentsPage
