import { useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, FileText, Loader2, Upload, Wand2 } from 'lucide-react'
import { uploadedPdfs as initialUploadedPdfs } from '../data/mockData'

const supportedFormats = ['PDF', 'TXT', 'DOCX']

function UploadPage() {
  const fileInputRef = useRef(null)
  const [documentsList, setDocumentsList] = useState(initialUploadedPdfs)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null) // { type: 'success' | 'error', message: string }

  const statusStyles = (status) => {
    if (status === 'Indexed') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (status === 'Processing') return 'bg-amber-50 text-amber-700 border-amber-100'
    return 'bg-slate-50 text-slate-600 border-slate-200'
  }

  const handleOpenPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset input so re-selecting same file triggers onChange
    event.target.value = ''

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadStatus({
        type: 'error',
        message: 'Please select a valid PDF file.',
      })
      return
    }

    setIsUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed')
      }

      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded "${data.filename}" (${data.total_pages} page${data.total_pages === 1 ? '' : 's'}, ${data.total_chunks} chunks).`,
      })

      setDocumentsList((prev) => [
        {
          name: data.filename,
          pages: data.total_pages,
          status: 'Indexed',
          progress: 100,
        },
        ...prev.filter((doc) => doc.name !== data.filename),
      ])
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: err.message || 'Failed to upload PDF. Please check server connection.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="space-y-6 pb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="hero-pill">Upload pipeline</span>
            <h1 className="mt-5 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">Add new documents with a premium drag-and-drop flow</h1>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">
              Bring lecture notes, lab reports, and exam practice papers into one searchable AI workspace.
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleOpenPicker}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                Uploading...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Upload PDF
                <Upload className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {uploadStatus && (
          <div
            className={`mt-6 rounded-[18px] border p-4 text-sm font-medium ${
              uploadStatus.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {uploadStatus.message}
          </div>
        )}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="surface-card-strong subtle-grid border-dashed p-8 text-center sm:p-10">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
              <div className="flex h-18 w-18 items-center justify-center rounded-[28px] bg-[rgba(198,106,61,0.08)] text-[#8a4a2a] shadow-sm">
                <Upload className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-semibold text-[var(--text)]">Drag & drop study materials</h2>
              <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
                Upload PDF lecture notes, textbooks, and study guides to build a reference-ready knowledge base instantly.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleOpenPicker}
                  disabled={isUploading}
                >
                  Select files
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <div className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white/80 px-4 py-2 text-sm text-[var(--muted)]">Drop anywhere in this area</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="surface-card-strong p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Processing</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--text)]">Pipeline status</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">Your uploaded documents are indexed and prepared for contextual search.</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
                  <p className="text-sm text-[var(--muted)]">Queued PDFs</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--text)]">3 documents</p>
                </div>
                <div className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
                  <p className="text-sm text-[var(--muted)]">Expected indexing time</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--text)]">~2 min</p>
                </div>
              </div>
            </div>

            <div className="surface-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Supported formats</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {supportedFormats.map((format) => (
                  <span key={format} className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a4a2a]">{format}</span>
                ))}
              </div>
              <div className="mt-5 rounded-[18px] bg-[rgba(198,106,61,0.05)] p-4 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2 font-semibold text-[var(--text)]"><Wand2 className="h-4 w-4 text-[#8a4a2a]" /> Smart extraction enabled</div>
                <p className="mt-2">Beautiful progress states help users understand what happens after upload.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {documentsList.map((file) => (
            <div key={file.name} className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-[rgba(198,106,61,0.18)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[#8a4a2a]"><FileText className="h-4 w-4" /><p className="text-sm font-semibold text-[var(--text)]">{file.name}</p></div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{file.pages} pages</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles(file.status)}`}>{file.status}</span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[rgba(31,41,55,0.08)]">
                <div className="h-full rounded-full bg-[linear-gradient(135deg,#c66a3d_0%,#9f4f2a_100%)]" style={{ width: `${file.progress}%` }} />
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">Progress: {file.progress}%</p>
            </div>
          ))}
        </div>

        <div className="surface-card-strong mt-8 p-6 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Empty state</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Upload complete</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">Your documents are queued for indexing. Once processing is complete, they appear in AI chat and the documents table.</p>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-[rgba(198,106,61,0.08)] px-4 py-3 text-sm font-semibold text-[#8a4a2a]">
              <CheckCircle2 className="h-4 w-4" />
              Ready for retrieval
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default UploadPage
