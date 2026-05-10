import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'
 
/* ── static mock data ─────────────────────────────────────────────────── */
const HOURLY = [
  { time: 'Now',   icon: '⛅', temp: 18, precip: 10 },
  { time: '2 PM',  icon: '🌤',  temp: 20, precip: 5  },
  { time: '3 PM',  icon: '☀️', temp: 22, precip: 0  },
  { time: '4 PM',  icon: '☀️', temp: 21, precip: 0  },
  { time: '5 PM',  icon: '🌤',  temp: 19, precip: 8  },
  { time: '6 PM',  icon: '🌦',  temp: 17, precip: 45 },
  { time: '7 PM',  icon: '🌧',  temp: 15, precip: 70 },
  { time: '8 PM',  icon: '🌧',  temp: 14, precip: 80 },
  { time: '9 PM',  icon: '🌦',  temp: 13, precip: 50 },
  { time: '10 PM', icon: '⛅', temp: 12, precip: 20 },
  { time: '11 PM', icon: '🌙', temp: 11, precip: 5  },
]
 
const WEEKLY = [
  { day: 'Today', icon: '⛅', cond: 'Partly cloudy', precip: '10%', hi: 22, lo: 13, today: true },
  { day: 'Tue',   icon: '🌧', cond: 'Heavy rain',    precip: '85%', hi: 16, lo: 11 },
  { day: 'Wed',   icon: '🌦', cond: 'Showers',       precip: '60%', hi: 17, lo: 10 },
  { day: 'Thu',   icon: '☁️', cond: 'Overcast',      precip: '20%', hi: 14, lo: 9  },
  { day: 'Fri',   icon: '🌤',  cond: 'Mostly sunny',  precip: '5%',  hi: 19, lo: 10 },
]
 
const METRICS = [
  { label: 'Humidity',   icon: '💧', val: '74%',    sub: 'High — feels sticky',    fill: 74,  color: '#38bdf8' },
  { label: 'Wind',       icon: '💨', val: '18 km/h', sub: 'SW · gusts 29 km/h',    fill: 36,  color: '#a78bfa' },
  { label: 'UV Index',   icon: '☀️', val: '3',       sub: 'Moderate — some care',   fill: 30,  color: '#fbbf24' },
  { label: 'Visibility', icon: '👁',  val: '12 km',   sub: 'Good visibility',        fill: 80,  color: '#22c55e' },
  { label: 'Pressure',   icon: '🌡',  val: '1013 hPa',sub: 'Rising slowly',          fill: 55,  color: '#f87171' },
  { label: 'Dew Point',  icon: '🌫',  val: '13°C',    sub: 'Comfortable',            fill: 45,  color: '#34d399' },
]
 
const NAV = [
  { icon: '🏠', label: 'Overview',   active: true  },
  { icon: '🗺',  label: 'Map',        active: false },
  { icon: '📊', label: 'Analytics',  active: false },
  { icon: '📍', label: 'Locations',  active: false },
  { icon: '🔔', label: 'Alerts',     active: false },
  { icon: '⚙️', label: 'Settings',   active: false },
]
 
/* ── helpers ──────────────────────────────────────────────────────────── */
function getInitials(email) {
  if (!email) return 'U'
  return email.split('@')[0].slice(0, 2).toUpperCase()
}
 
function getNow() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
 
function getGreeting(email) {
  const h = new Date().getHours()
  const name = email ? email.split('@')[0] : 'there'
  const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return `${part}, ${name} 👋`
}
 
