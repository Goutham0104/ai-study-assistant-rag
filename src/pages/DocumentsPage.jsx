import { Search, SlidersHorizontal, Grid3X3, List, Eye, Tag, ArrowUpDown, FileText } from 'lucide-react'
import { documents } from '../data/mockData'

function DocumentsPage() {
  const statusStyles = (status) => {
    if (status === 'Indexed') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (status === 'Processing') return 'bg-amber-50 text-amber-700 border-amber-100'
    return 'bg-slate-50 text-slate-600 border-slate-200'
  }

  return (
    <main className="space-y-6 pb-8">
      <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="hero-pill">Document library</span>
            <h1 className="mt-5 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">Uploaded study PDFs</h1>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">Browse indexed course files and keep document status visible from a calm, enterprise-style workspace.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a4a2a]" />
              <input className="focus-ring w-full rounded-full border border-[rgba(31,41,55,0.08)] bg-white/85 py-3 pl-12 pr-4 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]" placeholder="Search documents" />
            </div>
            <button className="btn-secondary gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-card-strong p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-[rgba(31,41,55,0.08)] px-1 pb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <FileText className="h-4 w-4 text-[#8a4a2a]" />
                File explorer
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary px-4 py-2 text-sm gap-2"><Grid3X3 className="h-4 w-4" /> Grid</button>
                <button className="btn-secondary px-4 py-2 text-sm gap-2"><List className="h-4 w-4" /> List</button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[20px] border border-[rgba(31,41,55,0.08)] bg-white/85 shadow-sm">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[rgba(198,106,61,0.04)] text-[var(--muted)]">
                  <tr>
                    <th className="px-6 py-4">File name</th>
                    <th className="px-6 py-4">Pages</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Upload date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(31,41,55,0.06)] bg-white">
                  {documents.map((doc) => (
                    <tr key={doc.name} className="transition hover:bg-[rgba(198,106,61,0.04)]">
                      <td className="px-6 py-5 font-medium text-[var(--text)]">{doc.name}</td>
                      <td className="px-6 py-5 text-[var(--muted)]">{doc.pages}</td>
                      <td className="px-6 py-5">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles(doc.status)}`}>{doc.status}</span>
                      </td>
                      <td className="px-6 py-5 text-[var(--muted)]">{doc.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="surface-card-strong p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Preview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Selected file</h2>
                </div>
                <Eye className="h-5 w-5 text-[#8a4a2a]" />
              </div>
              <div className="mt-5 rounded-[20px] border border-[rgba(31,41,55,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f9f5ef_100%)] p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.28em] text-[#8a4a2a]">Signal Processing.pdf</p>
                <p className="mt-3 text-3xl font-semibold text-[var(--text)]">48 pages</p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Indexed, searchable, and ready for grounded AI responses with reference citations.</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] bg-[rgba(198,106,61,0.05)] p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-[#8a4a2a]">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Lecture', 'Indexed', 'Exam prep'].map((tag) => (
                      <span key={tag} className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white px-3 py-1 text-xs font-medium text-[var(--text)]">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[18px] bg-[rgba(198,106,61,0.05)] p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-[#8a4a2a]">Quick actions</p>
                  <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                    <div className="flex items-center gap-2"><ArrowUpDown className="h-4 w-4 text-[#8a4a2a]" /> Sort by date</div>
                    <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-[#8a4a2a]" /> Apply tag</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Status summary</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Indexed', value: '2' },
                  { label: 'Processing', value: '1' },
                  { label: 'Pending', value: '1' },
                  { label: 'Total files', value: '4' },
                ].map((item) => (
                  <div key={item.label} className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
                    <p className="text-sm text-[var(--muted)]">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DocumentsPage
