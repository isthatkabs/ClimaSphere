import { useEffect, useRef, useState } from 'react'

const API_KEY = 'cb1b50442a576efad21fb25f1ea232fa'

/* ── helpers ─────────────────────────────────────────────── */
function weatherEmoji(id) {
  if (!id) return '🌡️'
  if (id === 800)              return '☀️'
  if (id >= 801 && id <= 804)  return '☁️'
  if (id >= 700)               return '🌫️'
  if (id >= 600)               return '❄️'
  if (id >= 500)               return '🌧️'
  if (id >= 300)               return '🌦️'
  if (id >= 200)               return '⛈️'
  return '🌡️'
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function fetchWeather(lat, lon) {
  const res  = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
  return res.json()
}

/* ── predefined city markers ─────────────────────────────── */
const CITIES = [
  { name: 'London',    lat: 51.51,  lon: -0.13  },
  { name: 'New York',  lat: 40.71,  lon: -74.01 },
  { name: 'Paris',     lat: 48.86,  lon:  2.35  },
  { name: 'Tokyo',     lat: 35.68,  lon: 139.69 },
  { name: 'Sydney',    lat: -33.87, lon: 151.21 },
  { name: 'Dubai',     lat: 25.20,  lon:  55.27 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Mumbai',    lat:  19.08, lon:  72.88 },
  { name: 'Cairo',     lat:  30.04, lon:  31.24 },
  { name: 'Toronto',   lat:  43.65, lon: -79.38 },
  { name: 'Berlin',    lat:  52.52, lon:  13.40 },
  { name: 'Singapore', lat:   1.35, lon: 103.82 },
]

/* ── leaflet CSS injected once ───────────────────────────── */
const LEAFLET_CSS = `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`

function injectLeafletCSS() {
  if (document.querySelector('#leaflet-css-climasphere')) return
  const link = document.createElement('link')
  link.id   = 'leaflet-css-climasphere'
  link.rel  = 'stylesheet'
  link.href = LEAFLET_CSS
  document.head.appendChild(link)
}

/* Custom dark overrides for Leaflet chrome */
const LEAFLET_OVERRIDES = `
  .cs-map-wrap .leaflet-control-zoom a {
    background: rgba(8,14,34,0.92) !important;
    color: rgba(226,234,252,0.7) !important;
    border: 1px solid rgba(124,58,237,0.3) !important;
    width: 32px !important; height: 32px !important;
    line-height: 30px !important;
    font-size: 16px !important;
    backdrop-filter: blur(12px);
    transition: all 0.15s;
  }
  .cs-map-wrap .leaflet-control-zoom a:hover {
    background: rgba(124,58,237,0.2) !important;
    color: #a78bfa !important;
    border-color: rgba(124,58,237,0.6) !important;
  }
  .cs-map-wrap .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }
  .cs-map-wrap .leaflet-control-zoom-in  { border-radius: 0 !important; }
  .cs-map-wrap .leaflet-control-zoom-out { border-radius: 0 !important; }
  .cs-map-wrap .leaflet-bar { border: none !important; }
  .cs-map-wrap .leaflet-control-attribution { display: none; }
  .cs-map-wrap .leaflet-pane { z-index: 1 !important; }
  .cs-map-wrap .leaflet-top,
  .cs-map-wrap .leaflet-bottom { z-index: 2 !important; }

  /* pulse ring animation on city dots */
  @keyframes cs-pulse {
    0%   { transform: scale(1);   opacity: 0.8; }
    70%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes cs-panel-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cs-spin {
    to { transform: rotate(360deg); }
  }
`

/* ── city dot div-icon factory ───────────────────────────── */
function makeCityIcon(L, selected = false, clicked = false) {
  const color  = clicked  ? '#f87171'
               : selected ? '#a78bfa'
               : '#7c3aed'
  const glow   = clicked  ? 'rgba(248,113,113,0.6)'
               : selected ? 'rgba(167,139,250,0.5)'
               : 'rgba(124,58,237,0.5)'
  const size   = selected || clicked ? 13 : 9

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;cursor:pointer">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${color};
          border:2px solid rgba(255,255,255,0.25);
          box-shadow:0 0 10px ${glow},0 0 20px ${glow};
        "></div>
        ${selected || clicked ? `<div style="
          position:absolute;inset:0;border-radius:50%;
          background:${color};
          animation:cs-pulse 1.8s ease-out infinite;
        "></div>` : ''}
      </div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

/* ── click-pin icon ──────────────────────────────────────── */
function makeClickIcon(L) {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:18px;height:18px">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:#f87171;border:2px solid rgba(255,255,255,0.3);
          box-shadow:0 0 12px rgba(248,113,113,0.7),0 0 28px rgba(248,113,113,0.4);
        "></div>
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:#f87171;
          animation:cs-pulse 1.5s ease-out infinite;
        "></div>
      </div>`,
    iconSize:   [18, 18],
    iconAnchor: [9, 9],
  })
}

/* ── weather side-panel component ────────────────────────── */
function WeatherPanel({ data, onClose }) {
  if (!data) return null

  const id      = data.weather?.[0]?.id
  const emoji   = weatherEmoji(id)
  const temp    = Math.round(data.main?.temp ?? 0)
  const feels   = Math.round(data.main?.feels_like ?? 0)
  const humidity= data.main?.humidity ?? 0
  const wind    = Math.round((data.wind?.speed ?? 0) * 3.6)
  const clouds  = data.clouds?.all ?? 0
  const pressure= data.main?.pressure ?? 1013
  const desc    = capitalize(data.weather?.[0]?.description ?? '')
  const city    = data.name
    ? `${data.name}${data.sys?.country ? `, ${data.sys.country}` : ''}`
    : `${data._lat?.toFixed(3)}°, ${data._lon?.toFixed(3)}°`

  const stats = [
    { icon: '💧', label: 'Humidity',   val: `${humidity}%`   },
    { icon: '💨', label: 'Wind',       val: `${wind} km/h`   },
    { icon: '🌡', label: 'Feels like', val: `${feels}°C`     },
    { icon: '☁️', label: 'Cloud',      val: `${clouds}%`     },
    { icon: '📊', label: 'Pressure',   val: `${pressure} hPa`},
    { icon: '👁', label: 'Visibility', val: data.visibility
        ? `${(data.visibility / 1000).toFixed(1)} km` : '–'   },
  ]

  return (
    <div style={{
      position: 'absolute', bottom: 20, left: 20, zIndex: 999,
      width: 280,
      background: 'rgba(6,11,26,0.94)',
      border: '1px solid rgba(124,58,237,0.4)',
      borderRadius: 18,
      padding: '20px 22px 18px',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1) inset',
      animation: 'cs-panel-in 0.25s ease',
    }}>
      {/* close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 14, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(226,234,252,0.35)', fontSize: 15,
          lineHeight: 1, transition: 'color 0.15s', padding: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(226,234,252,0.8)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(226,234,252,0.35)'}
      >✕</button>

      {/* location */}
      <div style={{
        fontSize: 11, color: 'rgba(167,139,250,0.8)',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span>📍</span> {city}
      </div>

      {/* temp + emoji */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <span style={{ fontSize: 52, lineHeight: 1 }}>{emoji}</span>
        <div>
          <div style={{
            fontSize: 46, fontWeight: 300, lineHeight: 1,
            letterSpacing: -2, color: '#f0ecff',
          }}>
            {temp}<span style={{ fontSize: 22, color: 'rgba(226,234,252,0.4)' }}>°C</span>
          </div>
        </div>
      </div>

      {/* condition */}
      <div style={{
        fontSize: 13, color: 'rgba(200,190,240,0.65)',
        marginBottom: 16, paddingLeft: 2,
      }}>
        {desc}
      </div>

      {/* stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 6,
      }}>
        {stats.map(({ icon, label, val }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '8px 10px',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(226,234,252,0.38)', marginBottom: 3 }}>
              {icon} {label}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#e2eafc' }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── loading spinner overlay ─────────────────────────────── */
function Spinner() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 998,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(7,12,26,0.55)', backdropFilter: 'blur(4px)',
      gap: 12, pointerEvents: 'none',
    }}>
      <div style={{
        width: 26, height: 26,
        border: '2.5px solid rgba(124,58,237,0.2)',
        borderTopColor: '#7c3aed',
        borderRadius: '50%',
        animation: 'cs-spin 0.7s linear infinite',
      }} />
      <span style={{ fontSize: 12, color: 'rgba(226,234,252,0.5)' }}>
        Fetching weather…
      </span>
    </div>
  )
}

/* ── hint tooltip ────────────────────────────────────────── */
function HintBadge() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(t)
  }, [])
  if (!visible) return null
  return (
    <div style={{
      position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, pointerEvents: 'none',
      background: 'rgba(8,14,34,0.88)',
      border: '1px solid rgba(124,58,237,0.3)',
      borderRadius: 100, padding: '6px 14px',
      fontSize: 12, color: 'rgba(226,234,252,0.6)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', gap: 6,
      whiteSpace: 'nowrap',
      animation: 'cs-panel-in 0.3s ease',
    }}>
      <span>🖱️</span> Click anywhere on the map to get live weather
    </div>
  )
}

/* ── main MapView ────────────────────────────────────────── */
export default function MapView({ weather: currentWeather }) {
  const containerRef  = useRef(null)
  const mapRef        = useRef(null)
  const cityMarkersRef= useRef([])   // { marker, city, L }
  const clickMarkerRef= useRef(null)
  const styleRef      = useRef(null)

  const [panel,   setPanel]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedCityName, setSelectedCityName] = useState(null)

  /* inject global leaflet overrides once */
  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement('style')
      el.textContent = LEAFLET_OVERRIDES
      document.head.appendChild(el)
      styleRef.current = el
    }
    return () => {
      styleRef.current?.remove()
      styleRef.current = null
    }
  }, [])

  /* build map */
  useEffect(() => {
    if (mapRef.current) return
    injectLeafletCSS()

    /* dynamic import so Leaflet (browser-only) is loaded safely */
    import('leaflet').then(({ default: L }) => {
      /* kill default icon url resolution so Vite doesn't choke */
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({ iconUrl: '', shadowUrl: '', iconRetinaUrl: '' })

      const map = L.map(containerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
        worldCopyJump: true,
      })

      /* dark tile layer – CartoDB dark matter */
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      ).addTo(map)

      /* zoom control – bottom-right */
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      /* city markers */
      cityMarkersRef.current = CITIES.map(city => {
        const icon   = makeCityIcon(L)
        const marker = L.marker([city.lat, city.lon], { icon, title: city.name })
          .addTo(map)
          .on('click', async () => {
            /* remove stale click pin */
            if (clickMarkerRef.current) {
              clickMarkerRef.current.remove()
              clickMarkerRef.current = null
            }
            setSelectedCityName(city.name)
            setLoading(true)
            try {
              const data = await fetchWeather(city.lat, city.lon)
              setPanel({ ...data, _lat: city.lat, _lon: city.lon })
            } catch (_) {}
            setLoading(false)
          })
        return { marker, city, L }
      })

      /* map click → weather for arbitrary location */
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng

        /* clear selected city highlight */
        setSelectedCityName(null)

        /* drop/move click pin */
        if (clickMarkerRef.current) {
          clickMarkerRef.current.remove()
        }
        const pin = L.marker([lat, lng], { icon: makeClickIcon(L) }).addTo(map)
        clickMarkerRef.current = pin

        setLoading(true)
        try {
          const data = await fetchWeather(lat, lng)
          setPanel({ ...data, _lat: lat, _lon: lng })
        } catch (_) {}
        setLoading(false)
      })

      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  /* update city icon style when selection changes */
  useEffect(() => {
    cityMarkersRef.current.forEach(({ marker, city, L: leaflet }) => {
      if (!leaflet) return
      const selected = city.name === selectedCityName
      marker.setIcon(makeCityIcon(leaflet, selected))
    })
  }, [selectedCityName])

  const handleClose = () => {
    setPanel(null)
    setSelectedCityName(null)
    if (clickMarkerRef.current) {
      clickMarkerRef.current.remove()
      clickMarkerRef.current = null
    }
  }

  return (
    <div className="dash-section dash-map-root">
      <div className="dash-section-header">
        <span className="dash-section-title">🗺️ World Weather Map</span>
        <span className="dash-section-sub">
          Click any city dot or anywhere on the map for live conditions
        </span>
      </div>

      {/* map wrapper */}
      <div
        className="cs-map-wrap"
        style={{
          position: 'relative',
          height: 520,
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(124,58,237,0.22)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.06) inset',
        }}
      >
        {/* leaflet mount point */}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

        {/* overlays */}
        <HintBadge />
        {loading && <Spinner />}
        {panel && !loading && <WeatherPanel data={panel} onClose={handleClose} />}
      </div>

      {/* city quick-access chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 7,
        marginTop: 4,
      }}>
        {CITIES.map(city => {
          const isSelected = selectedCityName === city.name
          return (
            <button
              key={city.name}
              onClick={async () => {
                /* fly map to city */
                if (mapRef.current) {
                  mapRef.current.flyTo([city.lat, city.lon], 8, { duration: 1.2 })
                }
                /* remove click pin */
                if (clickMarkerRef.current) {
                  clickMarkerRef.current.remove()
                  clickMarkerRef.current = null
                }
                setSelectedCityName(city.name)
                setLoading(true)
                try {
                  const data = await fetchWeather(city.lat, city.lon)
                  setPanel({ ...data, _lat: city.lat, _lon: city.lon })
                } catch (_) {}
                setLoading(false)
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 11px',
                background: isSelected ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isSelected ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 9, cursor: 'pointer',
                color: 'inherit', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={e => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: isSelected ? '#a78bfa' : '#7c3aed',
                boxShadow: isSelected ? '0 0 6px rgba(167,139,250,0.6)' : 'none',
              }} />
              <span style={{
                fontSize: 11, fontWeight: 500,
                flex: 1, textAlign: 'left',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                color: isSelected ? '#e2eafc' : 'rgba(226,234,252,0.6)',
              }}>
                {city.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}