import { ArrowRight, ShieldCheck } from 'lucide-react'
import { settingsOptions } from '../data/mockData'

function SettingsPage() {
  return (
    <main className="space-y-6 pb-8">
      <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="hero-pill">Settings</span>
            <h1 className="mt-5 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">Workspace preferences</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">Manage theme, profile details, API settings, notifications, and security for your study assistant.</p>
          </div>
          <button className="btn-primary">Save changes</button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {settingsOptions.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-[rgba(198,106,61,0.18)] hover:bg-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">{item.label}</p>
                    <p className="mt-2 text-[var(--text)]">{item.description}</p>
                  </div>
                  <Icon className="h-5 w-5 text-[#8a4a2a]" />
                </div>
                <div className="mt-6 flex items-center justify-between rounded-[18px] bg-[rgba(198,106,61,0.05)] px-4 py-4">
                  <p className="text-sm text-[var(--muted)]">Manage {item.label.toLowerCase()}</p>
                  <ArrowRight className="h-4 w-4 text-[#8a4a2a]" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card-strong p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Profile</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Account overview</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[18px] bg-[rgba(198,106,61,0.05)] p-5">
              <p className="text-sm text-[var(--muted)]">Username</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text)]">student.engineer</p>
            </div>
            <div className="rounded-[18px] bg-[rgba(198,106,61,0.05)] p-5">
              <p className="text-sm text-[var(--muted)]">Email</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text)]">student@example.com</p>
            </div>
          </div>
        </div>

        <div className="surface-card-strong p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">API Access</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Integration keys</h2>
          <p className="mt-4 text-sm text-[var(--muted)]">Use your API key to connect the AI assistant with external services and tools.</p>
          <div className="mt-6 rounded-[20px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--muted)]">Current API Key</p>
              <button className="btn-secondary">Regenerate</button>
            </div>
            <p className="mt-3 text-base font-semibold text-[var(--text)]">••••••••••••••••••••••••</p>
          </div>
          <div className="mt-4 rounded-[20px] bg-[rgba(198,106,61,0.05)] p-4 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2 font-semibold text-[var(--text)]"><ShieldCheck className="h-4 w-4 text-[#8a4a2a]" /> Security posture</div>
            <p className="mt-2">Workspace settings are presented with clear hierarchy and restrained emphasis.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default SettingsPage
