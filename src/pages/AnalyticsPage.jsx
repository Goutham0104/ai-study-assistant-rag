import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { analyticsData, heatmapData, topicsCovered } from '../data/mockData'

const executiveStats = [
  { label: 'Weekly usage', value: '684' },
  { label: 'Monthly usage', value: '2.9k' },
  { label: 'Questions asked', value: '1.2k' },
  { label: 'Study time', value: '42h' },
]

function AnalyticsPage() {
  return (
    <main className="space-y-6 pb-8">
      <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="hero-pill">Analytics</span>
            <h1 className="mt-4 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">Learning performance</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">Track progress, accuracy, and weekly engagement across your AI study workflow.</p>
          </div>
          <div className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white/85 px-5 py-3 text-sm text-[var(--muted)] shadow-sm">Updated today</div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {executiveStats.map((item) => (
            <div key={item.label} className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-[rgba(198,106,61,0.05)] p-5 shadow-sm">
              <p className="text-sm text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="surface-card-strong p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Weekly activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Study volume over time</h2>
              </div>
              <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a4a2a]">Live</span>
            </div>
            <div className="mt-6 h-72 rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#faf6f1_100%)] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fffdf9', border: '1px solid rgba(31,41,55,0.08)', borderRadius: '16px' }} />
                  <Line type="monotone" dataKey="progress" stroke="#c66a3d" strokeWidth={3} dot={{ r: 4, fill: '#c66a3d' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="surface-card-strong p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Performance</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] bg-[rgba(198,106,61,0.06)] p-5">
                  <p className="text-sm text-[var(--muted)]">Accuracy rate</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--text)]">98%</p>
                </div>
                <div className="rounded-[20px] bg-[rgba(198,106,61,0.06)] p-5">
                  <p className="text-sm text-[var(--muted)]">Questions asked</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--text)]">186</p>
                </div>
              </div>
            </div>

            <div className="surface-card-strong p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Topic coverage</p>
              <div className="mt-6 space-y-4">
                {topicsCovered.map((topic) => (
                  <div key={topic.topic} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-[var(--text)]">
                      <span>{topic.topic}</span>
                      <span className="text-[var(--muted)]">{topic.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[rgba(31,41,55,0.08)]">
                      <div className="h-full rounded-full bg-[linear-gradient(135deg,#c66a3d_0%,#9f4f2a_100%)]" style={{ width: `${topic.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card-strong p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Heatmap</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Weekly study intensity</h2>
            </div>
            <div className="rounded-full bg-[rgba(198,106,61,0.08)] px-4 py-2 text-sm text-[#8a4a2a]">Live insights</div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {heatmapData.map((day) => (
              <div key={day.day} className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">{day.day}</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text)]">{day.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card-strong p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Insights</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Skill progress</h2>
            </div>
            <div className="rounded-full bg-[rgba(198,106,61,0.08)] px-4 py-2 text-sm text-[#8a4a2a]">Stable</div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topicsCovered} dataKey="progress" nameKey="topic" innerRadius={58} outerRadius={88} paddingAngle={4}>
                  {topicsCovered.map((entry, index) => (
                    <Cell key={entry.topic} fill={index % 2 === 0 ? '#c66a3d' : '#9f4f2a'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fffdf9', border: '1px solid rgba(31,41,55,0.08)', borderRadius: '16px' }} itemStyle={{ color: '#1f2937' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AnalyticsPage
