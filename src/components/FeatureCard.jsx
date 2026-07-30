function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-slate-900/95">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-900/20 text-sky-300 shadow-inner">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  )
}

export default FeatureCard
