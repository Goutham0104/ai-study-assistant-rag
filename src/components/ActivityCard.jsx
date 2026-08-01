function ActivityCard({ title, subtitle }) {
  return (
    <div className="rounded-[20px] border border-[rgba(31,41,55,0.08)] bg-white/85 px-5 py-4 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)] hover:bg-white">
      <h4 className="text-sm font-semibold text-[var(--text)]">{title}</h4>
      <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
    </div>
  )
}

export default ActivityCard
