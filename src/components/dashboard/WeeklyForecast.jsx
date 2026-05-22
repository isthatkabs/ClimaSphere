import { useState } from 'react'
import { useSettings, fmtTempShort } from '../../context/SettingsContext'

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

function getCondition(code) {
  if (code === 0)  return 'Clear sky'
  if (code <= 2)   return 'Partly cloudy'
  if (code <= 3)   return 'Overcast'
  if (code <= 48)  return 'Foggy'
  if (code <= 57)  return 'Drizzle'
  if (code <= 67)  return 'Rain'
  if (code <= 77)  return 'Snow'
  if (code <= 82)  return 'Showers'
  if (code <= 99)  return 'Thunderstorm'
  return 'Unknown'
}

export default function WeeklyForecast({ forecast }) {
  const { settings } = useSettings()
  const { tempUnit } = settings
  const [selectedIdx, setSelectedIdx] = useState(null)

  if (!forecast?.daily) return null

  const {
    time,
    weathercode,
    temperature_2m_max,
    temperature_2m_min,
    precipitation_probability_max,
  } = forecast.daily

  const hourly = forecast.hourly

  const days = time.map((t, i) => {
    const midday = i * 24 + 12
    return {
      day:        i === 0 ? 'Today' : new Date(t).toLocaleDateString('en-GB', { weekday: 'short' }),
      today:      i === 0,
      icon:       getWeatherEmoji(weathercode[i]),
      cond:       getCondition(weathercode[i]),
      hi:         temperature_2m_max[i],
      lo:         temperature_2m_min[i],
      precip:     `${precipitation_probability_max[i] ?? 0}%`,
      feelsLike:  hourly?.apparent_temperature?.[midday],
      humidity:   hourly?.relativehumidity_2m?.[midday],
      wind:       hourly?.windspeed_10m?.[midday],
      cloud:      hourly?.cloudcover?.[midday],
    }
  })

  function handleClick(i) {
    setSelectedIdx(prev => prev === i ? null : i)
  }

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <span className="dash-section-title">5-day forecast</span>
      </div>
      <div className="dash-weekly-list">
        {days.map((w, i) => (
          <div key={w.day} className="dash-weekly-entry">
            <div
              className={`dash-weekly-item${w.today ? ' today' : ''}${selectedIdx === i ? ' selected' : ''}`}
              onClick={() => handleClick(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleClick(i)}
            >
              <span className="dash-weekly-day">{w.day}</span>
              <span className="dash-weekly-icon">{w.icon}</span>
              <span className="dash-weekly-cond">{w.cond}</span>
              <div className="dash-weekly-right">
                <span className="dash-weekly-precip">💧 {w.precip}</span>
                <div className="dash-weekly-temps">
                  <span className="dash-weekly-hi">{fmtTempShort(w.hi, tempUnit)}</span>
                  <span className="dash-weekly-lo">{fmtTempShort(w.lo, tempUnit)}</span>
                </div>
                <span className="dash-weekly-chevron">{selectedIdx === i ? '▲' : '▼'}</span>
              </div>
            </div>

            {selectedIdx === i && (
              <div className="dash-weekly-detail">
                {w.feelsLike != null && (
                  <div className="dash-weekly-detail-item">
                    <span className="dash-detail-label">Feels like</span>
                    <span className="dash-detail-value">{fmtTempShort(w.feelsLike, tempUnit)}</span>
                  </div>
                )}
                {w.humidity != null && (
                  <div className="dash-weekly-detail-item">
                    <span className="dash-detail-label">Humidity</span>
                    <span className="dash-detail-value">{w.humidity}%</span>
                  </div>
                )}
                {w.wind != null && (
                  <div className="dash-weekly-detail-item">
                    <span className="dash-detail-label">Wind</span>
                    <span className="dash-detail-value">{Math.round(w.wind)} km/h</span>
                  </div>
                )}
                {w.cloud != null && (
                  <div className="dash-weekly-detail-item">
                    <span className="dash-detail-label">Cloud cover</span>
                    <span className="dash-detail-value">{w.cloud}%</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
