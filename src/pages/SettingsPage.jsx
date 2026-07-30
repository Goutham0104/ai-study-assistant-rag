import { settingsOptions } from '../data/mockData'
import { ArrowRight, Bell, Lock, Moon, User } from 'lucide-react'

function SettingsPage() {
  const iconFor = (label) => {
    if (label === 'Profile') return <User className="h-5 w-5 text-sky-300" />
    if (label === 'Theme & Appearance') return <Moon className="h-5 w-5 text-sky-300" />
    if (label === 'API Settings') return <Lock className="h-5 w-5 text-sky-300" />
    if (label === 'Notifications') return <Bell className="h-5 w-5 text-sky-300" />
    return null
  }

  return (
    <main className="space-y-8">
      <section className="section-card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Workspace preferences</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">Manage theme, profile details, API settings, notifications, and security for your study assistant.</p>
          </div>
          <button className="btn-primary">Save changes</button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {settingsOptions.map((item) => (
            <div key={item.label} className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft transition hover:border-sky-400/30 hover:bg-slate-900/95">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-white">{item.description}</p>
                </div>
                {iconFor(item.label)}
              </div>
              <div className="mt-6 flex items-center justify-between rounded-[20px] bg-slate-900/90 px-4 py-4">
                <p className="text-sm text-slate-300">Manage {item.label.toLowerCase()}</p>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Profile</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Account overview</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] bg-slate-900/90 p-5">
              <p className="text-sm text-slate-400">Username</p>
              <p className="mt-2 text-lg font-semibold text-white">student.engineer</p>
            </div>
            <div className="rounded-[20px] bg-slate-900/90 p-5">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 text-lg font-semibold text-white">student@example.com</p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300">API Access</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Integration keys</h2>
          <p className="mt-4 text-sm text-slate-400">Use your API key to connect the AI assistant with external services and tools.</p>
          <div className="mt-6 rounded-[20px] border border-slate-800 bg-slate-900/90 p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-300">Current API Key</p>
              <button className="btn-secondary">Regenerate</button>
            </div>
            <p className="mt-3 text-base font-semibold text-white">••••••••••••••••••••••••</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default SettingsPage
