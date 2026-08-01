import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  FileSearch,
  LayoutGrid,
  LockKeyhole,
  MessageSquareQuote,
  Sparkles,
  Upload,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'

const heroFeatures = [
  { title: 'AI PDF Chat', description: 'Ask grounded questions and get cited answers from your documents.', icon: MessageSquareQuote },
  { title: 'Multiple PDF Upload', description: 'Build a shared knowledge base from lecture notes, research papers, and handouts.', icon: Upload },
  { title: 'Semantic Search', description: 'Find exact concepts faster with vector-powered retrieval and clean ranking.', icon: FileSearch },
  { title: 'RAG Pipeline', description: 'A transparent retrieval flow that keeps responses trustworthy and document-backed.', icon: BrainCircuit },
  { title: 'Analytics Dashboard', description: 'Monitor usage, study intensity, and document coverage at a glance.', icon: LayoutGrid },
  { title: 'Fast Responses', description: 'Premium answer delivery with refined loading states and fluid interactions.', icon: Sparkles },
  { title: 'Secure Storage', description: 'Confidently manage academic files with a polished enterprise-feeling experience.', icon: LockKeyhole },
  { title: 'Chat History', description: 'Revisit prior conversations without losing the thread of a complex topic.', icon: BookOpen },
]

const trustStats = [
  { value: '4.9/5', label: 'Student satisfaction' },
  { value: '12k+', label: 'PDFs indexed' },
  { value: '98%', label: 'Answer confidence' },
]

const trustedAvatars = ['AL', 'MS', 'DK', 'PR']

