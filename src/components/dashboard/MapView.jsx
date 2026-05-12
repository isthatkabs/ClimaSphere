import { useState, useEffect } from 'react'

// WMO weather code → label
function getCondition(code) {
  if (code === 0)  return 'Clear'
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

// A handful of world cities to dot the map
const CITIES = [
  { name: 'London',     lat: 51.51,  lon: -0.13,   x: 47.5, y: 26 },
  { name: 'New York',   lat: 40.71,  lon: -74.01,  x: 21,   y: 32 },
  { name: 'Paris',      lat: 48.86,  lon:  2.35,   x: 49,   y: 24 },
  { name: 'Tokyo',      lat: 35.68,  lon: 139.69,  x: 79,   y: 31 },
  { name: 'Sydney',     lat: -33.87, lon: 151.21,  x: 82,   y: 68 },
  { name: 'Dubai',      lat: 25.20,  lon: 55.27,   x: 59,   y: 37 },
  { name: 'São Paulo',  lat: -23.55, lon: -46.63,  x: 30,   y: 64 },
  { name: 'Mumbai',     lat: 19.08,  lon: 72.88,   x: 63.5, y: 40 },
  { name: 'Cairo',      lat: 30.04,  lon: 31.24,   x: 53,   y: 35 },
  { name: 'Toronto',    lat: 43.65,  lon: -79.38,  x: 22,   y: 28 },
  { name: 'Berlin',     lat: 52.52,  lon: 13.40,   x: 51,   y: 22 },
  { name: 'Singapore',  lat:  1.35,  lon: 103.82,  x: 74,   y: 49 },
]

const LAYERS = [
  { id: 'temp',    label: 'Temperature',   icon: '🌡️' },
  { id: 'precip',  label: 'Precipitation', icon: '🌧️' },
  { id: 'wind',    label: 'Wind',          icon: '💨' },
  { id: 'cloud',   label: 'Cloud Cover',   icon: '☁️' },
]

const API_KEY = 'cb1b50442a576efad21fb25f1ea232fa'

export default function MapView({ weather: currentWeather }) {
  const [activeLayer, setActiveLayer] = useState('temp')
  const [cityData, setCityData]       = useState({})
  const [loading, setLoading]         = useState(true)
  const [hoveredCity, setHoveredCity] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const results = {}
      await Promise.allSettled(
        CITIES.map(async (city) => {
          try {
            const res  = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
            )
            const data = await res.json()
            if (data.main) results[city.name] = data
          } catch (_) {}
        })
      )
      setCityData(results)
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Derive a colour for each city dot based on active layer
  function getDotColor(cityName) {
    const d = cityData[cityName]
    if (!d) return 'rgba(255,255,255,0.25)'
    switch (activeLayer) {
      case 'temp': {
        const t = d.main.temp
        if (t < 0)  return '#38bdf8'
        if (t < 10) return '#7dd3fc'
        if (t < 20) return '#86efac'
        if (t < 30) return '#fbbf24'
        return '#f87171'
      }
      case 'precip': {
        const p = d.clouds?.all ?? 0
        if (p < 20)  return '#22c55e'
        if (p < 50)  return '#a3e635'
        if (p < 75)  return '#38bdf8'
        return '#818cf8'
      }
      case 'wind': {
        const w = (d.wind?.speed ?? 0) * 3.6
        if (w < 10) return '#22c55e'
        if (w < 30) return '#fbbf24'
        if (w < 50) return '#f97316'
        return '#f87171'
      }
      case 'cloud': {
        const c = d.clouds?.all ?? 0
        if (c < 20)  return '#fbbf24'
        if (c < 50)  return '#94a3b8'
        if (c < 85)  return '#64748b'
        return '#475569'
      }
      default: return 'rgba(255,255,255,0.35)'
    }
  }

  function getLayerValue(cityName) {
    const d = cityData[cityName]
    if (!d) return '–'
    switch (activeLayer) {
      case 'temp':   return `${Math.round(d.main.temp)}°C`
      case 'precip': return `${d.clouds?.all ?? 0}%`
      case 'wind':   return `${Math.round((d.wind?.speed ?? 0) * 3.6)} km/h`
      case 'cloud':  return `${d.clouds?.all ?? 0}%`
      default:       return ''
    }
  }

  const hovered  = hoveredCity  && cityData[hoveredCity.name]
  const selected = selectedCity && cityData[selectedCity.name]
  const detail   = selected || hovered
  const detailCity = selected ? selectedCity : hoveredCity

  return (
    <div className="dash-section dash-map-root">
      <div className="dash-section-header">
        <span className="dash-section-title">🗺️ World Weather Map</span>
        <span className="dash-section-sub">Live conditions across major cities</span>
      </div>

      {/* Layer selector */}
      <div className="map-layer-bar">
        {LAYERS.map(l => (
          <button
            key={l.id}
            className={`map-layer-btn${activeLayer === l.id ? ' active' : ''}`}
            onClick={() => setActiveLayer(l.id)}
          >
            <span>{l.icon}</span> {l.label}
          </button>
        ))}
      </div>

      <div className="map-canvas-wrap">
        {/* SVG world map silhouette (simplified continents) */}
        <svg
          className="map-svg"
          viewBox="0 0 100 75"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simple continent blobs – stylised, not geo-accurate */}
          {/* North America */}
          <path d="M5 15 Q8 10 14 12 Q22 8 26 14 Q28 20 24 28 Q20 36 18 40 Q14 42 10 38 Q4 32 5 22 Z"
            fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.25)" strokeWidth="0.3"/>
          {/* South America */}
          <path d="M20 44 Q26 40 32 44 Q36 50 34 60 Q30 70 26 70 Q20 68 18 60 Q16 52 20 44 Z"
            fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.25)" strokeWidth="0.3"/>
          {/* Europe */}
          <path d="M44 14 Q50 10 56 14 Q58 18 54 24 Q50 28 46 24 Q42 20 44 14 Z"
            fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.25)" strokeWidth="0.3"/>
          {/* Africa */}
          <path d="M46 28 Q54 26 58 32 Q62 40 60 52 Q56 62 50 62 Q44 60 42 50 Q40 38 46 28 Z"
            fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.25)" strokeWidth="0.3"/>
          {/* Asia */}
          <path d="M56 10 Q70 6 80 10 Q88 14 88 22 Q86 30 80 34 Q72 36 62 32 Q54 26 54 18 Q54 12 56 10 Z"
            fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.25)" strokeWidth="0.3"/>
          {/* Australia */}
          <path d="M76 56 Q84 52 90 58 Q92 64 88 70 Q82 74 76 70 Q70 64 76 56 Z"
            fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.25)" strokeWidth="0.3"/>

          {/* Latitude grid lines */}
          {[15, 25, 35, 45, 55, 65].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y}
              stroke="rgba(255,255,255,0.04)" strokeWidth="0.3"/>
          ))}
          {/* Longitude grid lines */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="75"
              stroke="rgba(255,255,255,0.04)" strokeWidth="0.3"/>
          ))}

          {/* City dots */}
          {CITIES.map(city => {
            const color   = getDotColor(city.name)
            const isHover = hoveredCity?.name === city.name
            const isSel   = selectedCity?.name === city.name
            return (
              <g key={city.name}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => setSelectedCity(prev => prev?.name === city.name ? null : city)}
              >
                {/* Pulse ring */}
                {(isHover || isSel) && (
                  <circle cx={city.x} cy={city.y} r="2.4"
                    fill="none" stroke={color} strokeWidth="0.5" opacity="0.5">
                  </circle>
                )}
                <circle cx={city.x} cy={city.y} r={isHover || isSel ? 1.4 : 1.0}
                  fill={color}
                  style={{ filter: `drop-shadow(0 0 2px ${color})`, transition: 'r 0.2s' }}
                />
                {/* City label on hover/select */}
                {(isHover || isSel) && (
                  <text x={city.x + 2} y={city.y - 1.5}
                    fontSize="2.2" fill="#e2eafc" fontFamily="Outfit, sans-serif"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {city.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Detail popup */}
        {detail && detailCity && (
          <div className="map-detail-card">
            <div className="map-detail-top">
              <span className="map-detail-city">{detailCity.name}</span>
              <span className="map-detail-emoji">
                {getWeatherEmoji(detail.weather?.[0]?.id ?? 0)}
              </span>
            </div>
            <div className="map-detail-temp">
              {Math.round(detail.main?.temp ?? 0)}°C
            </div>
            <div className="map-detail-cond">
              {detail.weather?.[0]?.description
                ? detail.weather[0].description.charAt(0).toUpperCase() + detail.weather[0].description.slice(1)
                : getCondition(0)}
            </div>
            <div className="map-detail-stats">
              <div className="map-ds"><span>💧</span>{detail.main?.humidity}%</div>
              <div className="map-ds"><span>💨</span>{Math.round((detail.wind?.speed ?? 0) * 3.6)} km/h</div>
              <div className="map-ds"><span>☁️</span>{detail.clouds?.all}%</div>
            </div>
          </div>
        )}

        {loading && (
          <div className="map-loading">Loading city data…</div>
        )}
      </div>

      {/* Legend */}
      <div className="map-legend">
        {activeLayer === 'temp' && (
          <>
            <span className="map-legend-title">Temperature</span>
            {[['#38bdf8','< 0°C'],['#7dd3fc','0–10°C'],['#86efac','10–20°C'],['#fbbf24','20–30°C'],['#f87171','> 30°C']].map(([c,l]) => (
              <div key={l} className="map-legend-item">
                <span className="map-legend-dot" style={{ background: c }}/>
                <span>{l}</span>
              </div>
            ))}
          </>
        )}
        {activeLayer === 'wind' && (
          <>
            <span className="map-legend-title">Wind Speed</span>
            {[['#22c55e','< 10 km/h'],['#fbbf24','10–30'],['#f97316','30–50'],['#f87171','> 50']].map(([c,l]) => (
              <div key={l} className="map-legend-item">
                <span className="map-legend-dot" style={{ background: c }}/>
                <span>{l}</span>
              </div>
            ))}
          </>
        )}
        {(activeLayer === 'precip' || activeLayer === 'cloud') && (
          <>
            <span className="map-legend-title">{activeLayer === 'precip' ? 'Cloud %' : 'Cloud Cover'}</span>
            {[['#22c55e','< 20%'],['#a3e635','20–50%'],['#38bdf8','50–75%'],['#818cf8','> 75%']].map(([c,l]) => (
              <div key={l} className="map-legend-item">
                <span className="map-legend-dot" style={{ background: c }}/>
                <span>{l}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* City grid */}
      <div className="map-city-grid">
        {CITIES.map(city => {
          const d     = cityData[city.name]
          const color = getDotColor(city.name)
          const val   = getLayerValue(city.name)
          return (
            <div
              key={city.name}
              className={`map-city-chip${selectedCity?.name === city.name ? ' selected' : ''}`}
              onClick={() => setSelectedCity(prev => prev?.name === city.name ? null : city)}
              style={{ '--dot-color': color }}
            >
              <span className="map-chip-dot" style={{ background: color }} />
              <span className="map-chip-name">{city.name}</span>
              <span className="map-chip-val">{loading ? '…' : val}</span>
              {d && <span className="map-chip-icon">{getWeatherEmoji(d.weather?.[0]?.id ?? 0)}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}