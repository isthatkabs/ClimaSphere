import { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '../../services/ai'

const STARTERS = [
  'What should I wear to a wedding today?',
  'Is it a good day to go running?',
  'What\'s the best outdoor activity right now?',
  'Should I carry an umbrella?',
  'What\'s good to do with kids today?',
]

export default function SuggestionChat({ weatherSummary }) {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([])   // { role, content }
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)

  // Scroll to latest message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open])

  async function send(text) {
    const q = (text ?? input).trim()
    if (!q || loading) return

    const next = [...messages, { role: 'user', content: q }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const { reply } = await chatWithAI(next, weatherSummary)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I couldn\'t reach the AI right now. Please try again in a moment.' },
      ])
    }
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="cs-chat-wrap">
      {/* ── Toggle header ── */}
      <button className="cs-chat-toggle" onClick={() => setOpen(o => !o)}>
        <span className="cs-chat-toggle-left">
          <span className="cs-chat-toggle-icon">💬</span>
          <span>
            <span className="cs-chat-toggle-title">Ask the AI</span>
            <span className="cs-chat-toggle-sub">
              Not sure what to wear or do? Ask a follow-up question
            </span>
          </span>
        </span>
        <span className={`cs-chat-chevron${open ? ' open' : ''}`}>›</span>
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div className="cs-chat-panel">
          {/* Message list */}
          <div className="cs-chat-messages">
            {messages.length === 0 ? (
              <div className="cs-chat-empty">
                <div className="cs-chat-empty-icon">🤖</div>
                <div className="cs-chat-empty-text">
                  Ask me anything about what to wear or do given today's weather.
                </div>
                {/* Starter chips */}
                <div className="cs-chat-starters">
                  {STARTERS.map(s => (
                    <button key={s} className="cs-chat-starter" onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`cs-chat-msg cs-chat-msg--${m.role}`}>
                  {m.role === 'assistant' && (
                    <span className="cs-chat-avatar">🤖</span>
                  )}
                  <div className="cs-chat-bubble">{m.content}</div>
                  {m.role === 'user' && (
                    <span className="cs-chat-avatar cs-chat-avatar--user">👤</span>
                  )}
                </div>
              ))
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="cs-chat-msg cs-chat-msg--assistant">
                <span className="cs-chat-avatar">🤖</span>
                <div className="cs-chat-bubble cs-chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="cs-chat-input-row">
            <input
              ref={inputRef}
              className="cs-chat-input"
              placeholder="e.g. Should I bring a jacket tonight?"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className={`cs-chat-send${(!input.trim() || loading) ? ' disabled' : ''}`}
              onClick={() => send()}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
