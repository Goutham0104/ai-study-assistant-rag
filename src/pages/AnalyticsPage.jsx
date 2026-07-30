import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { analyticsData, heatmapData, topicsCovered } from '../data/mockData'

function AnalyticsPage() {
  return (
    <main className="space-y-8">
      <section className="section-card p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Analytics</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Learning performance</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">Track progress, accuracy, and weekly engagement across your AI study workflow.</p>
          </div>
          <div className="rounded-full border border-slate-800 bg-slate-900/90 px-5 py-3 text-sm text-slate-300">Updated today</div>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Weekly activity</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Study volume over time</h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData} margin={{ top: 10, right: 0, left: -22, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155' }} labelStyle={{ color: '#F8FAFC' }} itemStyle={{ color: '#F8FAFC' }} />
                  <Line type="monotone" dataKey="progress" stroke="#6366F1" strokeWidth={4} dot={{ r: 4, fill: '#7C3AED' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-[#7C3AED]">Performance</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] bg-slate-900/90 p-5">
                  <p className="text-sm text-slate-400">Accuracy rate</p>
                  <p className="mt-2 text-3xl font-semibold text-white">98%</p>
                </div>
                <div className="rounded-[20px] bg-slate-900/90 p-5">
                  <p className="text-sm text-slate-400">Questions asked</p>
                  <p className="mt-2 text-3xl font-semibold text-white">186</p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Topic coverage</p>
              <div className="mt-6 space-y-4">
                {topicsCovered.map((topic) => (
                  <div key={topic.topic} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{topic.topic}</span>
                      <span>{topic.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED]" style={{ width: `${topic.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Heatmap</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Weekly study intensity</h2>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300">Live insights</div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {heatmapData.map((day) => (
              <div key={day.day} className="rounded-[18px] border border-slate-800 bg-slate-900/90 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{day.day}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{day.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Insights</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Skill progress</h2>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300">Stable</div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topicsCovered} dataKey="progress" nameKey="topic" innerRadius={58} outerRadius={88} paddingAngle={4}>
                  {topicsCovered.map((entry, index) => (
                    <Cell key={entry.topic} fill={index % 2 === 0 ? '#6366F1' : '#7C3AED'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155' }} itemStyle={{ color: '#F8FAFC' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AnalyticsPage
