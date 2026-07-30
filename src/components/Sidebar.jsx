import { NavLink } from 'react-router-dom'
import { navLinks } from '../data/mockData'

function Sidebar() {
  return (
    <aside className="rounded-[32px] border border-slate-800 bg-slate-950/95 shadow-[0_40px_120px_rgba(8,12,20,0.35)] lg:sticky lg:top-6 z-20">
      <div className="flex min-h-full flex-col justify-between gap-6 px-5 py-6">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-5 shadow-[0_24px_60px_rgba(8,12,20,0.25)]">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300">AI Study Assistant</p>
            <h1 className="mt-3 text-2xl font-semibold text-white">Study Studio</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">Smart PDF workflows for engineering learners.</p>
          </div>

          <nav className="grid gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-semibold transition duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white shadow-[0_20px_60px_rgba(99,102,241,0.2)]'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-slate-900/90 p-5 text-sm text-slate-400 shadow-[0_18px_50px_rgba(8,12,20,0.25)]">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-300">Profile</p>
          <p className="mt-3 font-semibold text-white">John Doe</p>
          <p className="mt-2 text-sm text-slate-400">Engineering student refining PDF learning workflows.</p>
          <button className="mt-5 w-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] px-4 py-3 text-sm font-semibold text-white shadow-glow transition duration-300 hover:opacity-95">
            Theme Toggle
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
