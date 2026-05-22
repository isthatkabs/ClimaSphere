import { useEffect, useState, useRef } from 'react'
import { getWeatherSuggestions, buildSuggestionInputs } from '../../data/suggestions'

const DISPLAY_MS  = 7000  // how long to show before auto-dismiss
const APPEAR_DELAY = 1800  // wait a moment after data loads

// FloatingAlert is ~72px tall at bottom:28; this value clears it with a 12px gap
const ALERT_OFFSET = 28 + 72 + 12

export default function FloatingSuggestion({ weather, forecast, onNav, hasWeatherAlert }) {
  const [visible,    setVisible]    = useState(false)
  const [dismissed,  setDismissed]  = useState(false)
  const [progress,   setProgress]   = useState(100)
  const [suggestion, setSuggestion] = useState(null)

  const timerRef    = useRef(null)
  const rafRef      = useRef(null)
  const startRef    = useRef(null)
  const shownKeyRef = useRef(null)

  // Derive suggestions when data arrives
  useEffect(() => {
    if (!weather || !forecast) return

    const inputs  = buildSuggestionInputs(weather, forecast)
    const result  = getWeatherSuggestions(inputs)
    const temp    = Math.round(inputs.temp)
    const key     = `${weather.name}|${temp}|${inputs.weathercode}`

    // Don't re-show the same popup for the same weather snapshot
    if (key === shownKeyRef.current) return
    shownKeyRef.current = key

    setSuggestion({ ...result, temp, windspeed: Math.round(inputs.windspeed) })
    setDismissed(false)
    setProgress(100)
    setVisible(false)

    // Short delay so it doesn't pop before the page renders
    const appear = setTimeout(() => setVisible(true), APPEAR_DELAY)
    return () => clearTimeout(appear)
  }, [weather, forecast])

  // Countdown progress bar + auto-dismiss
  useEffect(() => {
    if (!visible || dismissed) return

    startRef.current = performance.now()

    function tick(now) {
      const elapsed = now - startRef.current
      const pct     = Math.max(0, 100 - (elapsed / DISPLAY_MS) * 100)
      setProgress(pct)
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setVisible(false)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    timerRef.current = setTimeout(() => setVisible(false), DISPLAY_MS)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timerRef.current)
    }
  }, [visible, dismissed])

  function dismiss(e) {
    e.stopPropagation()
    setDismissed(true)
    setVisible(false)
    cancelAnimationFrame(rafRef.current)
    clearTimeout(timerRef.current)
  }

  function goToSuggestions() {
    setVisible(false)
    onNav('Suggestions')
  }

  if (!visible || !suggestion) return null

  const { primaryEmoji, primaryCondition, activities, clothing, temp } = suggestion
  const previewActivities = activities.slice(0, 3)
  const previewClothing   = clothing.slice(0, 3)

  return (
    <>
      <style>{`
        @keyframes cs-sugg-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .cs-float-sugg {
          animation: cs-sugg-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .cs-float-sugg-btn:hover {
          background: rgba(139,92,246,0.18) !important;
          border-color: rgba(139,92,246,0.45) !important;
        }
        .cs-float-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: #e2eafc;
          white-space: nowrap;
        }
        .cs-float-chip.warm {
          background: rgba(251,191,36,0.07);
          border-color: rgba(251,191,36,0.18);
        }
      `}</style>

      <div
        className="cs-float-sugg"
        onClick={goToSuggestions}
        style={{
          position:       'fixed',
          bottom:         hasWeatherAlert ? ALERT_OFFSET : 28,
          right:          28,
          width:          300,
          background:     'rgba(10,13,30,0.92)',
          border:         '1px solid rgba(139,92,246,0.3)',
          borderRadius:   16,
          backdropFilter: 'blur(24px)',
          boxShadow:      '0 12px 40px rgba(0,0,0,0.45)',
          zIndex:         99,
          cursor:         'pointer',
          overflow:       'hidden',
          userSelect:     'none',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        10,
          padding:    '14px 16px 10px',
        }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2eafc' }}>
              Today's Suggestions
            </div>
            <div style={{ fontSize: 11, color: 'rgba(226,234,252,0.45)', marginTop: 1 }}>
              {primaryEmoji} {primaryCondition} · {temp}°C — tap to see all
            </div>
          </div>
          <button
            onClick={dismiss}
            style={{
              fontSize:   16,
              color:      'rgba(226,234,252,0.35)',
              padding:    '4px 6px',
              flexShrink: 0,
              lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(226,234,252,0.8)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(226,234,252,0.35)'}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

        {/* ── Activity preview ── */}
        <div style={{ padding: '10px 16px 4px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(226,234,252,0.35)', marginBottom: 7 }}>
            🎯 What to do
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {previewActivities.map((item, i) => (
              <span key={i} className="cs-float-chip">
                {item.icon} {item.text.length > 22 ? item.text.slice(0, 22) + '…' : item.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── Clothing preview ── */}
        <div style={{ padding: '8px 16px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(226,234,252,0.35)', marginBottom: 7 }}>
            👔 What to wear
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {previewClothing.map((item, i) => (
              <span key={i} className="cs-float-chip warm">
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── CTA row ── */}
        <div style={{ padding: '0 16px 14px' }}>
          <div
            className="cs-float-sugg-btn"
            style={{
              width:        '100%',
              padding:      '9px 0',
              background:   'rgba(139,92,246,0.12)',
              border:       '1px solid rgba(139,92,246,0.3)',
              borderRadius: 10,
              textAlign:    'center',
              fontSize:     13,
              fontWeight:   600,
              color:        '#a78bfa',
              transition:   'background 0.15s, border-color 0.15s',
            }}
          >
            View full suggestions →
          </div>
        </div>

        {/* ── Countdown bar ── */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.05)' }}>
          <div style={{
            height:          '100%',
            width:           `${progress}%`,
            background:      'rgba(139,92,246,0.6)',
            borderRadius:    '0 2px 2px 0',
            transition:      'none',
          }} />
        </div>
      </div>
    </>
  )
}
