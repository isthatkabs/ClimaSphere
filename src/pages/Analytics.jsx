import { useMemo } from 'react'
import { useSettings, fmtTemp, fmtWind } from '../context/SettingsContext'
import '../styles/dash-analytics.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseHourly24(forecast) {
  if (!forecast?.hourly) return []
  const h = forecast.hourly
  return Array.from({ length: Math.min(24, h.time.length) }, (_, i) => ({
    time:     new Date(h.time[i]),
    temp:     h.temperature_2m[i]             ?? 0,
    feels:    h.apparent_temperature[i]       ?? 0,
    humidity: h.relativehumidity_2m[i]        ?? 0,
    precip:   h.precipitation_probability[i]  ?? 0,
    wind:     h.windspeed_10m[i]              ?? 0,
    cloud:    h.cloudcover[i]                 ?? 0,
  }))
}

function comfortScore(h) {
  let score = 100
  const t = h.temp
  if      (t < 0)   score -= 50
  else if (t < 8)   score -= 30
  else if (t < 14)  score -= 10
  else if (t > 32)  score -= 35
  else if (t > 27)  score -= 18
  if      (h.precip >= 70) score -= 35
  else if (h.precip >= 45) score -= 22
  else if (h.precip >= 25) score -= 10
  if      (h.wind > 60)  score -= 30
  else if (h.wind > 40)  score -= 16
  else if (h.wind > 28)  score -= 6
  return Math.max(0, Math.min(100, score))
}

function comfortMeta(score) {
  if (score >= 75) return { label: 'Great', color: '#22c55e', bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.22)' }
  if (score >= 55) return { label: 'Good',  color: '#84cc16', bg: 'rgba(132,204,22,0.10)',  border: 'rgba(132,204,22,0.22)' }
  if (score >= 35) return { label: 'Fair',  color: '#eab308', bg: 'rgba(234,179,8,0.10)',   border: 'rgba(234,179,8,0.22)' }
  if (score >= 15) return { label: 'Poor',  color: '#f97316', bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.22)' }
  return                   { label: 'Bad',   color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.22)' }
}

