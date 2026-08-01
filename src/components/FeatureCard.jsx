function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="group rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-white/80 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-[rgba(198,106,61,0.18)] hover:bg-white">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(198,106,61,0.08)] text-[#8a4a2a] shadow-sm transition duration-300 group-hover:bg-[rgba(198,106,61,0.12)]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </div>
  )
}

export default FeatureCard
