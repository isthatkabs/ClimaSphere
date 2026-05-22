import { useSettings, fmtTemp, fmtTempShort, fmtWind, fmtDist } from '../../context/SettingsContext'

function getWindDirection(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}

function getWeatherEmoji(iconCode) {
  const map = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '⛅',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  }
  return map[iconCode] || '🌡️'
}

function getUpdatedText(unixTimestamp) {
  const diffMs = Date.now() - unixTimestamp * 1000
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just updated'
  if (mins === 1) return 'Updated 1 min ago'
  return `Updated ${mins} min ago`
}

function getCountryName(code) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

export default function HeroCard({ weather }) {
  const { settings } = useSettings()
  if (!weather) return null

  const {
    name,
    sys: { country },
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    weather: [{ description, icon }],
    wind: { speed, deg },
    visibility,
    dt,
  } = weather

  const windKmh = speed * 3.6
  const windDir = getWindDirection(deg)
  const visKm   = (visibility / 1000).toFixed(1)
  const condition = description.charAt(0).toUpperCase() + description.slice(1)

  const { tempUnit, distanceUnit } = settings

  return (
    <div className="dash-hero-card">
      <div className="dash-hero-left">
        <div className="dash-hero-location">
          <span className="dash-hero-loc-dot" />
          {name}, {getCountryName(country)}
        </div>

        <div className="dash-hero-temp-row">
          <div className="dash-hero-temp">{fmtTempShort(temp, tempUnit)}</div>
          <div className="dash-hero-temp-meta">
            <div className="dash-hero-condition">{condition}</div>
            <div className="dash-hero-hilo">
              H: {fmtTempShort(temp_max, tempUnit)} · L: {fmtTempShort(temp_min, tempUnit)}
            </div>
            <div className="dash-hero-updated">{getUpdatedText(dt)}</div>
          </div>
        </div>

        <div className="dash-hero-pills">
          <span className="dash-pill">💧 {humidity}% humidity</span>
          <span className="dash-pill">💨 {fmtWind(windKmh, distanceUnit)} {windDir}</span>
          <span className="dash-pill">🌡 {pressure} hPa</span>
          <span className="dash-pill">👁 {fmtDist(visKm, distanceUnit)} visibility</span>
        </div>
      </div>

      <div className="dash-hero-right">
        <div className="dash-hero-icon-big">{getWeatherEmoji(icon)}</div>
        <div className="dash-hero-right-stats">
          <div className="dash-right-stat">
            <span className="dash-right-stat-label">Feels like</span>
            <span className="dash-right-stat-val">{fmtTemp(feels_like, tempUnit)}</span>
          </div>
          <div className="dash-right-stat">
            <span className="dash-right-stat-label">Visibility</span>
            <span className="dash-right-stat-val">{fmtDist(visKm, distanceUnit)}</span>
          </div>
          <div className="dash-right-stat">
            <span className="dash-right-stat-label">Pressure</span>
            <span className="dash-right-stat-val">{pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  )
}
