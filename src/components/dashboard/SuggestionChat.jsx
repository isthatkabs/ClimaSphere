import { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '../../services/ai'

const STORAGE_KEY  = 'cs-chat-history'
const TTL_MS       = 12 * 60 * 60 * 1000   // 12 hours

const STARTERS = [
  'Where in the UK is warm this weekend?',
  'What should I wear to a wedding today?',
  'Is it a good day to go running?',
  'Where should I go for a day trip right now?',
  'Should I carry an umbrella?',
  'What\'s good to do with kids today?',
  'Plan a picnic — is the weather suitable?',
  'Where\'s hot abroad right now?',
]

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const { messages, savedAt } = JSON.parse(raw)
    if (Date.now() - savedAt > TTL_MS) { localStorage.removeItem(STORAGE_KEY); return [] }
    return messages ?? []
  } catch { return [] }
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, savedAt: Date.now() }))
  } catch {}
}

export default function SuggestionChat({ weatherSummary, locationName }) {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState(loadMessages)
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)

  // Persist messages to localStorage on every change
  useEffect(() => {
    saveMessages(messages)
  }, [messages])

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
      const { reply } = await chatWithAI(next, weatherSummary, locationName)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      const msg = err.message === 'auth'
        ? 'You need to be signed in to use AI chat. Please log in and try again.'
        : 'Sorry, I couldn\'t reach the AI right now. Please try again in a moment.'
      setMessages(prev => [...prev, { role: 'assistant', content: msg }])
    }
    setLoading(false)
  }

  function clearChat() {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
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
              Where to go, what to wear, travel ideas, event planning — ask anything
            </span>
          </span>
        </span>
        <span className={`cs-chat-chevron${open ? ' open' : ''}`}>›</span>
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div className="cs-chat-panel">
          {/* Clear button — only when there are messages */}
          {messages.length > 0 && (
            <div className="cs-chat-clear-row">
              <button className="cs-chat-clear-btn" onClick={clearChat}>
                🗑 Clear chat
              </button>
            </div>
          )}
          {/* Message list */}
          <div className="cs-chat-messages">
            {messages.length === 0 ? (
              <div className="cs-chat-empty">
                <div className="cs-chat-empty-icon">🤖</div>
                <div className="cs-chat-empty-text">
                  Ask me anything — what to wear, where to go, travel ideas, event planning, or anything else weather and lifestyle related.
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
              placeholder="e.g. Where in the UK is warm this weekend?"
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
