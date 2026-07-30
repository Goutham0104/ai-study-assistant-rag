import { Search } from 'lucide-react'
import { stats, recentActivity, documents, workflowSteps, quickActions } from '../data/mockData'
import StatCard from '../components/StatCard'
import ActivityCard from '../components/ActivityCard'

function Dashboard() {
  return (
    <main className="space-y-6">
      <section className="section-card p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Welcome back, student</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Your AI study companion</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Upload PDFs, search indexed lecture notes, and ask smart engineering questions from one polished workspace.</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search documents, chats..."
                className="input-base w-full rounded-full border-slate-800 bg-slate-900/80 pl-11 pr-5 text-slate-100"
              />
            </div>
            <button className="btn-primary">Start new chat</button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="panel-card">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-sky-400">Quick actions</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Jump into your workflow</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {quickActions.map((action) => (
                  <button key={action.label} className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <action.icon className="h-4 w-4 text-sky-300" />
                      <span>{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-sky-400">Recent chats</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Study conversations</h2>
              </div>
              <button className="btn-secondary">View all</button>
            </div>
            <div className="mt-6 space-y-4">
              {recentActivity.map((item) => (
                <ActivityCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="panel-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400">System workflow</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">RAG pipeline overview</h2>
            </div>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">Live</span>
          </div>
          <div className="mt-6 space-y-3">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="flex items-center gap-4 rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-sky-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{step.label}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Step {index + 1}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
