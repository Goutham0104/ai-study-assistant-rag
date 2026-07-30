import { workflowSteps } from '../data/mockData'

function AboutPage() {
  return (
    <main className="space-y-8">
      <section className="section-card p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-sky-600">About</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">System workflow</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">This prototype visualizes the core RAG pipeline for the AI Study Assistant. Each step shows how engineering PDFs are transformed into searchable knowledge and AI responses.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.label} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-soft">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-sky-600 shadow-sm">
                  <Icon className="h-7 w-7" />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-950">{step.label}</p>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default AboutPage
