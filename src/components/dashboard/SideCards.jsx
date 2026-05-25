import { useState, useEffect } from 'react'
import { getAQI } from '../../services/weather'

// ── Sun helpers ───────────────────────────────────────────────
function formatTime(unixTs) {
  return new Date(unixTs * 1000).toLocaleTimeString([], {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function getSunPct(sunrise, sunset) {
  const now = Date.now() / 1000
  if (now <= sunrise) return 0
  if (now >= sunset)  return 100
  return Math.round(((now - sunrise) / (sunset - sunrise)) * 100)
}

function getDaylightText(sunrise, sunset) {
  const totalMins = Math.round((sunset - sunrise) / 60)
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  return `${h} hrs ${m} min of daylight`
}

// ── AQI helpers ───────────────────────────────────────────────
const AQI_LEVELS = [
  { max: 1, label: 'Good',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  { max: 2, label: 'Fair',      color: '#a3e635', bg: 'rgba(163,230,53,0.12)' },
  { max: 3, label: 'Moderate',  color: '#facc15', bg: 'rgba(250,204,21,0.12)' },
  { max: 4, label: 'Poor',      color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  { max: 5, label: 'Very Poor', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
]

function getAqiInfo(aqi) {
  return AQI_LEVELS.find(l => aqi <= l.max) ?? AQI_LEVELS[4]
}

// ── Moon phase (calculated — not in free OWM API) ─────────────
function getMoonPhase() {
  const knownNewMoon  = new Date('2000-01-06T18:14:00Z').getTime()
  const lunarCycleMs  = 29.53058867 * 24 * 60 * 60 * 1000
  const phase         = ((Date.now() - knownNewMoon) % lunarCycleMs) / lunarCycleMs

  const illumination  = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100)

  let name, emoji
  if      (phase < 0.0625) { name = 'New Moon';        emoji = '🌑' }
  else if (phase < 0.1875) { name = 'Waxing Crescent'; emoji = '🌒' }
  else if (phase < 0.3125) { name = 'First Quarter';   emoji = '🌓' }
  else if (phase < 0.4375) { name = 'Waxing Gibbous';  emoji = '🌔' }
  else if (phase < 0.5625) { name = 'Full Moon';       emoji = '🌕' }
  else if (phase < 0.6875) { name = 'Waning Gibbous';  emoji = '🌖' }
  else if (phase < 0.8125) { name = 'Last Quarter';    emoji = '🌗' }
  else if (phase < 0.9375) { name = 'Waning Crescent'; emoji = '🌘' }
  else                     { name = 'New Moon';        emoji = '🌑' }

  return { name, emoji, illumination }
}

// ── Component ─────────────────────────────────────────────────
export default function SideCards({ weather }) {
  const [aqi, setAqi] = useState(null)

  // Fetch AQI using the lat/lon from the weather response
  useEffect(() => {
    if (!weather?.coord) return

    const { lat, lon } = weather.coord
    getAQI(lat, lon)
      .then(data => setAqi(data.list?.[0]?.main?.aqi ?? null))
      .catch(() => setAqi(null))
  }, [weather?.coord?.lat, weather?.coord?.lon])

  if (!weather) return null

  const { sys: { sunrise, sunset } } = weather
  const sunPct    = getSunPct(sunrise, sunset)
  const aqiInfo   = aqi ? getAqiInfo(aqi) : null
  const moon      = getMoonPhase()

  return (
    <div className="dash-bottom-right">

      {/* Sunrise & Sunset */}
      <div className="dash-side-card">
        <div className="dash-side-card-title">Sunrise &amp; Sunset</div>
        <div className="dash-sun-arc">
          <div
            className="dash-sun-dot"
            style={{ left: `calc(${sunPct}% - 9px)` }}
          >
            ☀️
          </div>
        </div>
        <div className="dash-sun-times">
          <div className="dash-sun-item">
            <span className="dash-sun-lbl">Sunrise</span>
            <span className="dash-sun-val">{formatTime(sunrise)}</span>
          </div>
          <div className="dash-sun-item">
            <span className="dash-sun-lbl">Sunset</span>
            <span className="dash-sun-val">{formatTime(sunset)}</span>
          </div>
        </div>
        <div className="dash-sun-pct">{getDaylightText(sunrise, sunset)}</div>
      </div>

      {/* AQI */}
      <div className="dash-side-card">
        <div className="dash-side-card-title">Air Quality Index</div>
        {aqiInfo ? (
          <>
            <div className="dash-aqi-row">
              <span className="dash-aqi-val" style={{ color: aqiInfo.color }}>
                {aqi}
              </span>
              <span
                className="dash-aqi-badge"
                style={{ background: aqiInfo.bg, color: aqiInfo.color }}
              >
                {aqiInfo.label}
              </span>
            </div>
            <div className="dash-aqi-track">
              <div
                className="dash-aqi-cursor"
                style={{ left: `calc(${((aqi - 1) / 4) * 100}% - 1px)` }}
              />
            </div>
            <div className="dash-aqi-labels">
              <span>Good</span><span>Moderate</span><span>Very Poor</span>
            </div>
          </>
        ) : (
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', paddingTop: '8px' }}>
            Loading air quality…
          </div>
        )}
      </div>

      {/* Moon Phase */}
      <div className="dash-side-card">
        <div className="dash-side-card-title">Moon Phase</div>
        <div className="dash-moon-row">
          <div>
            <div className="dash-moon-phase">{moon.name}</div>
            <div className="dash-moon-sub">{moon.illumination}% illuminated</div>
          </div>
          <div className="dash-moon-icon">{moon.emoji}</div>
        </div>
      </div>

    </div>
  )
}