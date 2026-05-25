import { useEffect, useState } from 'react'

function getAlert(forecast) {
  if (!forecast?.hourly) return null

  const { time, precipitation_probability, weathercode } = forecast.hourly
  const now   = new Date()
  const today = now.toDateString()

  const todayHours = time
    .map((t, i) => ({
      time:   new Date(t),
      precip: precipitation_probability[i],
      code:   weathercode[i],
    }))
    .filter(h => h.time > now && h.time.toDateString() === today)

  const fmt = t => t.toLocaleTimeString([], { hour: 'numeric', hour12: true })

  const storm = todayHours.find(h => h.code >= 95)
  if (storm) return {
    title:  '⛈ Storm alert today',
    sub:    `Thunderstorms from ${fmt(storm.time)}`,
    color:  '#f87171',
    bg:     'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.2)',
    icon:   '⚠️',
  }

  const snow = todayHours.find(h => h.code >= 71 && h.code <= 77)
  if (snow) return {
    title:  '❄️ Snow expected today',
    sub:    `Snow from ${fmt(snow.time)}`,
    color:  '#38bdf8',
    bg:     'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.2)',
    icon:   '⚠️',
  }

  const rain = todayHours.find(h => h.precip >= 60)
  if (rain) return {
    title:  '🌧 Rain alert today',
    sub:    `${rain.precip}% chance from ${fmt(rain.time)}`,
    color:  '#38bdf8',
    bg:     'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.2)',
    icon:   '💧',
  }

  return null
}

export default function FloatingAlert({ forecast }) {
  const [alert, setAlert] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const alertData = getAlert(forecast)
    setAlert(alertData)
    setIsVisible(!!alertData)
  }, [forecast])

  if (!isVisible || !alert) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28, right: 28,
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 20px',
        background: alert.bg,
        border: `1px solid ${alert.border}`,
        borderRadius: 14,
        backdropFilter: 'blur(20px)',
        zIndex: 100,
        animation: 'slideInUp 0.4s ease',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .alert-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Alert icon with pulse */}
      <div
        style={{
          fontSize: 18,
          color: alert.color,
          flexShrink: 0,
        }}
        className="alert-pulse"
      >
        {alert.icon}
      </div>

      {/* Alert text */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: alert.color, marginBottom: 2 }}>
          {alert.title}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(226,234,252,0.5)' }}>
          {alert.sub}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(226,234,252,0.4)',
          fontSize: 18,
          cursor: 'pointer',
          padding: '4px 8px',
          flexShrink: 0,
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.color = 'rgba(226,234,252,0.8)'}
        onMouseLeave={(e) => e.target.style.color = 'rgba(226,234,252,0.4)'}
      >
        ✕
      </button>
    </div>
  )
}