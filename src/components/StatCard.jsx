function StatCard({ label, value, change, icon: Icon }) {
  return (
    <div className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-[rgba(198,106,61,0.18)]">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl bg-[rgba(198,106,61,0.08)] p-3 text-[#8a4a2a] shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a4a2a]">
          {change}
        </span>
      </div>
      <p className="mt-6 text-3xl font-semibold text-[var(--text)]">{value}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{label}</p>
    </div>
  )
}

export default StatCard
