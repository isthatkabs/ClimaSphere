import { useState, useEffect } from 'react'

function getWeatherEmoji(code) {
  if (code === 0)  return '☀️'
  if (code <= 2)   return '⛅'
  if (code <= 3)   return '☁️'
  if (code <= 48)  return '🌫️'
  if (code <= 57)  return '🌦️'
  if (code <= 67)  return '🌧️'
  if (code <= 77)  return '❄️'
  if (code <= 82)  return '🌦️'
  if (code <= 99)  return '⛈️'
  return '🌡️'
}

export default function HourlyForecast({ forecast, onHourSelect }) {
  const [activeHour, setActiveHour] = useState(0)

  if (!forecast?.hourly) return null

  const {
    time,
    temperature_2m,
    precipitation_probability,
    weathercode,
    windspeed_10m,
    relativehumidity_2m,
    apparent_temperature,
    cloudcover,
    visibility,
    surface_pressure,
  } = forecast.hourly

  // Find current hour index then take next 12
  const now    = new Date()
  const startI = time.findIndex(t => new Date(t) >= now)
  const hours  = Array.from({ length: 12 }, (_, i) => startI + i)
    .filter(i => i < time.length)
    .map((i, arrIndex) => ({
      time:        arrIndex === 0 ? 'Now' : new Date(time[i]).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      temp:        Math.round(temperature_2m[i]),
      precip:      precipitation_probability[i] ?? 0,
      icon:        getWeatherEmoji(weathercode[i]),
      humidity:    relativehumidity_2m?.[i]  ?? null,
      windspeed:   windspeed_10m?.[i]        ?? null,
      feelsLike:   apparent_temperature?.[i] ?? null,
      cloudcover:  cloudcover?.[i]           ?? null,
      visibilityM: visibility?.[i]           ?? null,
      pressure:    surface_pressure?.[i]     ?? null,
    }))

  // Fire on mount so MetricsGrid starts in sync with "Now"
  useEffect(() => {
    if (hours.length > 0 && onHourSelect) onHourSelect(hours[0])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast])

  const handleSelect = (i) => {
    setActiveHour(i)
    if (onHourSelect) onHourSelect(hours[i])
  }

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <span className="dash-section-title">Hourly forecast</span>
        <span className="dash-section-sub">Next 12 hours · click a card to see conditions</span>
      </div>
      <div className="dash-hourly-strip">
        {hours.map((h, i) => (
          <div
            key={i}
            className={`dash-hourly-item${i === activeHour ? ' active' : ''}`}
            onClick={() => handleSelect(i)}
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