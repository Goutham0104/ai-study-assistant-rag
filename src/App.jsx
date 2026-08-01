import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Search, SunMedium, UserCircle2 } from 'lucide-react'
import { BrowserRouter, NavLink, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import ChatPage from './pages/ChatPage'
import DocumentsPage from './pages/DocumentsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <BrowserRouter>
      <AppChrome />
    </BrowserRouter>
  )
}

function AppChrome() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem('theme') || 'light'
  })

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (isLanding) return undefined

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLanding])

  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(198,106,61,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(31,41,55,0.08),_transparent_22%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_100%)]" />

      {isLanding ? (
        <Routes>
          <Route path="/" element={<LandingPage theme={theme} onToggleTheme={toggleTheme} />} />
        </Routes>
      ) : (
        <div className="mx-auto grid min-h-screen max-w-[1440px] gap-5 px-4 py-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-6 lg:py-6">
          <Sidebar theme={theme} onToggleTheme={toggleTheme} />
          <div className="relative min-w-0 space-y-5">
            <TopHeader isScrolled={isScrolled} theme={theme} onToggleTheme={toggleTheme} />
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0"
              >
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

function TopHeader({ isScrolled, theme, onToggleTheme }) {
  const quickLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Upload', to: '/upload' },
    { label: 'Chat', to: '/chat' },
  ]

  return (
    <header
      className={`sticky top-4 z-30 grid gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[0_18px_50px_rgba(31,41,55,0.08)] backdrop-blur-xl transition-all duration-300 sm:px-5 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)_auto] xl:items-center ${
        isScrolled ? 'scale-[0.99]' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#c66a3d_0%,#9f4f2a_100%)] text-white shadow-glow">
          <span className="text-xs font-bold tracking-[0.28em]">SA</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8a4a2a]">AI Study Assistant</p>
          <p className="mt-1 max-w-[290px] truncate text-[12px] leading-5 text-[var(--muted)]">Enterprise-grade RAG workspace for premium document intelligence</p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-3 xl:justify-center">
        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-2 text-sm text-[var(--muted)] shadow-sm 2xl:flex">
          <Search className="h-4 w-4 text-[#8a4a2a]" />
          <span className="truncate">Search documents, chats, analytics...</span>
        </div>
        <nav className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-1 text-sm font-medium text-[var(--muted)] xl:flex">
          {quickLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-[13px] font-medium transition ${isActive ? 'bg-[rgba(198,106,61,0.1)] text-[#8a4a2a]' : 'text-[var(--muted)] hover:bg-white/70 hover:text-[var(--text)]'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.55)] text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)] hover:bg-[rgba(198,106,61,0.06)]" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-3.5 text-sm font-medium text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)] hover:bg-[rgba(198,106,61,0.06)]" aria-label="Theme toggle" onClick={onToggleTheme}>
          <SunMedium className={`h-4 w-4 transition ${theme === 'dark' ? 'rotate-180' : ''}`} />
          <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <button className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)] hover:bg-[rgba(198,106,61,0.06)]">
          <UserCircle2 className="h-5 w-5 text-[#8a4a2a]" />
          <span className="hidden sm:inline">Profile</span>
        </button>
      </div>
    </header>
  )
}

export default App
