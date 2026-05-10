export default function HeroCard() {
  return (
    <div className="dash-hero-card">
      <div className="dash-hero-left">
        <div className="dash-hero-location">
          <span className="dash-hero-loc-dot" />
          London, United Kingdom
        </div>

        <div className="dash-hero-temp-row">
          <div className="dash-hero-temp">18°</div>
          <div className="dash-hero-temp-meta">
            <div className="dash-hero-condition">Partly Cloudy</div>
            <div className="dash-hero-hilo">H: 22° · L: 13°</div>
            <div className="dash-hero-updated">Updated 2 min ago</div>
          </div>
        </div>

        <div className="dash-hero-pills">
          <span className="dash-pill">💧 74% humidity</span>
          <span className="dash-pill">💨 18 km/h SW</span>
          <span className="dash-pill">☀️ UV 3</span>
          <span className="dash-pill">🌡 1013 hPa</span>
        </div>
      </div>

      <div className="dash-hero-right">
        <div className="dash-hero-icon-big">⛅</div>
        <div className="dash-hero-right-stats">
          <div className="dash-right-stat">
            <span className="dash-right-stat-label">Feels like</span>
            <span className="dash-right-stat-val">16°C</span>
          </div>
          <div className="dash-right-stat">
            <span className="dash-right-stat-label">Rain chance</span>
            <span className="dash-right-stat-val">10%</span>
          </div>
          <div className="dash-right-stat">
            <span className="dash-right-stat-label">Visibility</span>
            <span className="dash-right-stat-val">12 km</span>
          </div>
        </div>
      </div>
    </div>
  )
}