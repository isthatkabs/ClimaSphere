import { useState } from 'react'
import { HOURLY } from '../data/dashData'

export default function HourlyForecast() {
  const [activeHour, setActiveHour] = useState(0)

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <span className="dash-section-title">Hourly forecast</span>
        <span className="dash-section-sub">Next 11 hours</span>
      </div>
      <div className="dash-hourly-strip">
        {HOURLY.map((h, i) => (
          <div
            key={h.time}
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