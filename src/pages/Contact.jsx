import { useState } from 'react'
import { Link }      from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db }        from '../firebase'
import HomeNav       from '../components/home/HomeNav'
import HomeFooter    from '../components/home/HomeFooter'
import { globalStyles } from '../styles/homeStyles'

const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(138,60,255,0.2)',
  borderRadius: 10, color: '#e8e0ff',
  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  outline: 'none', transition: 'border-color 0.15s',
}

const SUBJECTS = ['General question', 'Bug report', 'Feature request', 'Privacy / data request', 'Other']

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [status,  setStatus]  = useState(null)   // null | 'sending' | 'sent' | 'error'
  const [focused, setFocused] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('missing')
      return
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    if (!emailOk) { setStatus('bademail'); return }

    setStatus('sending')
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...form,
        createdAt: serverTimestamp(),
      })
      setStatus('sent')
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' })
    } catch {
      setStatus('error')
    }
  }

  const borderFocus = (field) => ({
    ...inputStyle,
    borderColor: focused === field ? 'rgba(138,60,255,0.6)' : 'rgba(138,60,255,0.2)',
  })

  return (
    <div style={{
      position: 'relative', minHeight: '100vh',
      fontFamily: "'DM Sans', sans-serif", color: '#e8e0ff', overflowX: 'hidden',
      background: 'linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)',
    }}>
      <style>{globalStyles}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(138,60,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(138,60,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <HomeNav />

        <section style={{ maxWidth: 640, margin: '0 auto', padding: '70px 40px 100px' }}>
          <Link to="/" style={{ fontSize: 13, color: '#a78bfa', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
            ← Back
          </Link>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(32px, 4vw, 52px)', color: '#f0ecff',
            letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 10,
          }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(200,190,240,0.55)', marginBottom: 44, lineHeight: 1.7 }}>
            Have a question, bug report, or feature idea? We read every message.
          </p>

          {status === 'sent' ? (
            <div style={{
              padding: '28px 28px', borderRadius: 16, textAlign: 'center',
              background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>✅</div>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#22c55e', marginBottom: 8 }}>Message sent!</div>
              <div style={{ fontSize: 13, color: 'rgba(200,190,240,0.55)' }}>We'll get back to you as soon as possible.</div>
              <button
                onClick={() => setStatus(null)}
                style={{
                  marginTop: 22, padding: '9px 22px', borderRadius: 8,
                  background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                  color: '#22c55e', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}
              >
                Send another
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(200,190,240,0.5)', display: 'block', marginBottom: 6 }}>Name</label>
                  <input
                    style={borderFocus('name')}
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(200,190,240,0.5)', display: 'block', marginBottom: 6 }}>Email</label>
                  <input
                    type="email"
                    style={borderFocus('email')}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label style={{ fontSize: 12, color: 'rgba(200,190,240,0.5)', display: 'block', marginBottom: 6 }}>Subject</label>
                <select
                  style={{ ...borderFocus('subject'), cursor: 'pointer' }}
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                  onFocus={() => setFocused('subject')}
                  onBlur={() => setFocused(null)}
                >
                  {SUBJECTS.map(s => <option key={s} value={s} style={{ background: '#0a0818' }}>{s}</option>)}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={{ fontSize: 12, color: 'rgba(200,190,240,0.5)', display: 'block', marginBottom: 6 }}>Message</label>
                <textarea
                  rows={6}
                  style={{ ...borderFocus('message'), resize: 'vertical', minHeight: 130 }}
                  placeholder="Tell us what's on your mind…"
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Error feedback */}
              {status === 'missing'  && <p style={{ fontSize: 13, color: '#f87171' }}>Please fill in all fields.</p>}
              {status === 'bademail' && <p style={{ fontSize: 13, color: '#f87171' }}>Please enter a valid email address.</p>}
              {status === 'error'    && <p style={{ fontSize: 13, color: '#f87171' }}>Something went wrong — please try again.</p>}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={status === 'sending'}
                style={{
                  padding: '13px 0', borderRadius: 10,
                  background: status === 'sending'
                    ? 'rgba(124,58,255,0.4)'
                    : 'linear-gradient(135deg, #7c3aff 0%, #5a7cff 100%)',
                  color: '#fff', fontWeight: 600, fontSize: 15,
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  border: 'none', boxShadow: '0 8px 32px rgba(124,58,255,0.3)',
                  transition: 'opacity 0.15s',
                }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message →'}
              </button>
            </div>
          )}
        </section>

        <HomeFooter />
      </div>
    </div>
  )
}