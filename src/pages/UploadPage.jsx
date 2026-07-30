import { uploadedPdfs } from '../data/mockData'
import { Upload, ArrowRight } from 'lucide-react'

function UploadPage() {
  const statusStyles = (status) => {
    if (status === 'Indexed') return 'bg-emerald-100 text-emerald-700'
    if (status === 'Processing') return 'bg-amber-100 text-amber-700'
    return 'bg-slate-100 text-slate-600'
  }

  return (
    <main className="space-y-8">
      <section className="section-card p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Upload PDF</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Add new engineering notes</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">Bring your lecture notes, lab reports, and exam practice papers into one searchable AI workspace.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-95">
            Upload PDF
            <Upload className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-950/90 p-10 text-center shadow-soft">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-900/20 text-sky-300">
                <Upload className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Drag & drop study materials</h2>
              <p className="max-w-md text-sm leading-6 text-slate-400">Upload PDF lecture notes, textbooks, and study guides to build a reference-ready knowledge base instantly.</p>
              <button className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Select files
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Upload status</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Processing pipeline</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">Your uploaded documents are being indexed and prepared for contextual search.</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
                <p className="text-sm text-slate-300">Queued PDFs</p>
                <p className="mt-3 text-3xl font-semibold text-white">3 documents</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
                <p className="text-sm text-slate-300">Expected indexing time</p>
                <p className="mt-3 text-3xl font-semibold text-white"><span className="text-sky-300">~2 min</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {uploadedPdfs.map((file) => (
            <div key={file.name} className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-5 shadow-soft transition hover:border-sky-400/30">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{file.name}</p>
                  <p className="mt-2 text-sm text-slate-400">{file.pages} pages</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles(file.status)}`}>
                  {file.status}
                </span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED]" style={{ width: `${file.progress}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-400">Progress: {file.progress}%</p>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 text-slate-300 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Upload complete</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Your documents are queued for indexing. Once processing is complete, they will appear in the AI chat and documents table.</p>
        </div>
      </section>
    </main>
  )
}

export default UploadPage
