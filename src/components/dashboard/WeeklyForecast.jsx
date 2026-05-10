import { WEEKLY } from '../data/dashData'

export default function WeeklyForecast() {
  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <span className="dash-section-title">5-day forecast</span>
      </div>
      <div className="dash-weekly-list">
        {WEEKLY.map(w => (
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