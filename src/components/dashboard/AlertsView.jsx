import { useMemo } from 'react'
import { useSettings, fmtTemp, fmtWind } from '../../context/SettingsContext'

// ── Alert definitions ─────────────────────────────────────────────
const ALERT_DEFS = [
  {
    id: 'storm',
    icon: '⛈',
    title: 'Thunderstorm Warning',
    severityLabel: 'Critical',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.2)',
    check: h => h.code >= 95,
  },
  {
    id: 'snow',
    icon: '❄️',
    title: 'Snow & Ice Warning',
    severityLabel: 'Warning',
    color: '#93c5fd',
    bg: 'rgba(147,197,253,0.08)',
    border: 'rgba(147,197,253,0.2)',
    check: h => h.code >= 71 && h.code <= 77,
  },
  {
    id: 'rain',
    icon: '🌧',
    title: 'Heavy Rain Alert',
    severityLabel: 'Alert',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.2)',
    check: h => h.precip >= 60,
  },
  {
    id: 'wind',
    icon: '💨',
    title: 'Strong Wind Advisory',
    severityLabel: 'Advisory',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
    check: h => h.wind > 50,
  },
  {
    id: 'fog',
    icon: '🌫',
    title: 'Dense Fog Advisory',
    severityLabel: 'Advisory',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.08)',
    border: 'rgba(148,163,184,0.2)',
    check: h => h.visibility < 1000,
  },
  {
    id: 'heat',
    icon: '🌡',
    title: 'Extreme Heat Warning',
    severityLabel: 'Warning',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.2)',
    check: h => h.apparent_temp > 35,
  },
]

