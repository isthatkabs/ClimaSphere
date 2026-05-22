import { useState, useRef, useEffect } from 'react'
import { searchCities } from '../services/weather'
import { useLocations } from '../context/LocationsContext'
import '../styles/dash-locations.css'

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

function countryFlag(code) {
  if (!code || code.length !== 2) return '🌍'
  return code.toUpperCase().split('').map(c =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  ).join('')
}

function countryName(code) {
  if (!code) return ''
  try { return regionNames.of(code.toUpperCase()) }
  catch { return code }
}

export default function ManageLocations({ onSwitch }) {
  const { locations, addLocation, removeLocation, setHome } = useLocations()
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const data = await searchCities(query)
      setResults(data.slice(0, 5))
      setSearching(false)
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  function handleAdd(city) {
    addLocation({
      id:      `${city.lat},${city.lon}`,
      lat:     city.lat,
      lon:     city.lon,
      name:    city.name,
      country: city.country,
    })
    setQuery('')
    setResults([])
  }

  function handleSwitch(loc) {
    onSwitch?.({ lat: loc.lat, lon: loc.lon, name: loc.name })
  }

  const alreadySaved = (city) =>
    locations.some(l => l.id === `${city.lat},${city.lon}`)

  return (
    <div className="cs-settings">
      <div className="cs-settings-header">
        <h2 className="cs-settings-title">Manage Locations</h2>
        <p className="cs-settings-sub">Add and organise your saved cities</p>
      </div>

      {/* ── ADD SECTION ── */}
      <div className="cs-section">
        <div className="cs-section-title">ADD A CITY</div>
        <div className="cs-card">
          <div className="ml-search-wrap">
            <span className="ml-search-icon">🔍</span>
            <input
              className="ml-search-input"
              type="text"
              placeholder="Search for a city…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
            />
            {searching && <span className="ml-search-spinner" />}
          </div>

          {results.length > 0 && (
            <div className="ml-results">
              {results.map(city => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  className="ml-result-row"
                  onClick={() => handleAdd(city)}
                  disabled={alreadySaved(city)}
                >
                  <span className="ml-result-flag">{countryFlag(city.country)}</span>
                  <span className="ml-result-name">{city.name}</span>
                  {city.state && <span className="ml-result-meta">{city.state},</span>}
                  <span className="ml-result-meta">{countryName(city.country)}</span>
                  <span className="ml-result-add">
                    {alreadySaved(city) ? '✓ Saved' : '+ Add'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SAVED SECTION ── */}
      <div className="cs-section">
        <div className="cs-section-title">
          SAVED LOCATIONS{locations.length > 0 ? ` (${locations.length})` : ''}
        </div>
        <div className="cs-card">
          {locations.length === 0 ? (
            <div className="ml-empty">
              <span className="ml-empty-icon">📍</span>
              <span className="ml-empty-text">
                No saved locations yet.<br />Search above to add cities.
              </span>
            </div>
          ) : (
            locations.map(loc => (
              <div key={loc.id} className={`ml-loc-row${loc.isHome ? ' home' : ''}`}>
                <button className="ml-loc-main" onClick={() => handleSwitch(loc)}>
                  <span className="ml-loc-flag">{countryFlag(loc.country)}</span>
                  <div className="ml-loc-text">
                    <span className="ml-loc-name">{loc.name}</span>
                    {loc.isHome && <span className="ml-home-badge">Home</span>}
                  </div>
                  <span className="ml-loc-country">{countryName(loc.country)}</span>
                </button>

                <div className="ml-loc-actions">
                  <button
                    className={`ml-star${loc.isHome ? ' active' : ''}`}
                    onClick={() => setHome(loc.id)}
                    title={loc.isHome ? 'Current home city' : 'Set as home'}
                  >
                    {loc.isHome ? '★' : '☆'}
                  </button>
                  <button
                    className="ml-remove"
                    onClick={() => removeLocation(loc.id)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
