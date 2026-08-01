import { NavLink } from 'react-router-dom'
import { ArrowRight, ChevronRight, Shield, Sparkles } from 'lucide-react'
import { navLinks } from '../data/mockData'

function Sidebar({ theme, onToggleTheme }) {
  return (
    <aside className="sticky top-4 z-20 h-fit rounded-[30px] border border-[var(--border)] bg-[var(--surface)] shadow-soft backdrop-blur-xl">
      <div className="flex min-h-full flex-col justify-between gap-6 p-5 lg:p-6">
        <div className="space-y-6">
          <div className="surface-card-strong p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#c66a3d_0%,#9f4f2a_100%)] text-white shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">AI Study Assistant</p>
                <h1 className="mt-1 text-2xl font-semibold text-[var(--text)]">Study Studio</h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">Premium RAG workflows for documents, conversations, and study analytics.</p>
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
                    `group flex items-center justify-between rounded-[18px] border px-4 py-3 text-sm font-semibold transition duration-300 ${
                      isActive
                        ? 'border-[rgba(198,106,61,0.16)] bg-[rgba(198,106,61,0.08)] text-[#8a4a2a] shadow-sm'
                        : 'border-transparent bg-transparent text-[var(--muted)] hover:border-[rgba(31,41,55,0.08)] hover:bg-white hover:text-[var(--text)]'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-70" />
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="surface-card-strong p-5 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(198,106,61,0.08)] text-[#8a4a2a]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Profile</p>
              <p className="mt-1 font-semibold text-[var(--text)]">John Doe</p>
            </div>
          </div>
          <p className="mt-4 leading-6 text-[var(--muted)]">Engineering learner workspace with secure, grounded answers.</p>
          <button className="btn-secondary mt-5 w-full justify-between" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