// ── Helpers ───────────────────────────────────────────────────────
function fmtSlotTime(date, timeFormat) {
  if (timeFormat === '12') return date.toLocaleTimeString([], { hour: 'numeric', hour12: true })
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function fmtSlotDay(date) {
  const now = new Date()
  if (date.toDateString() === now.toDateString()) return 'Today'
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString([], { weekday: 'short' })
}

function getTimeWindow(first, last, timeFormat) {
  const firstDay = fmtSlotDay(first.time)
  const lastDay  = fmtSlotDay(last.time)
  const firstT   = fmtSlotTime(first.time, timeFormat)
  const lastT    = fmtSlotTime(last.time, timeFormat)
  if (firstDay === lastDay) return `${firstDay}, ${firstT} – ${lastT}`
  return `${firstDay} ${firstT} – ${lastDay} ${lastT}`
}

function parseHours(forecast) {
  if (!forecast?.hourly) return []
  const { time, weathercode, precipitation_probability, windspeed_10m, visibility, apparent_temperature } = forecast.hourly
  const now    = new Date()
  const cutoff = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  return time
    .map((t, i) => ({
      time:          new Date(t),
      code:          weathercode?.[i]              ?? 0,
      precip:        precipitation_probability?.[i] ?? 0,
      wind:          windspeed_10m?.[i]             ?? 0,
      visibility:    visibility?.[i]                ?? 99999,
      apparent_temp: apparent_temperature?.[i]       ?? 0,
    }))
    .filter(h => h.time >= now && h.time <= cutoff)
}

function buildAlerts(hours) {
  return ALERT_DEFS.reduce((acc, def) => {
    const matching = hours.filter(h => def.check(h))
    if (matching.length === 0) return acc
    acc.push({
      ...def,
      first:       matching[0],
      last:        matching[matching.length - 1],
      count:       matching.length,
      peakWind:    Math.max(...matching.map(h => h.wind)),
      peakTemp:    Math.max(...matching.map(h => h.apparent_temp)),
      peakPrecip:  Math.max(...matching.map(h => h.precip)),
    })
    return acc
  }, [])
}

function getDesc(alert, settings) {
  switch (alert.id) {
    case 'storm': return `Thunderstorms from ${fmtSlotTime(alert.first.time, settings.timeFormat)}`
    case 'snow':  return `Snow starting ${fmtSlotTime(alert.first.time, settings.timeFormat)}`
    case 'rain':  return `Peak ${alert.peakPrecip}% precipitation chance`
    case 'wind':  return `Gusts up to ${fmtWind(alert.peakWind, settings.distanceUnit)}`
    case 'fog':   return 'Visibility drops below 1 km'
    case 'heat':  return `Feels like ${fmtTemp(alert.peakTemp, settings.tempUnit)}`
    default:      return ''
  }
}

// ── Sub-components ────────────────────────────────────────────────
function AlertCard({ alert, settings }) {
  const window = getTimeWindow(alert.first, alert.last, settings.timeFormat)
  const desc   = getDesc(alert, settings)
  const pct    = Math.min(100, Math.round((alert.count / 24) * 100))

  return (
    <div className="cs-alert-card" style={{ borderColor: alert.border, background: alert.bg }}>
      <div className="cs-alert-card-top">
        <span className="cs-alert-card-icon">{alert.icon}</span>
        <div className="cs-alert-card-info">
          <div className="cs-alert-card-title" style={{ color: alert.color }}>{alert.title}</div>
          <div className="cs-alert-card-window">{window}</div>
        </div>
        <span
          className="cs-alert-severity"
          style={{ color: alert.color, background: alert.bg, borderColor: alert.border }}
        >
          {alert.severityLabel}
        </span>
      </div>

      <div className="cs-alert-progress">
        <div
          className="cs-alert-progress-fill"
          style={{ width: `${pct}%`, background: alert.color }}
        />
      </div>

      <div className="cs-alert-card-footer">
        <span className="cs-alert-footer-left">
          {alert.count} hr{alert.count !== 1 ? 's' : ''} affected · {pct}% of next 24h
        </span>
        <span className="cs-alert-footer-right" style={{ color: alert.color }}>
          {desc}
        </span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function AlertsView({ forecast, weather }) {
  const { settings } = useSettings()

  const hours  = useMemo(() => parseHours(forecast),  [forecast])
  const alerts = useMemo(() => buildAlerts(hours),     [hours])

  const timeline = useMemo(() => {
    const next24 = hours.slice(0, 24)
    const groups = []
    for (let i = 0; i < next24.length; i += 3) {
      const group      = next24.slice(i, i + 3)
      const activeDefs = ALERT_DEFS.filter(def => group.some(h => def.check(h)))
      groups.push({ startTime: group[0]?.time, activeDefs, hasAlert: activeDefs.length > 0 })
    }
    return groups
  }, [hours])

  const locationName = weather?.name ?? 'Current Location'
  const activeIds    = new Set(alerts.map(a => a.id))

  return (
    <div className="cs-alerts">

      {/* Header */}
      <div className="cs-alerts-header">
        <div>
          <div className="cs-alerts-title">Alerts</div>
          <div className="cs-alerts-sub">{locationName} · Next 48 hours</div>
        </div>
        <div className={`cs-alerts-badge ${alerts.length > 0 ? 'active' : 'clear'}`}>
          {alerts.length > 0 ? `${alerts.length} Active` : 'All Clear'}
        </div>
      </div>

      {/* Alert cards or all-clear */}
      {alerts.length === 0 ? (
        <div className="cs-alerts-clear">
          <div className="cs-alerts-clear-icon">✅</div>
          <div className="cs-alerts-clear-text">No active weather alerts</div>
          <div className="cs-alerts-clear-sub">Conditions look safe for the next 48 hours.</div>
        </div>
      ) : (
        <div className="cs-alerts-grid">
          {alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} settings={settings} />
          ))}
        </div>
      )}

      {/* 24-hour timeline */}
      <div className="cs-section">
        <div className="cs-section-title">24-HOUR OVERVIEW</div>
        <div className="cs-card cs-alerts-timeline-wrap">
          {timeline.map((group, i) => (
            <div
              key={i}
              className={`cs-timeline-slot${group.hasAlert ? ' alert' : ''}`}
            >
              <div className="cs-timeline-time">
                {group.startTime ? fmtSlotTime(group.startTime, settings.timeFormat) : '—'}
              </div>
              <div className="cs-timeline-icons">
                {group.activeDefs.length > 0
                  ? group.activeDefs.map(d => (
                    <span key={d.id} title={d.title} style={{ color: d.color }}>{d.icon}</span>
                  ))
                  : <span className="cs-timeline-ok">✓</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitored conditions reference */}
      <div className="cs-section">
        <div className="cs-section-title">MONITORED CONDITIONS</div>
        <div className="cs-card">
          {ALERT_DEFS.map(def => (
            <div key={def.id} className="cs-row">
              <span className="cs-row-icon">{def.icon}</span>
              <div className="cs-row-text">
                <span className="cs-row-label">{def.title}</span>
                <span className="cs-row-sub" style={{ color: def.color, opacity: 0.75 }}>
                  {def.severityLabel}
                </span>
              </div>
              {activeIds.has(def.id) && (
                <span
                  className="cs-badge"
                  style={{ color: def.color, background: def.bg, borderColor: def.border }}
                >
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
