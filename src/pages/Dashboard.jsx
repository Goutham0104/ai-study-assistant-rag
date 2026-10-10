import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, Clock3, FileText, Send, Sparkles, Upload } from 'lucide-react'
import { recentActivity, documents, workflowSteps, quickActions, activityTrend } from '../data/mockData'
import StatCard from '../components/StatCard'
import ActivityCard from '../components/ActivityCard'

const overviewCards = [
  { label: 'Total PDFs', value: '48', change: '+12%', icon: FileText },
  { label: 'Questions Asked', value: '184', change: '+18%', icon: Send },
  { label: 'AI Responses', value: '526', change: '+24%', icon: Sparkles },
  { label: 'Average Response Time', value: '1.4s', change: '-0.3s', icon: Clock3 },
  { label: 'Storage Used', value: '68%', change: '+8%', icon: BarChart3 },
]

function Dashboard() {
  const navigate = useNavigate()

  return (
    <main className="space-y-6 pb-8">
      <section className="surface-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="hero-pill">Executive dashboard</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--text)] lg:text-[40px]">Your document intelligence control center</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
              Monitor uploads, study activity, response quality, and storage in a single polished workspace built for trust and speed.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="btn-secondary" onClick={() => navigate('/chat')}>New chat</button>
            <button className="btn-primary" onClick={() => navigate('/upload')}>
              Upload PDF
              <Upload className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {overviewCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="surface-card-strong p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Usage trends</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Study interactions over time</h2>
              </div>
              <div className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white/80 px-4 py-2 text-sm text-[var(--muted)]">Live data</div>
            </div>
            <div className="mt-6 h-72 rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#faf6f1_100%)] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTrend} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c66a3d" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#c66a3d" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fffdf9', border: '1px solid rgba(31,41,55,0.08)', borderRadius: '16px' }} />
                  <Area type="monotone" dataKey="activity" stroke="#c66a3d" strokeWidth={3} fill="url(#studyFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="surface-card-strong p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Quick actions</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Jump into the workflow</h2>
              </div>
              <button className="btn-secondary">View all</button>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => (
                <button key={action.label} className="group rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 px-4 py-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[rgba(198,106,61,0.18)] hover:bg-white">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(198,106,61,0.08)] text-[#8a4a2a] transition group-hover:bg-[rgba(198,106,61,0.12)]">
                      <action.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-[var(--text)]">{action.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="surface-card-strong p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Recent activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Study conversations</h2>
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

        <div className="space-y-6">
          <div className="surface-card-strong p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">RAG pipeline</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Workflow overview</h2>
              </div>
              <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a4a2a]">Live</span>
            </div>
            <div className="mt-6 space-y-3">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.label} className="flex items-center gap-4 rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(198,106,61,0.08)] text-[#8a4a2a]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--text)]">{step.label}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Step {index + 1}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a4a2a]">{step.status}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="surface-card-strong p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Recent documents</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Indexed files</h2>
              </div>
              <button className="btn-secondary">Browse</button>
            </div>
            <div className="mt-6 space-y-3">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{doc.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{doc.pages} pages · Added {doc.date}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a4a2a]">{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
