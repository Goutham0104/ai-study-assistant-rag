function StatCard({ label, value, change, icon: Icon }) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-3xl bg-slate-900/80 p-3 text-sky-300 shadow-inner">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          {change}
        </span>
      </div>
      <p className="mt-6 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </div>
  )
}

export default StatCard
