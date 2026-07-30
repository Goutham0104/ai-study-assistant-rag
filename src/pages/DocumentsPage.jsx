import { documents } from '../data/mockData'
import { Search } from 'lucide-react'

function DocumentsPage() {
  const statusStyles = (status) => {
    if (status === 'Indexed') return 'bg-emerald-100 text-emerald-700'
    if (status === 'Processing') return 'bg-amber-100 text-amber-700'
    return 'bg-slate-100 text-slate-600'
  }

  return (
    <main className="space-y-8">
      <section className="section-card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Documents</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Uploaded study PDFs</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">Browse your indexed course files and stay on top of document status from one clean workspace.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input className="w-full rounded-full border border-slate-800 bg-slate-950/90 py-3 pl-12 pr-4 text-sm text-slate-200 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20" placeholder="Search documents" />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 shadow-soft">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-6 py-4">File name</th>
                <th className="px-6 py-4">Pages</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Upload date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {documents.map((doc) => (
                <tr key={doc.name} className="transition hover:bg-slate-900/80">
                  <td className="px-6 py-5 font-medium text-white">{doc.name}</td>
                  <td className="px-6 py-5 text-slate-400">{doc.pages}</td>
                  <td className="px-6 py-5">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-400">{doc.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default DocumentsPage
