import { METRICS } from '../data/dashData'

export default function MetricsGrid() {
  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <span className="dash-section-title">Conditions</span>
      </div>
      <div className="dash-metrics-grid">
        {METRICS.map(m => (
          <div className="dash-metric-card" key={m.label}>
            <div className="dash-metric-header">
              <span className="dash-metric-icon">{m.icon}</span>
              <span className="dash-metric-label">{m.label}</span>
            </div>
            <div className="dash-metric-val">{m.val}</div>
            <div className="dash-metric-sub">{m.sub}</div>
            <div className="dash-metric-track">
              <div
                className="dash-metric-fill"
                style={{ width: `${m.fill}%`, background: m.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}