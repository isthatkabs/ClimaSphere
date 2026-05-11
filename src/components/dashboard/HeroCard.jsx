// Helper: convert wind degrees to compass direction
function getWindDirection(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}

// Helper: map OWM icon code to emoji
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

// Helper: how long ago the data was fetched
function getUpdatedText(unixTimestamp) {
  const diffMs = Date.now() - unixTimestamp * 1000
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just updated'
  if (mins === 1) return 'Updated 1 min ago'
  return `Updated ${mins} min ago`
}

export default function HeroCard({ weather }) {
  if (!weather) return null

  // Destructure the OpenWeatherMap response
  const {
    name,                                         // "London"
    sys: { country },                             // "GB"
    main: {
      temp,
      feels_like,
      temp_min,
      temp_max,
      humidity,
      pressure,
    },
    weather: [{ description, icon }],             // "partly cloudy", "02d"
    wind: { speed, deg },                         // m/s, degrees
    visibility,                                   // metres
    dt,                                           // Unix timestamp
  } = weather

  const windKmh = Math.round(speed * 3.6)        // convert m/s → km/h
  const windDir = getWindDirection(deg)
  const visKm = (visibility / 1000).toFixed(1)   // convert m → km
  const condition = description.charAt(0).toUpperCase() + description.slice(1)

  return (
    <div className="dash-hero-card">
      <div className="dash-hero-left">
        <div className="dash-hero-location">
          <span className="dash-hero-loc-dot" />
          {name}, {country}
        </div>

        <div className="dash-hero-temp-row">
          <div className="dash-hero-temp">{Math.round(temp)}°</div>
          <div className="dash-hero-temp-meta">
            <div className="dash-hero-condition">{condition}</div>
            <div className="dash-hero-hilo">
              H: {Math.round(temp_max)}° · L: {Math.round(temp_min)}°
            </div>
            <div className="dash-hero-updated">{getUpdatedText(dt)}</div>
          </div>
        </div>

        <div className="dash-hero-pills">
          <span className="dash-pill">💧 {humidity}% humidity</span>
          <span className="dash-pill">💨 {windKmh} km/h {windDir}</span>
          <span className="dash-pill">🌡 {pressure} hPa</span>
          <span className="dash-pill">👁 {visKm} km visibility</span>
        </div>
      </div>

      <div className="dash-hero-right">
        <div className="dash-hero-icon-big">{getWeatherEmoji(icon)}</div>
        <div className="dash-hero-right-stats">
          <div className="dash-right-stat">
            <span className="dash-right-stat-label">Feels like</span>
            <span className="dash-right-stat-val">{Math.round(feels_like)}°C</span>
          </div>
          <div className="dash-right-stat">
            <span className="dash-right-stat-label">Visibility</span>
            <span className="dash-right-stat-val">{visKm} km</span>
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