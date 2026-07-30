import { chatHistory, chatMessages, suggestedPrompts } from '../data/mockData'
import { Search, Send } from 'lucide-react'

function ChatPage() {
  return (
    <main className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.37fr_0.63fr]">
        <aside className="section-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Chat history</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">Study conversations</h1>
            </div>
            <button className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-slate-900">
              New
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center rounded-[28px] border border-slate-800 bg-slate-900/90 px-4 py-3 text-slate-300 shadow-inner">
              <Search className="h-4 w-4" />
              <input placeholder="Search chats" className="ml-3 w-full bg-transparent text-sm outline-none" />
            </div>
            {chatHistory.map((chat) => (
              <div key={chat.title} className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-4 transition hover:border-sky-400/30 hover:bg-slate-900/90">
                <p className="font-semibold text-white">{chat.title}</p>
                <p className="mt-1 text-sm text-slate-400">{chat.preview}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="section-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">AI Chat</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Engineering help</h2>
            </div>
            <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300">Context enabled</span>
          </div>

          <div className="mt-8 space-y-5">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[28px] p-5 text-sm leading-7 shadow-soft ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-sky-500/15 to-sky-500/10 text-white'
                    : 'bg-slate-900/90 text-slate-200'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </p>
                    <span className="text-xs text-slate-500">{message.time}</span>
                  </div>
                  <p className="mt-3">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-5">
            <p className="text-sm font-semibold text-white">Suggested prompts</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {suggestedPrompts.map((prompt) => (
                <button key={prompt} className="rounded-full border border-slate-800 bg-slate-900/90 px-4 py-2 text-sm text-slate-300 transition hover:border-sky-400/30 hover:bg-slate-900">
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-4 shadow-soft sm:flex-row sm:items-center">
            <input type="text" placeholder="Ask about your engineering PDF..." className="min-w-0 flex-1 rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm text-slate-200 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20" />
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">
              Send
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ChatPage
