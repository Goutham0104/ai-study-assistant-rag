function ActivityCard({ title, subtitle }) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 px-5 py-4 shadow-soft transition hover:border-sky-400/30 hover:bg-slate-900/90">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
    </div>
  )
}

export default ActivityCard
