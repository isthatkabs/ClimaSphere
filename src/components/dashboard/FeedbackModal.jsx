import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

export default function FeedbackModal({ onClose }) {
  const { user } = useAuth()
  const [rating,      setRating]      = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment,     setComment]     = useState('')
  const [focused,     setFocused]     = useState(false)
  const [status,      setStatus]      = useState(null)
  // status: null | 'submitting' | 'success' | 'ratingError' | 'lengthError' | 'error'

  const activeRating = hoverRating || rating

  async function handleSubmit() {
    if (rating === 0) { setStatus('ratingError'); return }
    if (comment.length > 500) { setStatus('lengthError'); return }

    setStatus('submitting')
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 12000)
      )
      await Promise.race([
        addDoc(collection(db, 'feedback'), {
          rating,
          comment:   comment.trim(),
          userId:    user?.uid   || null,
          userEmail: user?.email || null,
          createdAt: serverTimestamp(),
        }),
        timeout,
      ])
      setStatus('success')
    } catch (err) {
      console.error('Feedback submit error:', err)
      setStatus('error')
    }
  }

  function handleCancel() {
    onClose()
  }

  const textareaBorder = status === 'lengthError'
    ? '#f87171'
    : focused
    ? 'rgba(139,92,246,0.6)'
    : 'rgba(139,92,246,0.2)'

  const charColor = comment.length > 490
    ? '#f87171'
    : comment.length > 450
    ? '#fbbf24'
    : 'rgba(226,234,252,0.3)'

  return (
    <>
      <style>{`
        @keyframes fb-modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
        .fb-star-btn { background: none; border: none; padding: 3px; cursor: pointer; line-height: 1; }
        .fb-cancel-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .fb-submit-btn:hover:not(:disabled) { opacity: 0.85; }
        .fb-close-btn { background: none; border: none; cursor: pointer; line-height: 1; }
      `}</style>

      {/* Backdrop — click to cancel */}
      <div
        onClick={handleCancel}
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         500,
          background:     'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Centering wrapper */}
      <div style={{
        position:       'fixed',
        inset:          0,
        zIndex:         501,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '20px',
        pointerEvents:  'none',
      }}>
        <div style={{
          width:          '100%',
          maxWidth:       440,
          background:     'rgba(10,13,30,0.97)',
          border:         '1px solid rgba(139,92,246,0.3)',
          borderRadius:   20,
          boxShadow:      '0 32px 80px rgba(0,0,0,0.7)',
          overflow:       'hidden',
          pointerEvents:  'all',
          animation:      'fb-modal-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
          fontFamily:     "'DM Sans', sans-serif",
          color:          '#e2eafc',
        }}>

          {/* ── Success state ── */}
          {status === 'success' ? (
            <div style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 20 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#a78bfa', marginBottom: 10 }}>
                Thank you for your feedback!
              </div>
              <div style={{ fontSize: 14, color: 'rgba(226,234,252,0.5)', marginBottom: 32, lineHeight: 1.6 }}>
                Your response helps us improve ClimaSphere.
              </div>
              <button
                onClick={onClose}
                style={{
                  padding:    '11px 32px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aff 0%, #5a7cff 100%)',
                  color:      '#fff',
                  fontWeight: 600,
                  fontSize:   14,
                  border:     'none',
                  cursor:     'pointer',
                  boxShadow:  '0 4px 20px rgba(124,58,255,0.35)',
                }}
              >
                Close
              </button>
            </div>

          ) : (
            <>
              {/* ── Header ── */}
              <div style={{
                display:      'flex',
                alignItems:   'flex-start',
                gap:          12,
                padding:      '22px 24px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#e2eafc', lineHeight: 1.3 }}>
                    How do you find the website so far?
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(226,234,252,0.45)', marginTop: 4 }}>
                    Rate your experience:
                  </div>
                </div>
                <button
                  className="fb-close-btn"
                  onClick={handleCancel}
                  style={{
                    fontSize:   18,
                    color:      'rgba(226,234,252,0.35)',
                    padding:    '2px 4px',
                    marginTop:  -2,
                    transition: 'color 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(226,234,252,0.8)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(226,234,252,0.35)'}
                  aria-label="Close feedback"
                >
                  ✕
                </button>
              </div>

              {/* ── Star rating ── */}
              <div style={{ padding: '24px 24px 16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <button
                      key={i}
                      className="fb-star-btn"
                      onClick={() => { setRating(i); if (status === 'ratingError') setStatus(null) }}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                      style={{
                        fontSize:   38,
                        color:      activeRating >= i ? '#fbbf24' : 'rgba(255,255,255,0.12)',
                        transform:  activeRating >= i ? 'scale(1.12)' : 'scale(1)',
                        transition: 'color 0.1s, transform 0.1s',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {status === 'ratingError' && (
                  <p style={{ fontSize: 12, color: '#f87171', marginTop: 10, margin: '10px 0 0' }}>
                    Please select a star rating.
                  </p>
                )}
              </div>

              {/* ── Comment textarea ── */}
              <div style={{ padding: '0 24px 12px' }}>
                <label style={{
                  fontSize:     12,
                  color:        'rgba(226,234,252,0.5)',
                  display:      'block',
                  marginBottom: 8,
                }}>
                  Share your feedback:
                </label>
                <textarea
                  rows={4}
                  maxLength={500}
                  placeholder="Write your comments here…"
                  value={comment}
                  onChange={e => {
                    setComment(e.target.value)
                    if (status === 'lengthError') setStatus(null)
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    width:       '100%',
                    padding:     '11px 14px',
                    background:  'rgba(255,255,255,0.04)',
                    border:      `1px solid ${textareaBorder}`,
                    borderRadius: 10,
                    color:       '#e2eafc',
                    fontFamily:  "'DM Sans', sans-serif",
                    fontSize:    14,
                    outline:     'none',
                    resize:      'vertical',
                    minHeight:   100,
                    boxSizing:   'border-box',
                    transition:  'border-color 0.15s',
                  }}
                />
                <div style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  marginTop:      5,
                  fontSize:       11,
                }}>
                  <span style={{ color: status === 'lengthError' ? '#f87171' : 'rgba(226,234,252,0.3)' }}>
                    {status === 'lengthError' ? 'Feedback comment is too long.' : 'Optional'}
                  </span>
                  <span style={{ color: charColor }}>
                    {comment.length}/500
                  </span>
                </div>
              </div>

              {/* ── Server error ── */}
              {status === 'error' && (
                <p style={{ padding: '0 24px 8px', fontSize: 13, color: '#f87171', margin: 0 }}>
                  Unable to submit feedback. Please try again.
                </p>
              )}

              {/* ── Actions ── */}
              <div style={{
                display:        'flex',
                gap:            10,
                justifyContent: 'flex-end',
                padding:        '12px 24px 24px',
                borderTop:      '1px solid rgba(255,255,255,0.06)',
              }}>
                <button
                  className="fb-cancel-btn"
                  onClick={handleCancel}
                  style={{
                    padding:      '10px 20px',
                    borderRadius: 10,
                    background:   'rgba(255,255,255,0.05)',
                    border:       '1px solid rgba(255,255,255,0.1)',
                    color:        'rgba(226,234,252,0.7)',
                    fontSize:     14,
                    fontWeight:   500,
                    cursor:       'pointer',
                    transition:   'background 0.15s',
                  }}
                >
                  Cancel
                </button>
                <button
                  className="fb-submit-btn"
                  onClick={handleSubmit}
                  disabled={status === 'submitting'}
                  style={{
                    padding:      '10px 24px',
                    borderRadius: 10,
                    background:   status === 'submitting'
                      ? 'rgba(124,58,255,0.4)'
                      : 'linear-gradient(135deg, #7c3aff 0%, #5a7cff 100%)',
                    color:        '#fff',
                    fontWeight:   600,
                    fontSize:     14,
                    border:       'none',
                    cursor:       status === 'submitting' ? 'not-allowed' : 'pointer',
                    boxShadow:    status === 'submitting' ? 'none' : '0 4px 20px rgba(124,58,255,0.3)',
                    transition:   'opacity 0.15s',
                  }}
                >
                  {status === 'submitting' ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
