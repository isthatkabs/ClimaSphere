const sunPct = 38
const aqiVal = 42
const aqiPct = (aqiVal / 300) * 100

export default function SideCards() {
  return (
    <div className="dash-bottom-right">

      {/* Sunrise & Sunset */}
      <div className="dash-side-card">
        <div className="dash-side-card-title">Sunrise &amp; Sunset</div>
        <div className="dash-sun-arc">
          <div
            className="dash-sun-dot"
            style={{ left: `calc(${sunPct}% - 9px)` }}
          >
            ☀️
          </div>
        </div>
        <div className="dash-sun-times">
          <div className="dash-sun-item">
            <span className="dash-sun-lbl">Sunrise</span>
            <span className="dash-sun-val">5:14 AM</span>
          </div>
          <div className="dash-sun-item">
            <span className="dash-sun-lbl">Sunset</span>
            <span className="dash-sun-val">9:02 PM</span>
          </div>
        </div>
        <div className="dash-sun-pct">15 hrs 48 min of daylight</div>
      </div>

      {/* AQI */}
      <div className="dash-side-card">
        <div className="dash-side-card-title">Air Quality Index</div>
        <div className="dash-aqi-row">
          <span className="dash-aqi-val" style={{ color: '#22c55e' }}>{aqiVal}</span>
          <span
            className="dash-aqi-badge"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
          >
            Good
          </span>
        </div>
        <div className="dash-aqi-track">
          <div
            className="dash-aqi-cursor"
            style={{ left: `calc(${aqiPct}% - 1px)` }}
          />
        </div>
        <div className="dash-aqi-labels">
          <span>Good</span><span>Moderate</span><span>Poor</span>
        </div>
      </div>

      {/* Moon Phase */}
      <div className="dash-side-card">
        <div className="dash-side-card-title">Moon Phase</div>
        <div className="dash-moon-row">
          <div>
            <div className="dash-moon-phase">Waxing Gibbous</div>
            <div className="dash-moon-sub">84% illuminated · rises 4:12 PM</div>
          </div>
          <div className="dash-moon-icon">🌔</div>
        </div>
      </div>

    </div>
  )
}