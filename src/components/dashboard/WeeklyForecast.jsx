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

// Group the 3-hour slots by calendar day
function groupByDay(list) {
  const days = {}

  list.forEach(slot => {
    const date = new Date(slot.dt * 1000)
    const key  = date.toDateString() // e.g. "Mon Jan 01 2024"

    if (!days[key]) {
      days[key] = { date, slots: [] }
    }
    days[key].slots.push(slot)
  })

  // Convert to array and build one summary per day
  return Object.values(days).slice(0, 5).map(({ date, slots }, i) => {
    const temps  = slots.map(s => s.main.temp)
    const precip = slots.map(s => s.pop ?? 0)

    // Use the midday slot (or nearest) for the icon + condition
    const midday = slots.find(s => {
      const h = new Date(s.dt * 1000).getHours()
      return h >= 11 && h <= 14
    }) ?? slots[Math.floor(slots.length / 2)]

    const dayLabel = i === 0
      ? 'Today'
      : date.toLocaleDateString([], { weekday: 'short' }) // "Mon", "Tue"…

    return {
      day:    dayLabel,
      today:  i === 0,
      icon:   getWeatherEmoji(midday.weather[0].icon),
      cond:   midday.weather[0].description
                .split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' '),
      hi:     Math.round(Math.max(...temps)),
      lo:     Math.round(Math.min(...temps)),
      precip: `${Math.round(Math.max(...precip) * 100)}%`, // worst-case rain chance
    }
  })
}

export default function WeeklyForecast({ forecast }) {
  if (!forecast?.list) return null

  const days = groupByDay(forecast.list)

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