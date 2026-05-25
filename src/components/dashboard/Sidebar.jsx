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

export default function Sidebar({ onLogout, forecast, activePage, onNav, onOpenFeedback }) {
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
        {NAV.map(({ icon, label }) => (
          <button
            key={label}
            className={`dash-nav-item${activePage === label ? ' active' : ''}`}
            onClick={() => onNav(label)}
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

        <button
          onClick={onOpenFeedback}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          8,
            width:        '100%',
            padding:      '9px 12px',
            marginBottom: 8,
            background:   'rgba(139,92,246,0.08)',
            border:       '1px solid rgba(139,92,246,0.2)',
            borderRadius: 10,
            color:        '#a78bfa',
            fontSize:     13,
            fontWeight:   500,
            cursor:       'pointer',
            transition:   'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background   = 'rgba(139,92,246,0.15)'
            e.currentTarget.style.borderColor  = 'rgba(139,92,246,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background   = 'rgba(139,92,246,0.08)'
            e.currentTarget.style.borderColor  = 'rgba(139,92,246,0.2)'
          }}
        >
          <span>⭐</span> Rate us
        </button>

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