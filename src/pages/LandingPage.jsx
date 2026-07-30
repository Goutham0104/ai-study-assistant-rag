import FeatureCard from '../components/FeatureCard'
import { features } from '../data/mockData'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="page-shell">
      <section className="section-card relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_28%)] p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-y-0 right-0 hidden w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#7C3AED]/30 to-[#22D3EE]/10 blur-3xl lg:block" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <span className="hero-pill">Academic AI Assistant</span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Smart study workflows for engineering students
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Upload course notes, index PDF content, and use AI-powered search to turn engineering materials into fast, reliable answers.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/dashboard" className="btn-primary">
                Explore dashboard
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
              <span className="hero-pill">Fast, visual, and student-friendly</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="section-card p-10 bg-slate-950 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Why this works</p>
          <h2 className="mt-6 text-3xl font-semibold">A polished study assistant for every engineering course</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            A modern, accessible experience that keeps students focused. From upload to AI-assisted review, every step is designed to support exam prep and concept mastery.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-slate-900/90 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-400">Curated for clarity</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Fast access to indexed notes means you spend more time learning and less time hunting for key concepts.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-900/90 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-400">Focus-first design</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Clean cards, clear actions, and intuitive navigation keep study momentum strong across all screens.
              </p>
            </div>
          </div>
        </div>

        <div className="section-card p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-400">Features at a glance</p>
          <h2 className="mt-4 text-3xl font-semibold">Built to make learning efficient</h2>
          <p className="section-copy">Use one unified workspace to upload PDFs, chat with AI, and monitor progress with study analytics.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-slate-900/80 p-6">
              <p className="text-sm font-semibold text-white">Upload and index quickly</p>
              <p className="mt-3 text-sm text-slate-300">Drag and drop your lecture notes to build an instant knowledge base.</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-900/80 p-6">
              <p className="text-sm font-semibold text-white">Chat with context-aware AI</p>
              <p className="mt-3 text-sm text-slate-300">Ask coursework questions and get answers grounded in your own PDFs.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LandingPage
