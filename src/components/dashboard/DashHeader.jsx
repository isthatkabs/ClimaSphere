import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { getInitials, getNow, getGreeting } from '../../data/dashData'
import { searchCities } from '../../services/weather'

const NOTIF_ALERT_DEFS = [
  { id: 'storm', icon: '⛈',  title: 'Thunderstorm Warning', color: '#f87171', check: h => h.code >= 95 },
  { id: 'snow',  icon: '❄️', title: 'Snow & Ice Warning',    color: '#93c5fd', check: h => h.code >= 71 && h.code <= 77 },
  { id: 'rain',  icon: '🌧',  title: 'Heavy Rain Alert',     color: '#38bdf8', check: h => h.precip >= 60 },
  { id: 'wind',  icon: '💨',  title: 'Strong Wind Advisory', color: '#a78bfa', check: h => h.wind > 50 },
  { id: 'fog',   icon: '🌫',  title: 'Dense Fog Advisory',   color: '#94a3b8', check: h => h.visibility < 1000 },
  { id: 'heat',  icon: '🌡',  title: 'Extreme Heat Warning', color: '#fb923c', check: h => h.apparent_temp > 35 },
  { id: 'uv',    icon: '☀️', title: 'Very High UV Index',   color: '#fbbf24', check: h => h.uv_index >= 8 },
]

function parseActiveAlerts(forecast) {
  if (!forecast?.hourly) return []
  const { time, weathercode, precipitation_probability, windspeed_10m, visibility, apparent_temperature, uv_index } = forecast.hourly
  const now    = new Date()
  const cutoff = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  const hours  = time
    .map((t, i) => ({
      time:          new Date(t),
      code:          weathercode?.[i]              ?? 0,
      precip:        precipitation_probability?.[i] ?? 0,
      wind:          windspeed_10m?.[i]             ?? 0,
      visibility:    visibility?.[i]                ?? 99999,
      apparent_temp: apparent_temperature?.[i]       ?? 0,
      uv_index:      uv_index?.[i]                  ?? 0,
    }))
    .filter(h => h.time >= now && h.time <= cutoff)
  return NOTIF_ALERT_DEFS.filter(def => hours.some(h => def.check(h)))
}

function getCountryName(code) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

export default function DashHeader({ onSearch, onReset, forecast, onNav }) {
  const { user }                        = useAuth()
  const { settings }                    = useSettings()
  const navigate                        = useNavigate()
  const [input, setInput]               = useState('')
  const [suggestions, setSuggestions]   = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [noResults, setNoResults]       = useState(false)
  const [notifOpen, setNotifOpen]       = useState(false)
  const debounceRef                     = useRef(null)
  const wrapRef                         = useRef(null)
  const inputRef                        = useRef(null)
  const notifRef                        = useRef(null)

  const activeAlerts = useMemo(() => parseActiveAlerts(forecast), [forecast])

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setInput(val)
    setNoResults(false)
    clearTimeout(debounceRef.current)

    if (val.trim().length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchCities(val)
      if (results.length === 0) {
        setNoResults(true)
        setSuggestions([])
      } else {
        setSuggestions(results)
        setNoResults(false)
      }
      setShowDropdown(true)
    }, 400)
  }

  const handleSelect = (city) => {
    setInput(`${city.name}, ${getCountryName(city.country)}`)
    setShowDropdown(false)
    setSuggestions([])
    onSearch({ lat: city.lat, lon: city.lon, name: city.name, country: city.country })
  }

  const handleClear = () => {
    setInput('')
    setSuggestions([])
    setShowDropdown(false)
    setNoResults(false)
  }

  const handleSearchIconClick = () => {
    handleClear()
    inputRef.current?.focus()
  }

  const handleReset = () => {
    handleClear()
    onReset()
  }

  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <div className="dash-greeting">
          {user ? getGreeting(user) : 'Welcome to ClimaSphere 🌐'}
        </div>
        <div className="dash-date">{getNow()}</div>
      </div>

      <div style={{ position: 'relative' }} ref={wrapRef}>
        <div className="dash-search-wrap">
          <span
            className="dash-search-icon"
            onClick={handleSearchIconClick}
            style={{ cursor: 'pointer' }}
            title="Clear search"
          >
            🔍
          </span>
          <input
            ref={inputRef}
            className="dash-search"
            placeholder="Search a city…"
            value={input}
            onChange={handleChange}
            onFocus={handleClear}
            autoComplete="off"
          />
          {input && (
            <span
              onClick={handleClear}
              title="Clear"
              style={{ cursor: 'pointer', opacity: 0.4, fontSize: 12, paddingRight: 4 }}
            >
              ✕
            </span>
          )}
        </div>

        {showDropdown && (
          <div style={{
            position: 'absolute', top: '110%', left: 0, right: 0,
            background: '#0f1729',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, overflow: 'hidden',
            zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {noResults ? (
              <div style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(226,234,252,0.4)' }}>
                No cities found — check the spelling
              </div>
            ) : (
              suggestions.map((city, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(city)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{
                    padding: '10px 16px', cursor: 'pointer', fontSize: 13,
                    borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'background 0.1s',
                  }}
                >
                  <span>{city.name}{city.state ? `, ${city.state}` : ''}</span>
                  <span style={{ opacity: 0.4, fontSize: 11 }}>{getCountryName(city.country)}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="dash-header-right">
        {/* ── Notification Bell ── */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className={`dash-icon-btn${notifOpen ? ' active' : ''}`}
            title="Notifications"
            onClick={() => setNotifOpen(o => !o)}
            style={{ position: 'relative' }}
          >
            🔔
            {settings.notifications && activeAlerts.length > 0 && (
              <span className="dash-notif-badge">{activeAlerts.length}</span>
            )}
          </button>

          {notifOpen && (
            <div className="dash-notif-panel">
              <div className="dash-notif-header">
                <span className="dash-notif-title">Notifications</span>
                <button className="dash-notif-close" onClick={() => setNotifOpen(false)}>✕</button>
              </div>

              {!settings.notifications ? (
                <div className="dash-notif-off">
                  Notifications are off. Enable them in{' '}
                  <button
                    className="dash-notif-link"
                    onClick={() => { setNotifOpen(false); onNav?.('Settings') }}
                  >
                    Settings
                  </button>.
                </div>
              ) : activeAlerts.length === 0 ? (
                <div className="dash-notif-clear">
                  <span className="dash-notif-clear-icon">✅</span>
                  <div className="dash-notif-clear-text">No active alerts</div>
                  <div className="dash-notif-clear-sub">Conditions look safe for the next 48 hours</div>
                </div>
              ) : (
                <>
                  <div className="dash-notif-list">
                    {activeAlerts.map(alert => (
                      <div key={alert.id} className="dash-notif-item">
                        <span className="dash-notif-item-icon">{alert.icon}</span>
                        <span className="dash-notif-item-title" style={{ color: alert.color }}>
                          {alert.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="dash-notif-view-all"
                    onClick={() => { setNotifOpen(false); onNav?.('Alerts') }}
                  >
                    View All Alerts →
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <button
          className="dash-icon-btn"
          title="Back to home"
          onClick={handleReset}
        >
          🏠
        </button>

        <div
          className="dash-avatar"
          title={user?.email}
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="avatar"
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
            />
          ) : (
            getInitials(user?.email)
          )}
        </div>
      </div>
    </header>
  )
}