function LandingPage({ theme, onToggleTheme }) {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsCompact(window.scrollY > 18)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="page-shell relative z-10 mx-auto max-w-[1440px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-4 z-40 mb-8 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[0_18px_50px_rgba(31,41,55,0.08)] backdrop-blur-xl transition-all duration-300 sm:px-5 ${isCompact ? 'scale-[0.99]' : ''}`}
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)_auto] xl:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#c66a3d_0%,#9f4f2a_100%)] text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8a4a2a]">AI Study Assistant</p>
              <p className="mt-1 max-w-[250px] truncate text-[12px] leading-5 text-[var(--muted)]">Premium RAG workspace for engineering teams and students</p>
            </div>
          </div>

          <nav className="hidden items-center justify-center gap-1 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.5)] p-1 text-sm font-medium text-[var(--muted)] xl:flex">
            {['Home', 'Features', 'How It Works', 'Dashboard', 'Pricing', 'Resources', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="rounded-full px-3.5 py-2 text-[13px] transition hover:bg-[rgba(198,106,61,0.08)] hover:text-[var(--text)]">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 justify-self-start xl:justify-self-end">
            <button className="focus-ring hidden rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.5)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)] hover:bg-[rgba(198,106,61,0.06)] md:inline-flex" onClick={onToggleTheme}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.5)] text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)] hover:bg-[rgba(198,106,61,0.06)]" aria-label="Profile">
              <Users className="h-4 w-4" />
            </button>
            <Link to="/dashboard" className="btn-primary min-w-0 px-5 py-2.5">
              Get Started Free
            </Link>
          </div>
        </div>
      </motion.header>

      <section id="home" className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pt-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-3xl">
          <span className="hero-pill">Enterprise AI study workspace</span>
          <h1 className="mt-6 max-w-2xl text-5xl font-bold tracking-tight text-[var(--text)] sm:text-6xl lg:text-[64px] lg:leading-[0.95]">
            Study Smarter.
            <span className="block text-[#8a4a2a]">Not Harder.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] lg:text-[18px]">
            Upload engineering PDFs. Ask AI. Receive instant answers grounded in your documents using Retrieval-Augmented Generation.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/dashboard" className="btn-primary text-base">
              Start Free
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base">
              Watch Demo
            </a>
          </div>

          <div className="mt-12 grid gap-4 rounded-[28px] border border-[rgba(31,41,55,0.08)] bg-white/72 p-5 shadow-soft backdrop-blur-md sm:grid-cols-3">
            {trustStats.map((item) => (
              <div key={item.label} className="rounded-[18px] bg-[rgba(198,106,61,0.05)] p-4">
                <p className="text-2xl font-semibold text-[var(--text)]">{item.value}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex -space-x-3">
              {trustedAvatars.map((avatar, index) => (
                <div key={avatar} className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#fbf9f6] bg-white text-xs font-semibold text-[var(--text)] shadow-sm" style={{ zIndex: trustedAvatars.length - index }}>
                  {avatar}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Trusted by Engineering Students</p>
              <p className="text-sm text-[var(--muted)]">High-performance document intelligence with reliable, cited responses.</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="relative">
          <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[rgba(198,106,61,0.12)] blur-3xl" />
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[rgba(31,41,55,0.08)] blur-3xl" />
          <div className="surface-card-strong relative overflow-hidden p-4 sm:p-5">
            <div className="rounded-[28px] border border-[rgba(31,41,55,0.08)] bg-[linear-gradient(180deg,#fffdf9_0%,#f7f2eb_100%)] p-4 shadow-soft sm:p-5">
              <div className="mx-auto max-w-[680px] rounded-[26px] border border-[rgba(31,41,55,0.08)] bg-[#111827] p-4 text-white shadow-[0_24px_80px_rgba(17,24,39,0.26)] sm:p-5">
                <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c66a3d]" />
                    Study Studio Dashboard
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">Live</div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/50">Ask AI</p>
                    <h3 className="mt-3 text-3xl font-semibold text-white">Answers grounded in your PDFs</h3>
                    <div className="mt-6 space-y-3">
                      <div className="rounded-[18px] bg-white/8 p-3 text-sm text-white/80">What are the key assumptions in the control systems chapter?</div>
                      <div className="rounded-[18px] bg-[rgba(198,106,61,0.14)] p-3 text-sm text-white">I found the answer in Control Systems.pdf and cited the relevant section.</div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/50">
                        <span>Study time</span>
                        <span>+18%</span>
                      </div>
                      <div className="mt-4 h-32 rounded-[18px] bg-[linear-gradient(180deg,rgba(198,106,61,0.18)_0%,rgba(255,255,255,0.04)_100%)]" />
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-white/50">Recent activity</p>
                      <div className="mt-3 space-y-3 text-sm text-white/75">
                        <div className="flex items-center justify-between rounded-[14px] bg-white/5 px-3 py-2"><span>Thermodynamics Q&A</span><span className="text-white/50">2h</span></div>
                        <div className="flex items-center justify-between rounded-[14px] bg-white/5 px-3 py-2"><span>Control Systems Review</span><span className="text-white/50">5h</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-white/75 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8a4a2a]">Indexing</p>
                  <p className="mt-3 text-xl font-semibold text-[var(--text)]">Fast, precise</p>
                </div>
                <div className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-white/75 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8a4a2a]">Security</p>
                  <p className="mt-3 text-xl font-semibold text-[var(--text)]">Enterprise-grade</p>
                </div>
                <div className="rounded-[22px] border border-[rgba(31,41,55,0.08)] bg-white/75 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8a4a2a]">AI quality</p>
                  <p className="mt-3 text-xl font-semibold text-[var(--text)]">Cited responses</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="pt-24">
        <div className="max-w-2xl">
          <span className="hero-pill">Trusted product design</span>
          <h2 className="mt-5 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">Everything a premium study platform should feel like</h2>
          <p className="section-copy text-base lg:text-[18px]">Beautifully structured workflows, clear hierarchy, and commercially polished interactions throughout the experience.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {heroFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="grid gap-6 pt-24 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card-strong p-8 lg:p-10">
          <span className="hero-pill">How it works</span>
          <h2 className="mt-5 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">A transparent RAG workflow that feels fast and trustworthy</h2>
          <p className="section-copy text-base lg:text-[18px]">Upload your PDFs, let the system extract and index the content, then ask questions with confidence because every response is document-grounded.</p>
          <div className="mt-8 space-y-4">
            {[
              'Upload and organize PDFs in one calm workspace.',
              'Index text into a retrieval pipeline with clear processing states.',
              'Ask questions and receive grounded answers with cited evidence.',
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-4 rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-[rgba(198,106,61,0.05)] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(198,106,61,0.12)] text-sm font-semibold text-[#8a4a2a]">0{index + 1}</div>
                <p className="pt-1 text-[var(--muted)]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="dashboard" className="grid gap-4">
          <div className="surface-card-strong p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">For teams</p>
            <h3 className="mt-4 text-3xl font-semibold text-[var(--text)]">Built like a product people would pay for</h3>
            <p className="mt-4 text-[var(--muted)]">Clean spacing, reliable hierarchy, and a premium tone that works across desktop, laptop, tablet, and mobile.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Editorial UI', copy: 'Warm off-white surfaces and copper accents for a refined commercial feel.' },
              { title: 'Enterprise trust', copy: 'Subtle motion, strong contrast, and calm interface density.' },
              { title: 'Responsive by design', copy: 'A strict grid that holds up on every breakpoint.' },
              { title: 'Accessibility first', copy: 'Keyboard-friendly interactions and clear focus states.' },
            ].map((item) => (
              <div key={item.title} className="surface-card p-5">
                <h4 className="text-lg font-semibold text-[var(--text)]">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="pt-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: 'Starter', price: 'Free', copy: 'Perfect for trying the full workflow without friction.' },
            { title: 'Pro', price: '$19', copy: 'For serious learners who want polished study operations.' },
            { title: 'Enterprise', price: 'Custom', copy: 'For institutions, labs, and teams with scale in mind.' },
          ].map((plan) => (
            <div key={plan.title} className="surface-card-strong p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">{plan.title}</p>
              <div className="mt-5 flex items-end gap-2">
                <h3 className="text-4xl font-semibold text-[var(--text)]">{plan.price}</h3>
                <span className="pb-1 text-sm text-[var(--muted)]">/ month</span>
              </div>
              <p className="mt-4 text-[var(--muted)]">{plan.copy}</p>
              <button className="btn-secondary mt-6 w-full">Choose plan</button>
            </div>
          ))}
        </div>
      </section>

      <section id="resources" className="grid gap-6 pt-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card-strong p-8 lg:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Resources</p>
          <h2 className="mt-4 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">Designed to feel calm, clear, and premium</h2>
          <p className="section-copy text-base lg:text-[18px]">Strong typography, restrained copper accents, and generous spacing make every part of the interface feel intentional.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="surface-card p-5"><h4 className="text-lg font-semibold text-[var(--text)]">Docs</h4><p className="mt-2 text-sm text-[var(--muted)]">Implementation notes and product education.</p></div>
            <div className="surface-card p-5"><h4 className="text-lg font-semibold text-[var(--text)]">Security</h4><p className="mt-2 text-sm text-[var(--muted)]">Confident storage and secure document handling.</p></div>
          </div>
        </div>
        <div id="contact" className="surface-card-strong p-8 lg:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Contact</p>
          <h2 className="mt-4 text-4xl font-semibold text-[var(--text)] lg:text-[40px]">Ready for teams that expect polish</h2>
          <p className="section-copy text-base lg:text-[18px]">The structure is already in place to support a commercial SaaS launch page, without changing the core workflow.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/dashboard" className="btn-primary">Open dashboard</Link>
            <a href="mailto:hello@example.com" className="btn-secondary">Talk to sales</a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LandingPage
