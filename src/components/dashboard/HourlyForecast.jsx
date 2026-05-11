import { useState } from 'react'

// Same helper as HeroCard — consider moving this to a utils.js file
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

// Helper: format Unix timestamp → "2 PM" / "14:00"
function formatHour(unixTimestamp) {
  return new Date(unixTimestamp * 1000).toLocaleTimeString([], {
    hour: 'numeric',
    hour12: true,
  })
}

export default function HourlyForecast({ forecast }) {
  const [activeHour, setActiveHour] = useState(0)

  if (!forecast?.list) return null

  // OWM gives 3-hour slots — take the next 11
  const hours = forecast.list.slice(0, 11).map((slot) => ({
    time: formatHour(slot.dt),                        // "2 PM"
    icon: getWeatherEmoji(slot.weather[0].icon),      // "🌦️"
    temp: Math.round(slot.main.temp),                 // 18
    precip: Math.round((slot.pop ?? 0) * 100),        // 0–1 → 0–100%
  }))

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <span className="dash-section-title">Hourly forecast</span>
        <span className="dash-section-sub">Next 11 hours</span>
      </div>
      <div className="dash-hourly-strip">
        {hours.map((h, i) => (
          <div
            key={h.time + i}
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
  )
}