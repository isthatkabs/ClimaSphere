import { weatherEmoji, capitalize } from './mapHelpers'

export default function WeatherPanel({ data, onClose }) {
  if (!data) return null

  const id       = data.weather?.[0]?.id
  const emoji    = weatherEmoji(id)
  const temp     = Math.round(data.main?.temp ?? 0)
  const feels    = Math.round(data.main?.feels_like ?? 0)
  const humidity = data.main?.humidity ?? 0
  const wind     = Math.round((data.wind?.speed ?? 0) * 3.6)
  const clouds   = data.clouds?.all ?? 0
  const pressure = data.main?.pressure ?? 1013
  const desc     = capitalize(data.weather?.[0]?.description ?? '')
  const city     = data.name
    ? `${data.name}${data.sys?.country ? `, ${data.sys.country}` : ''}`
    : `${data._lat?.toFixed(3)}°, ${data._lon?.toFixed(3)}°`

  const stats = [
    { icon: '💧', label: 'Humidity',   val: `${humidity}%`    },
    { icon: '💨', label: 'Wind',       val: `${wind} km/h`    },
    { icon: '🌡', label: 'Feels like', val: `${feels}°C`      },
    { icon: '☁️', label: 'Cloud',      val: `${clouds}%`      },
    { icon: '📊', label: 'Pressure',   val: `${pressure} hPa` },
    {
      icon: '👁', label: 'Visibility',
      val: data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : '–',
    },
  ]

  return (
    <div style={{
      position: 'absolute', bottom: 20, left: 20, zIndex: 999,
      width: 280,
      background: 'rgba(6,11,26,0.94)',
      border: '1px solid rgba(124,58,237,0.4)',
      borderRadius: 18,
      padding: '20px 22px 18px',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1) inset',
      animation: 'cs-panel-in 0.25s ease',
    }}>
      {/* close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 14, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(226,234,252,0.35)', fontSize: 15,
          lineHeight: 1, transition: 'color 0.15s', padding: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(226,234,252,0.8)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(226,234,252,0.35)'}
      >✕</button>

      {/* location label */}
      <div style={{
        fontSize: 11, color: 'rgba(167,139,250,0.8)',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span>📍</span> {city}
      </div>

      {/* temp + emoji */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <span style={{ fontSize: 52, lineHeight: 1 }}>{emoji}</span>
        <div style={{
          fontSize: 46, fontWeight: 300, lineHeight: 1,
          letterSpacing: -2, color: '#f0ecff',
        }}>
          {temp}<span style={{ fontSize: 22, color: 'rgba(226,234,252,0.4)' }}>°C</span>
        </div>
      </div>

      {/* condition */}
      <div style={{
        fontSize: 13, color: 'rgba(200,190,240,0.65)',
        marginBottom: 16, paddingLeft: 2,
      }}>
        {desc}
      </div>

      {/* stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {stats.map(({ icon, label, val }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '8px 10px',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(226,234,252,0.38)', marginBottom: 3 }}>
              {icon} {label}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#e2eafc' }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}