/* ── component ────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeHour, setActiveHour] = useState(0)
 
  const handleLogout = async () => {
    await logout()
    navigate('/')
  }
 
  /* sun position — 38% through the day as demo */
  const sunPct = 38
  const aqiVal = 42
  const aqiPct = (aqiVal / 300) * 100
 
  return (
    <div className="dash-root">
 
      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
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
          <div className="dash-alert-chip">
            <div className="dash-alert-dot" />
            <div className="dash-alert-text">
              <div className="dash-alert-title">Rain alert tonight</div>
              <div className="dash-alert-sub">Heavy rain from 6 PM</div>
            </div>
          </div>
 
          <button className="dash-logout-btn" onClick={handleLogout}>
            <span>🚪</span> Sign out
          </button>
        </div>
      </aside>
 
      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <div className="dash-main">
 
        {/* ── HEADER ── */}
        <header className="dash-header">
          <div className="dash-header-left">
            <div className="dash-greeting">{getGreeting(user?.email)}</div>
            <div className="dash-date">{getNow()}</div>
          </div>
 
          <div className="dash-search-wrap">
            <span className="dash-search-icon">🔍</span>
            <input className="dash-search" placeholder="Search a city…" />
          </div>
 
          <div className="dash-header-right">
            <button className="dash-icon-btn" title="Notifications">🔔</button>
            <button className="dash-icon-btn" title="Refresh">🔄</button>
            <div className="dash-avatar" title={user?.email}>
              {getInitials(user?.email)}
            </div>
          </div>
        </header>
 
        {/* ── SCROLLABLE CONTENT ── */}
        <div className="dash-content">
 
          {/* ── HERO ── */}
          <div className="dash-hero-card">
            <div className="dash-hero-left">
              <div className="dash-hero-location">
                <span className="dash-hero-loc-dot" />
                London, United Kingdom
              </div>
 
              <div className="dash-hero-temp-row">
                <div className="dash-hero-temp">18°</div>
                <div className="dash-hero-temp-meta">
                  <div className="dash-hero-condition">Partly Cloudy</div>
                  <div className="dash-hero-hilo">H: 22° · L: 13°</div>
                  <div className="dash-hero-updated">Updated 2 min ago</div>
                </div>
              </div>
 
              <div className="dash-hero-pills">
                <span className="dash-pill">💧 74% humidity</span>
                <span className="dash-pill">💨 18 km/h SW</span>
                <span className="dash-pill">☀️ UV 3</span>
                <span className="dash-pill">🌡 1013 hPa</span>
              </div>
            </div>
 
            <div className="dash-hero-right">
              <div className="dash-hero-icon-big">⛅</div>
              <div className="dash-hero-right-stats">
                <div className="dash-right-stat">
                  <span className="dash-right-stat-label">Feels like</span>
                  <span className="dash-right-stat-val">16°C</span>
                </div>
                <div className="dash-right-stat">
                  <span className="dash-right-stat-label">Rain chance</span>
                  <span className="dash-right-stat-val">10%</span>
                </div>
                <div className="dash-right-stat">
                  <span className="dash-right-stat-label">Visibility</span>
                  <span className="dash-right-stat-val">12 km</span>
                </div>
              </div>
            </div>
          </div>
 
          {/* ── HOURLY ── */}
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-title">Hourly forecast</span>
              <span className="dash-section-sub">Next 11 hours</span>
            </div>
            <div className="dash-hourly-strip">
              {HOURLY.map((h, i) => (
                <div
                  key={h.time}
                  className={`dash-hourly-item${i === activeHour ? ' active' : ''}`}
                  onClick={() => setActiveHour(i)}
                >
                  <span className="dash-hourly-time">{h.time}</span>
                  <span className="dash-hourly-icon">{h.icon}</span>
                  <span className="dash-hourly-temp">{h.temp}°</span>
                  <div className="dash-precip-row">
                    <div className="dash-precip-track">
                      <div className="dash-precip-fill" style={{ height: `${h.precip}%` }} />
                    </div>
                    <span className="dash-hourly-pct">{h.precip}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* ── BOTTOM GRID ── */}
          <div className="dash-bottom-grid">
 
            {/* left col */}
            <div className="dash-bottom-left">
 
              {/* metrics */}
              <div className="dash-section">
                <div className="dash-section-header">
                  <span className="dash-section-title">Conditions</span>
                </div>
                <div className="dash-metrics-grid">
                  {METRICS.map(m => (
                    <div className="dash-metric-card" key={m.label}>
                      <div className="dash-metric-header">
                        <span className="dash-metric-icon">{m.icon}</span>
                        <span className="dash-metric-label">{m.label}</span>
                      </div>
                      <div className="dash-metric-val">{m.val}</div>
                      <div className="dash-metric-sub">{m.sub}</div>
                      <div className="dash-metric-track">
                        <div
                          className="dash-metric-fill"
                          style={{ width: `${m.fill}%`, background: m.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* 7-day */}
              <div className="dash-section">
                <div className="dash-section-header">
                  <span className="dash-section-title">5-day forecast</span>
                </div>
                <div className="dash-weekly-list">
                  {WEEKLY.map(w => (
                    <div
                      key={w.day}
                      className={`dash-weekly-item${w.today ? ' today' : ''}`}
                    >
                      <span className="dash-weekly-day">{w.day}</span>
                      <span className="dash-weekly-icon">{w.icon}</span>
                      <span className="dash-weekly-cond">{w.cond}</span>
                      <div className="dash-weekly-right">
                        <span className="dash-weekly-precip">💧 {w.precip}</span>
                        <div className="dash-weekly-temps">
                          <span className="dash-weekly-hi">{w.hi}°</span>
                          <span className="dash-weekly-lo">{w.lo}°</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
 
            {/* right col */}
            <div className="dash-bottom-right">
 
              {/* sunrise/sunset */}
              <div className="dash-side-card">
                <div className="dash-side-card-title">Sunrise &amp; Sunset</div>
                <div className="dash-sun-arc">
                  <div
                    className="dash-sun-dot"
                    style={{ left: `calc(${sunPct}% - 9px)` }}
                  >☀️</div>
                </div>
                <div className="dash-sun-times">
                  <div className="dash-sun-item">
                    <span className="dash-sun-lbl">Sunrise</span>
                    <span className="dash-sun-val">5:14 AM</span>
                  </div>
                  <div className="dash-sun-item">
                    <span className="dash-sun-lbl">Sunset</span>
                    <span className="dash-sun-val">9:02 PM</span>
                  </div>
                </div>
                <div className="dash-sun-pct">15 hrs 48 min of daylight</div>
              </div>
 
              {/* AQI */}
              <div className="dash-side-card">
                <div className="dash-side-card-title">Air Quality Index</div>
                <div className="dash-aqi-row">
                  <span className="dash-aqi-val" style={{ color: '#22c55e' }}>{aqiVal}</span>
                  <span
                    className="dash-aqi-badge"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
                  >
                    Good
                  </span>
                </div>
                <div className="dash-aqi-track">
                  <div
                    className="dash-aqi-cursor"
                    style={{ left: `calc(${aqiPct}% - 1px)` }}
                  />
                </div>
                <div className="dash-aqi-labels">
                  <span>Good</span><span>Moderate</span><span>Poor</span>
                </div>
              </div>
 
              {/* Moon phase */}
              <div className="dash-side-card">
                <div className="dash-side-card-title">Moon Phase</div>
                <div className="dash-moon-row">
                  <div>
                    <div className="dash-moon-phase">Waxing Gibbous</div>
                    <div className="dash-moon-sub">84% illuminated · rises 4:12 PM</div>
                  </div>
                  <div className="dash-moon-icon">🌔</div>
                </div>
              </div>
 
            </div>
          </div>
 
        </div>{/* end dash-content */}
      </div>{/* end dash-main */}
    </div>
  )
}