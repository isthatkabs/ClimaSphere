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
  if (!forecast?.daily) return null

  const {
    time,
    weathercode,
    temperature_2m_max,
    temperature_2m_min,
    precipitation_probability_max,
  } = forecast.daily

  const days = time.map((t, i) => ({
    day:    i === 0 ? 'Today' : new Date(t).toLocaleDateString('en-GB', { weekday: 'short' }),
    today:  i === 0,
    icon:   getWeatherEmoji(weathercode[i]),
    cond:   getCondition(weathercode[i]),
    hi:     Math.round(temperature_2m_max[i]),
    lo:     Math.round(temperature_2m_min[i]),
    precip: `${precipitation_probability_max[i] ?? 0}%`,
  }))

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <span className="dash-section-title">5-day forecast</span>
      </div>
      <div className="dash-weekly-list">
        {days.map(w => (
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
  )
}