import { useEffect, useRef, useState } from 'react'

import {
  CITIES, TILE_URL, TILE_OPTIONS, MAP_OPTIONS,
  LEAFLET_CSS_URL, LEAFLET_OVERRIDES,
} from './mapConstants'
import { fetchWeather }                from './mapHelpers'
import { makeCityIcon, makeClickIcon } from './mapIcons'
import WeatherPanel                    from './WeatherPanel'
import { Spinner, HintBadge }          from './MapOverlays'
import CityChips                       from './CityChips'
import MapSearch                       from './MapSearch'

/* ── inject Leaflet CSS once ─────────────────────────────── */
function injectLeafletCSS() {
  if (document.querySelector('#leaflet-css-climasphere')) return
  const link = document.createElement('link')
  link.id   = 'leaflet-css-climasphere'
  link.rel  = 'stylesheet'
  link.href = LEAFLET_CSS_URL
  document.head.appendChild(link)
}

/* ── MapView ─────────────────────────────────────────────── */
export default function MapView() {
  const containerRef   = useRef(null)
  const mapRef         = useRef(null)
  const cityMarkersRef = useRef([])  // [{ marker, city, L }]
  const clickMarkerRef = useRef(null)
  const styleRef       = useRef(null)

  const [panel,            setPanel]            = useState(null)
  const [loading,          setLoading]          = useState(false)
  const [selectedCityName, setSelectedCityName] = useState(null)

  /* inject Leaflet style overrides once */
  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement('style')
      el.textContent = LEAFLET_OVERRIDES
      document.head.appendChild(el)
      styleRef.current = el
    }
    return () => { styleRef.current?.remove(); styleRef.current = null }
  }, [])

  /* ── build the Leaflet map ───────────────────────────── */
  useEffect(() => {
    if (mapRef.current) return
    injectLeafletCSS()

    import('leaflet').then(({ default: L }) => {
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({ iconUrl: '', shadowUrl: '', iconRetinaUrl: '' })

      const map = L.map(containerRef.current, MAP_OPTIONS)

      L.tileLayer(TILE_URL, TILE_OPTIONS).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      /* city dot markers */
      cityMarkersRef.current = CITIES.map(city => {
        const marker = L.marker([city.lat, city.lon], {
          icon: makeCityIcon(L),
          title: city.name,
        })
          .addTo(map)
          .on('click', () => handleCityClick(city))

        return { marker, city, L }
      })

      /* click anywhere on the map */
      map.on('click', ({ latlng: { lat, lng } }) => handleMapClick(lat, lng))

      mapRef.current = map
    })

    return () => { mapRef.current?.remove(); mapRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── re-style city dots when selection changes ───────── */
  useEffect(() => {
    cityMarkersRef.current.forEach(({ marker, city, L: leaflet }) => {
      if (!leaflet) return
      marker.setIcon(makeCityIcon(leaflet, city.name === selectedCityName))
    })
  }, [selectedCityName])

  /* ── helpers ─────────────────────────────────────────── */
  function clearClickPin() {
    if (clickMarkerRef.current) {
      clickMarkerRef.current.remove()
      clickMarkerRef.current = null
    }
  }

  async function handleCityClick(city) {
    clearClickPin()
    setSelectedCityName(city.name)
    setLoading(true)
    try {
      const data = await fetchWeather(city.lat, city.lon)
      setPanel({ ...data, _lat: city.lat, _lon: city.lon })
    } catch (_) {}
    setLoading(false)
  }

  async function handleMapClick(lat, lng) {
    import('leaflet').then(async ({ default: L }) => {
      setSelectedCityName(null)
      clearClickPin()

      const pin = L.marker([lat, lng], { icon: makeClickIcon(L) }).addTo(mapRef.current)
      clickMarkerRef.current = pin

      setLoading(true)
      try {
        const data = await fetchWeather(lat, lng)
        setPanel({ ...data, _lat: lat, _lon: lng })
      } catch (_) {}
      setLoading(false)
    })
  }

  /* called from CityChips — flies the map then fetches */
  async function handleChipSelect(city) {
    mapRef.current?.flyTo([city.lat, city.lon], 8, { duration: 1.2 })
    clearClickPin()
    setSelectedCityName(city.name)
    setLoading(true)
    try {
      const data = await fetchWeather(city.lat, city.lon)
      setPanel({ ...data, _lat: city.lat, _lon: city.lon })
    } catch (_) {}
    setLoading(false)
  }

  async function handleSearchSelect(result) {
    clearClickPin()
    setSelectedCityName(null)
    mapRef.current?.flyTo([result.lat, result.lon], 10, { duration: 1.4 })
    setLoading(true)
    try {
      const data = await fetchWeather(result.lat, result.lon)
      setPanel({ ...data, _lat: result.lat, _lon: result.lon })
    } catch (_) {}
    setLoading(false)
  }

  function handlePanelClose() {
    setPanel(null)
    setSelectedCityName(null)
    clearClickPin()
  }

  /* ── render ──────────────────────────────────────────── */
  return (
    <div className="dash-section dash-map-root">
      <div className="dash-section-header">
        <span className="dash-section-title">🗺️ World Weather Map</span>
        <span className="dash-section-sub">
          Search a city, click a dot, or tap anywhere on the map for live conditions
        </span>
      </div>

      {/* map canvas */}
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
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

        <MapSearch onSelect={handleSearchSelect} />
        <HintBadge />
        {loading && <Spinner />}
        {panel && !loading && (
          <WeatherPanel data={panel} onClose={handlePanelClose} />
        )}
      </div>

      {/* city quick-access chips */}
      <CityChips
        selectedCityName={selectedCityName}
        onSelect={handleChipSelect}
      />
    </div>
  )
}