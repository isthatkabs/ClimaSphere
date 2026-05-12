// Helper: clamp a value between 0–100 for the fill bar
function toPercent(value, min, max) {
  return Math.round(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)))
}

function humidityLabel(h) {
  if (h < 30) return 'Dry air'
  if (h < 60) return 'Comfortable'
  if (h < 80) return 'Humid'
  return 'Very humid'
}

function windLabel(kmh) {
  if (kmh < 10) return 'Calm'
  if (kmh < 30) return 'Light breeze'
  if (kmh < 50) return 'Moderate wind'
  return 'Strong wind'
}

function visibilityLabel(km) {
  if (km < 1)  return 'Very poor'
  if (km < 4)  return 'Poor'
  if (km < 8)  return 'Moderate'
  return 'Good'
}

function pressureLabel(hpa) {
  if (hpa < 990)  return 'Low pressure'
  if (hpa < 1010) return 'Near normal'
  if (hpa < 1025) return 'Normal'
  return 'High pressure'
}

function cloudLabel(pct) {
  if (pct < 20) return 'Clear skies'
  if (pct < 50) return 'Partly cloudy'
  if (pct < 85) return 'Mostly cloudy'
  return 'Overcast'
}

function feelsLikeLabel(temp) {
  if (temp < 0)  return 'Freezing'
  if (temp < 10) return 'Cold'
  if (temp < 18) return 'Cool'
  if (temp < 25) return 'Comfortable'
  return 'Warm'
}

export default function MetricsGrid({ weather, selectedHour }) {
  // If a forecast hour is selected AND it has the fields we need, use it.
  // Otherwise fall back to live weather.
  const useForecast = selectedHour &&
    selectedHour.humidity   != null &&
    selectedHour.windspeed  != null &&
    selectedHour.feelsLike  != null

  let humidity, windKmh, visKm, pressure, cloudiness, feelsLike, isForecasted

  if (useForecast) {
    humidity    = selectedHour.humidity
    windKmh     = Math.round(selectedHour.windspeed)          // open-meteo already in km/h
    visKm       = selectedHour.visibilityM != null
                    ? (selectedHour.visibilityM / 1000).toFixed(1)
                    : '–'
    pressure    = Math.round(selectedHour.pressure ?? 1013)
    cloudiness  = selectedHour.cloudcover ?? 0
    feelsLike   = Math.round(selectedHour.feelsLike)
    isForecasted = true
  } else {
    if (!weather) return null
    const {
      main: { humidity: h, pressure: p, feels_like: fl },
      wind: { speed },
      visibility,
      clouds: { all: cl },
    } = weather
    humidity   = h
    windKmh    = Math.round(speed * 3.6)
    visKm      = (visibility / 1000).toFixed(1)
    pressure   = p
    cloudiness = cl
    feelsLike  = Math.round(fl)
    isForecasted = false
  }

  const metrics = [
    {
      icon:  '💧',
      label: 'Humidity',
      val:   `${humidity}%`,
      sub:   humidityLabel(humidity),
      fill:  humidity,
      color: '#4fc3f7',
    },
    {
      icon:  '💨',
      label: 'Wind speed',
      val:   `${windKmh} km/h`,
      sub:   windLabel(windKmh),
      fill:  toPercent(windKmh, 0, 100),
      color: '#81c784',
    },
    {
      icon:  '👁',
      label: 'Visibility',
      val:   `${visKm} km`,
      sub:   visibilityLabel(parseFloat(visKm)),
      fill:  toPercent(parseFloat(visKm) * 1000, 0, 10000),
      color: '#ce93d8',
    },
    {
      icon:  '🌡',
      label: 'Pressure',
      val:   `${pressure} hPa`,
      sub:   pressureLabel(pressure),
      fill:  toPercent(pressure, 960, 1060),
      color: '#ffb74d',
    },
    {
      icon:  '☁️',
      label: 'Cloud cover',
      val:   `${cloudiness}%`,
      sub:   cloudLabel(cloudiness),
      fill:  cloudiness,
      color: '#90a4ae',
    },
    {
      icon:  '🤔',
      label: 'Feels like',
      val:   `${feelsLike}°C`,
      sub:   feelsLikeLabel(feelsLike),
      fill:  toPercent(feelsLike, -10, 40),
      color: '#ef9a9a',
    },
  ]

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <span className="dash-section-title">Conditions</span>
        {isForecasted && (
          <span className="dash-section-sub" style={{ color: '#a78bfa' }}>
            📅 Forecast · {selectedHour.time}
          </span>
        )}
      </div>
      <div className="dash-metrics-grid">
        {metrics.map(m => (
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