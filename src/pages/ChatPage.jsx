import { chatHistory, chatMessages, suggestedPrompts } from '../data/mockData'
import { CheckCheck, Copy, RefreshCw, Search, Send, Sparkles } from 'lucide-react'

function ChatPage() {
  return (
    <main className="space-y-6 pb-8">
      <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
        <aside className="surface-card-strong p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">Conversation history</p>
              <h1 className="mt-2 text-2xl font-semibold text-[var(--text)]">Study conversations</h1>
            </div>
            <button className="btn-secondary px-4 py-2 text-sm">New</button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 px-4 py-3 text-[var(--muted)] shadow-sm">
              <Search className="h-4 w-4 text-[#8a4a2a]" />
              <input placeholder="Search chats" className="ml-3 w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]" />
            </div>
            {chatHistory.map((chat) => (
              <div key={chat.title} className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)]">
                <p className="font-semibold text-[var(--text)]">{chat.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{chat.preview}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="surface-card-strong flex min-h-[760px] flex-col overflow-hidden p-0">
          <div className="border-b border-[rgba(31,41,55,0.08)] px-6 py-5 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4a2a]">AI Chat</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Engineering help</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a4a2a]">Context enabled</span>
                <span className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white/80 px-3 py-1 text-xs text-[var(--muted)]">Streaming</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-7">
            <div className="space-y-5">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[min(88%,760px)] rounded-[24px] border px-5 py-4 text-sm leading-7 shadow-sm ${
                    message.role === 'user'
                      ? 'border-[rgba(198,106,61,0.14)] bg-[rgba(198,106,61,0.08)] text-[var(--text)]'
                      : 'border-[rgba(31,41,55,0.08)] bg-white/90 text-[var(--text)]'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a4a2a]">
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </p>
                      <span className="text-xs text-[var(--muted)]">{message.time}</span>
                    </div>
                    <p className="mt-3 text-base leading-7">{message.text}</p>
                    {message.role === 'ai' ? (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button className="btn-secondary px-3 py-2 text-xs"><Copy className="mr-2 h-3.5 w-3.5" />Copy response</button>
                        <button className="btn-secondary px-3 py-2 text-xs"><RefreshCw className="mr-2 h-3.5 w-3.5" />Regenerate</button>
                        <span className="rounded-full bg-[rgba(198,106,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#8a4a2a]">Sources attached</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              <div className="flex justify-start">
                <div className="rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-white/90 px-5 py-4 text-sm text-[var(--muted)] shadow-sm">
                  <div className="flex items-center gap-2 text-[#8a4a2a]"><Sparkles className="h-4 w-4" /><span className="font-semibold uppercase tracking-[0.24em]">Typing</span></div>
                  <div className="mt-3 flex gap-1.5">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgba(198,106,61,0.45)]" />
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgba(198,106,61,0.45)] [animation-delay:150ms]" />
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgba(198,106,61,0.45)] [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[rgba(31,41,55,0.08)] px-6 py-5 sm:px-7">
            <div className="rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-white/85 p-4 shadow-sm">
              <p className="text-sm font-semibold text-[var(--text)]">Suggested prompts</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {suggestedPrompts.map((prompt) => (
                  <button key={prompt} className="rounded-full border border-[rgba(31,41,55,0.08)] bg-white px-4 py-2 text-sm text-[var(--muted)] transition hover:-translate-y-0.5 hover:border-[rgba(198,106,61,0.18)] hover:text-[var(--text)]">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-[rgba(31,41,55,0.08)] bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center">
              <input type="text" placeholder="Ask about your engineering PDF..." className="focus-ring min-w-0 flex-1 rounded-full border border-[rgba(31,41,55,0.08)] bg-white px-5 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]" />
              <button className="btn-primary gap-2">
                Send
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {[
                'Reference sources are displayed inline for every answer.',
                'Markdown rendering keeps explanations structured and readable.',
                'Code examples can be copied directly from the response panel.',
              ].map((item) => (
                <div key={item} className="rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-[rgba(198,106,61,0.05)] p-4 text-sm text-[var(--muted)]">
                  <div className="flex items-center gap-2 font-semibold text-[var(--text)]"><CheckCheck className="h-4 w-4 text-[#8a4a2a]" /> Premium chat affordance</div>
                  <p className="mt-2">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ChatPage
