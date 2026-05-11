import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NAV } from '../../data/dashData'

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
    title:  'Storm alert today',
    sub:    `Thunderstorms from ${fmt(storm.time)}`,
    color:  '#f87171',
    bg:     'rgba(248,113,113,0.07)',
    border: 'rgba(248,113,113,0.2)',
  }

  const snow = todayHours.find(h => h.code >= 71 && h.code <= 77)
  if (snow) return {
    title:  'Snow expected today',
    sub:    `Snow from ${fmt(snow.time)}`,
    color:  '#38bdf8',
    bg:     'rgba(56,189,248,0.07)',
    border: 'rgba(56,189,248,0.2)',
  }

  const rain = todayHours.find(h => h.precip >= 60)
  if (rain) return {
    title:  'Rain alert today',
    sub:    `${rain.precip}% chance from ${fmt(rain.time)}`,
    color:  '#22c55e',
    bg:     'rgba(34,197,94,0.07)',
    border: 'rgba(34,197,94,0.18)',
  }

  return null
}

export default function Sidebar({ onLogout, forecast }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const alert    = getAlert(forecast)

  return (
    <aside className="dash-sidebar">
      <div className="dash-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="dash-logo-icon">🌐</div>
        <div className="dash-logo-text">
          Clima<strong>Sphere</strong>
        </div>
      </div>

      <nav className="dash-nav">
        {NAV.map(({ icon, label, active }) => (
          <button
            key={label}
            className={`dash-nav-item${active ? ' active' : ''}`}
          >
            <span className="dash-nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="dash-sidebar-divider" />

      <div className="dash-sidebar-bottom">
        {alert && (
          <div className="dash-alert-chip" style={{
            background: alert.bg,
            border: `1px solid ${alert.border}`,
          }}>
            <div className="dash-alert-dot" style={{ background: alert.color }} />
            <div className="dash-alert-text">
              <div className="dash-alert-title" style={{ color: alert.color }}>{alert.title}</div>
              <div className="dash-alert-sub">{alert.sub}</div>
            </div>
          </div>
        )}

        {user ? (
          <button className="dash-logout-btn" onClick={onLogout}>
            <span>🚪</span> Sign out
          </button>
        ) : (
          <button className="dash-logout-btn" onClick={() => navigate('/auth')}>
            <span>🔑</span> Login
          </button>
        )}
      </div>
    </aside>
  )
}