function fmtHour(date, fmt) {
  if (fmt === '12') return date.toLocaleTimeString([], { hour: 'numeric', hour12: true })
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function wmoEmoji(code) {
  if (code === 0)              return '☀️'
  if (code <= 2)               return '⛅'
  if (code <= 3)               return '☁️'
  if (code <= 48)              return '🌫'
  if (code <= 57)              return '🌦'
  if (code <= 67)              return '🌧'
  if (code <= 77)              return '❄️'
  if (code <= 82)              return '🌦'
  if (code <= 86)              return '🌨'
  return '⛈'
}

function uvMeta(uv) {
  if (uv <= 2)  return { label: 'Low',       color: '#22c55e' }
  if (uv <= 5)  return { label: 'Moderate',  color: '#eab308' }
  if (uv <= 7)  return { label: 'High',      color: '#f97316' }
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' }
  return               { label: 'Extreme',   color: '#a855f7' }
}

// ── SVG Temperature Chart ─────────────────────────────────────────────────────

function TempChart({ hours, settings }) {
  if (hours.length < 2) return null

  const temps = hours.map(h => h.temp)
  const feels = hours.map(h => h.feels)
  const all   = [...temps, ...feels]
  const minT  = Math.floor(Math.min(...all)) - 1
  const maxT  = Math.ceil(Math.max(...all))  + 1
  const span  = maxT - minT || 1

  const VW = 760, VH = 168, PX = 44, PY = 22
  const plotW = VW - PX * 2
  const plotH = VH - PY * 2
  const n     = hours.length

  const xOf = i => PX + (i / (n - 1)) * plotW
  const yOf = t => PY + (1 - (t - minT) / span) * plotH

  const toPath = vals =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ')

  const tempPath  = toPath(temps)
  const feelsPath = toPath(feels)
  const areaPath  = `${tempPath} L${xOf(n - 1).toFixed(1)},${(PY + plotH).toFixed(1)} L${xOf(0).toFixed(1)},${(PY + plotH).toFixed(1)} Z`

  // Y-axis gridlines at sensible intervals
  const step = span <= 8 ? 2 : span <= 20 ? 4 : 5
  const yGrid = []
  for (let t = Math.ceil(minT / step) * step; t <= maxT; t += step) yGrid.push(t)

  return (
    <svg viewBox={`0 0 ${VW} ${VH + 28}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="csTempFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {yGrid.map(t => (
        <g key={t}>
          <line x1={PX} y1={yOf(t)} x2={VW - PX} y2={yOf(t)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={PX - 6} y={yOf(t) + 4} textAnchor="end"
            fontSize="10" fill="rgba(226,234,252,0.3)">
            {fmtTemp(t, settings.tempUnit)}
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#csTempFill)" />
      <path d={feelsPath} fill="none" stroke="#a78bfa" strokeWidth="1.5"
        strokeDasharray="5,3" opacity="0.5" strokeLinecap="round" />
      <path d={tempPath} fill="none" stroke="#7c3aed" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />

      {hours.map((h, i) => {
        if (i % 3 !== 0) return null
        const cx = xOf(i), cy = yOf(h.temp)
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="3.5" fill="#7c3aed" stroke="#070c1a" strokeWidth="1.5" />
            <text x={cx} y={cy - 9} textAnchor="middle" fontSize="10" fill="rgba(226,234,252,0.65)">
              {fmtTemp(h.temp, settings.tempUnit)}
            </text>
            <text x={cx} y={VH + 18} textAnchor="middle" fontSize="10" fill="rgba(226,234,252,0.35)">
              {fmtHour(h.time, settings.timeFormat)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── SVG Precipitation Chart ───────────────────────────────────────────────────

function PrecipChart({ hours, settings }) {
  if (hours.length < 2) return null

  const VW = 760, VH = 90, PX = 44, PY = 8
  const plotW = VW - PX * 2
  const plotH = VH - PY - 20
  const n     = hours.length
  const barW  = (plotW / n) - 1.5

  return (
    <svg viewBox={`0 0 ${VW} ${VH + 22}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {[0, 50, 100].map(pct => (
        <g key={pct}>
          <line x1={PX} y1={PY + (1 - pct / 100) * plotH} x2={VW - PX} y2={PY + (1 - pct / 100) * plotH}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={PX - 6} y={PY + (1 - pct / 100) * plotH + 4} textAnchor="end"
            fontSize="9" fill="rgba(226,234,252,0.3)">
            {pct}%
          </text>
        </g>
      ))}

      {hours.map((h, i) => {
        const barH  = Math.max(2, (h.precip / 100) * plotH)
        const x     = PX + (i / n) * plotW + 0.75
        const y     = PY + plotH - barH
        const alpha = 0.15 + (h.precip / 100) * 0.72
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH}
              fill={`rgba(56,189,248,${alpha.toFixed(2)})`} rx="2" />
            {i % 4 === 0 && (
              <text x={x + barW / 2} y={VH + 16} textAnchor="middle"
                fontSize="10" fill="rgba(226,234,252,0.35)">
                {fmtHour(h.time, settings.timeFormat)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="cs-an-stat">
      <div className="cs-an-stat-icon" style={{ color }}>{icon}</div>
      <div className="cs-an-stat-val">{value}</div>
      <div className="cs-an-stat-label">{label}</div>
      {sub && <div className="cs-an-stat-sub">{sub}</div>}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Analytics({ weather, forecast, locationName }) {
  const { settings } = useSettings()

  const hours = useMemo(() => parseHourly24(forecast), [forecast])

  const daily = useMemo(() => {
    if (!forecast?.daily) return []
    const d = forecast.daily
    return Array.from({ length: Math.min(5, d.time.length) }, (_, i) => ({
      date:   new Date(d.time[i]),
      high:   d.temperature_2m_max[i]             ?? 0,
      low:    d.temperature_2m_min[i]              ?? 0,
      precip: d.precipitation_probability_max[i]   ?? 0,
      uv:     d.uv_index_max?.[i]                  ?? 0,
      code:   d.weathercode[i]                      ?? 0,
    }))
  }, [forecast])

  const stats = useMemo(() => {
    if (!hours.length) return null
    const avgHumidity = Math.round(hours.reduce((s, h) => s + h.humidity, 0) / hours.length)
    const avgWind     = Math.round(hours.reduce((s, h) => s + h.wind, 0) / hours.length)
    return { avgHumidity, avgWind }
  }, [hours])

  const comfortBlocks = useMemo(() => {
    if (!forecast?.hourly) return []
    const h = forecast.hourly
    const now = new Date()
    const startIdx = h.time.findIndex(t => new Date(t) >= now)
    const from = startIdx === -1 ? 0 : startIdx
    const blocks = []
    for (let i = from; i < Math.min(from + 24, h.time.length); i += 3) {
      const group = Array.from({ length: Math.min(3, h.time.length - i) }, (_, j) => ({
        time:   new Date(h.time[i + j]),
        temp:   h.temperature_2m[i + j]            ?? 0,
        precip: h.precipitation_probability[i + j] ?? 0,
        wind:   h.windspeed_10m[i + j]             ?? 0,
      }))
      const score = Math.round(group.reduce((s, hh) => s + comfortScore(hh), 0) / group.length)
      blocks.push({ time: group[0]?.time, score, meta: comfortMeta(score) })
    }
    return blocks
  }, [forecast])

  const allDayTemps = daily.flatMap(d => [d.low, d.high])
  const dayMinAll   = allDayTemps.length ? Math.min(...allDayTemps) : 0
  const dayMaxAll   = allDayTemps.length ? Math.max(...allDayTemps) : 40
  const daySpan     = dayMaxAll - dayMinAll || 1

  const todayUV     = daily[0]?.uv ?? 0
  const todayUVMeta = uvMeta(todayUV)

  const cityLabel = locationName ?? 'Your Location'

  if (!weather || !forecast) {
    return (
      <div className="cs-analytics">
        <div className="cs-an-title">Analytics</div>
        <div className="cs-an-sub">Loading weather data…</div>
      </div>
    )
  }

  const windKmh    = Math.round((weather.wind?.speed ?? 0) * 3.6)
  const visibilityM = weather.visibility ?? 10000

  return (
    <div className="cs-analytics">

      {/* ── Header ── */}
      <div className="cs-an-header">
        <div className="cs-an-title">Analytics</div>
        <div className="cs-an-sub">
          {cityLabel} · 24-hour trends &amp; 5-day breakdown
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="cs-an-stats-row">
        <StatCard
          icon="🌡"
          label="Today's Range"
          value={`${fmtTemp(daily[0]?.low ?? 0, settings.tempUnit)} → ${fmtTemp(daily[0]?.high ?? 0, settings.tempUnit)}`}
          color="#a78bfa"
        />
        <StatCard
          icon="💧"
          label="Avg Humidity"
          value={stats ? `${stats.avgHumidity}%` : '–'}
          sub={stats ? (stats.avgHumidity < 40 ? 'Dry air' : stats.avgHumidity < 65 ? 'Comfortable' : 'Humid') : ''}
          color="#38bdf8"
        />
        <StatCard
          icon="☀️"
          label="Peak UV Index"
          value={todayUV.toFixed(1)}
          sub={todayUVMeta.label}
          color={todayUVMeta.color}
        />
        <StatCard
          icon="💨"
          label="Avg Wind"
          value={stats ? fmtWind(stats.avgWind, settings.distanceUnit) : '–'}
          sub={stats ? (stats.avgWind < 20 ? 'Calm' : stats.avgWind < 40 ? 'Breezy' : 'Windy') : ''}
          color="#81c784"
        />
      </div>

      {/* ── Temperature Trend ── */}
      <div className="cs-section">
        <div className="cs-section-title">24-HOUR TEMPERATURE TREND</div>
        <div className="cs-card cs-an-chart-wrap">
          <div className="cs-an-legend">
            <span className="cs-an-legend-dot" style={{ background: '#7c3aed' }} />
            <span className="cs-an-legend-text">Temperature</span>
            <span className="cs-an-legend-dot cs-an-legend-dashed" style={{ background: '#a78bfa' }} />
            <span className="cs-an-legend-text">Feels Like</span>
          </div>
          <TempChart hours={hours} settings={settings} />
        </div>
      </div>

      {/* ── Precipitation Outlook ── */}
      <div className="cs-section">
        <div className="cs-section-title">24-HOUR PRECIPITATION PROBABILITY</div>
        <div className="cs-card cs-an-chart-wrap">
          <PrecipChart hours={hours} settings={settings} />
        </div>
      </div>

      {/* ── Comfort Windows ── */}
      <div className="cs-section">
        <div className="cs-section-title">BEST TIMES TO GO OUTSIDE</div>
        <div className="cs-card">
          <div className="cs-an-comfort-grid">
            {comfortBlocks.map((block, i) => (
              <div
                key={i}
                className="cs-an-comfort-block"
                style={{ background: block.meta.bg, borderColor: block.meta.border }}
              >
                <div className="cs-an-comfort-time">
                  {block.time ? fmtHour(block.time, settings.timeFormat) : '—'}
                </div>
                <div className="cs-an-comfort-score" style={{ color: block.meta.color }}>
                  {block.score}
                </div>
                <div className="cs-an-comfort-label" style={{ color: block.meta.color }}>
                  {block.meta.label}
                </div>
              </div>
            ))}
          </div>
          <div className="cs-an-comfort-key">
            {[
              { label: 'Great', color: '#22c55e' },
              { label: 'Good',  color: '#84cc16' },
              { label: 'Fair',  color: '#eab308' },
              { label: 'Poor',  color: '#f97316' },
              { label: 'Bad',   color: '#ef4444' },
            ].map(k => (
              <span key={k.label} className="cs-an-key-item">
                <span className="cs-an-legend-dot" style={{ background: k.color }} />
                {k.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5-Day Breakdown ── */}
      <div className="cs-section">
        <div className="cs-section-title">5-DAY FORECAST BREAKDOWN</div>
        <div className="cs-card">
          {daily.map((day, i) => {
            const label   = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : day.date.toLocaleDateString([], { weekday: 'long' })
            const lowPct  = ((day.low  - dayMinAll) / daySpan) * 100
            const highPct = ((day.high - dayMinAll) / daySpan) * 100
            const { color: uvc } = uvMeta(day.uv)
            return (
              <div key={i} className="cs-row cs-an-day-row">
                <span className="cs-row-icon">{wmoEmoji(day.code)}</span>
                <div className="cs-an-day-name">{label}</div>
                <div className="cs-an-day-temps">
                  <span className="cs-an-day-low">{fmtTemp(day.low, settings.tempUnit)}</span>
                  <div className="cs-an-temp-track">
                    <div className="cs-an-temp-fill"
                      style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }} />
                  </div>
                  <span className="cs-an-day-high">{fmtTemp(day.high, settings.tempUnit)}</span>
                </div>
                <div className="cs-an-day-meta">
                  <span
                    className="cs-badge"
                    style={{ color: uvc, borderColor: `${uvc}40`, background: `${uvc}14` }}
                  >
                    UV {Math.round(day.uv)}
                  </span>
                  <span className="cs-an-day-rain">🌧 {day.precip}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Current Conditions Snapshot ── */}
      <div className="cs-section">
        <div className="cs-section-title">CURRENT CONDITIONS SNAPSHOT</div>
        <div className="cs-card">
          {[
            {
              label: 'Humidity',
              value: weather.main.humidity,
              display: `${weather.main.humidity}%`,
              min: 0, max: 100,
              color: '#38bdf8',
            },
            {
              label: 'Cloud Cover',
              value: weather.clouds.all,
              display: `${weather.clouds.all}%`,
              min: 0, max: 100,
              color: '#90a4ae',
            },
            {
              label: 'Wind Speed',
              value: windKmh,
              display: fmtWind(windKmh, settings.distanceUnit),
              min: 0, max: 80,
              color: '#81c784',
            },
            {
              label: 'Pressure',
              value: weather.main.pressure,
              display: `${weather.main.pressure} hPa`,
              min: 960, max: 1060,
              color: '#ffb74d',
            },
            {
              label: 'Visibility',
              value: visibilityM,
              display: `${(visibilityM / 1000).toFixed(1)} km`,
              min: 0, max: 10000,
              color: '#ce93d8',
            },
          ].map(m => {
            const pct = Math.round(
              Math.min(100, Math.max(0, ((m.value - m.min) / (m.max - m.min)) * 100))
            )
            return (
              <div key={m.label} className="cs-an-snap-row">
                <div className="cs-an-snap-label">{m.label}</div>
                <div className="cs-an-snap-bar-wrap">
                  <div className="cs-an-snap-bar">
                    <div className="cs-an-snap-fill"
                      style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                </div>
                <div className="cs-an-snap-val" style={{ color: m.color }}>{m.display}</div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
