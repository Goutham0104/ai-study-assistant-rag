import { workflowSteps } from '../data/mockData'

function AboutPage() {
  return (
    <main className="space-y-6 pb-8">
      <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <span className="hero-pill">How it works</span>
          <h1 className="mt-5 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">System workflow</h1>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">This prototype visualizes the core RAG pipeline for the AI Study Assistant. Each step shows how engineering PDFs are transformed into searchable knowledge and AI responses.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.label} className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-6 text-center shadow-soft">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-[rgba(198,106,61,0.08)] text-[#8a4a2a] shadow-sm">
                  <Icon className="h-7 w-7" />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--text)]">{step.label}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{step.status}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-card-strong p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Design principles</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Built to feel premium and trustworthy</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              'Warm, editorial surfaces instead of dark student-dashboard visuals.',
              'Clear hierarchy, generous spacing, and restrained copper accenting.',
              'Accessible contrast, keyboard-friendly controls, and readable type.',
              'Smooth motion that supports the interface instead of distracting from it.',
            ].map((item) => (
              <div key={item} className="rounded-[18px] bg-[rgba(198,106,61,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">{item}</div>
            ))}
          </div>
        </div>

        <div className="surface-card-strong p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Outcome</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">A product that feels commercially ready</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">The same workflow now reads like a premium SaaS product rather than a college demo, while the application logic and navigation remain intact.</p>
          <div className="mt-6 rounded-[20px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text)]">Narrative flow</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Upload documents, inspect pipeline progress, ask AI questions, and review analytics through a calm and consistent interface.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
