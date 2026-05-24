import { useEffect, useState, useRef, useCallback } from 'react'
import { getNearbyPlaces } from '../../services/places'
import { useSettings } from '../../context/SettingsContext'
import { getWeatherSuggestions, buildSuggestionInputs } from '../../data/suggestions'

const APPEAR_DELAY = 3500
const DISPLAY_MS   = 8000

function categoryIcon(name = '') {
  const n = name.toLowerCase()
  if (n.includes('coffee') || n.includes('cafe') || n.includes('tea')) return '☕'
  if (n.includes('restaurant') || n.includes('food') || n.includes('dining')) return '🍽'
  if (n.includes('park') || n.includes('garden') || n.includes('nature')) return '🌳'
  if (n.includes('museum')) return '🏛'
  if (n.includes('art') || n.includes('gallery')) return '🎨'
  if (n.includes('bar') || n.includes('pub') || n.includes('brewery')) return '🍺'
  if (n.includes('ice cream') || n.includes('dessert')) return '🍦'
  if (n.includes('cinema') || n.includes('movie') || n.includes('theatre')) return '🎬'
  if (n.includes('gym') || n.includes('fitness') || n.includes('sport')) return '🏋️'
  if (n.includes('shop') || n.includes('store') || n.includes('mall')) return '🛍'
  if (n.includes('library') || n.includes('book')) return '📚'
  return '📍'
}

function fmtDist(m) {
  if (!m && m !== 0) return ''
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`
}

export default function FloatingPlaces({ loc, weather, forecast }) {
  const { settings } = useSettings()
  const [visible,   setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [places,    setPlaces]    = useState([])
  const [condition, setCondition] = useState('Mild')

  const startRef    = useRef(null)
  const rafRef      = useRef(null)
  const shownLocRef = useRef(null)
  const pausedAtRef = useRef(null)
  const tickRef     = useRef(null)
  const barRef      = useRef(null)

  // Direct DOM update — no React state, so no re-renders per frame
  tickRef.current = (now) => {
    const elapsed   = now - startRef.current
    const remaining = Math.max(0, 1 - elapsed / DISPLAY_MS)
    if (barRef.current) barRef.current.style.width = `${remaining * 100}%`
    if (remaining > 0) {
      rafRef.current = requestAnimationFrame(tickRef.current)
    } else {
      setVisible(false)
    }
  }

  const handleMouseEnter = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    pausedAtRef.current = performance.now()
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (pausedAtRef.current !== null) {
      // Shift the start time forward by however long we were paused
      startRef.current += performance.now() - pausedAtRef.current
      pausedAtRef.current = null
    }
    rafRef.current = requestAnimationFrame(tickRef.current)
  }, [])

  function handlePlaceClick(place) {
    const locationSuffix = loc?.name && loc.name !== 'Your Location' ? loc.name : 'near me'
    const query = `${place.name} ${locationSuffix}`
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    if (!weather || !forecast || !loc) return
    if (!settings.nearbyPlaces) return

    const inputs = buildSuggestionInputs(weather, forecast)
    const result = getWeatherSuggestions(inputs)
    const cond   = result.primaryCondition
    setCondition(cond)

    const locKey = `${loc.lat}|${loc.lon}`
    if (locKey === shownLocRef.current) return
    shownLocRef.current = locKey

    setVisible(false)
    setDismissed(false)
    setPlaces([])
    pausedAtRef.current = null

    getNearbyPlaces(loc.lat, loc.lon, settings.placesRadius ?? 1000, cond)
      .then(data => {
        const results = data?.results ?? []
        if (results.length === 0) return
        setPlaces(results)
        const appear = setTimeout(() => {
          setVisible(true)
          startRef.current = performance.now()
          rafRef.current = requestAnimationFrame(tickRef.current)
        }, APPEAR_DELAY)
        return () => clearTimeout(appear)
      })
      .catch(() => {})
  }, [weather, forecast, loc, settings.nearbyPlaces, settings.placesRadius])

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  function dismiss() {
    setVisible(false)
    setDismissed(true)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }

  if (!settings.nearbyPlaces || !visible || dismissed || places.length === 0) return null

  const conditionEmoji = {
    'Hot': '☀️', 'Warm': '🌤', 'Cold': '🥶', 'Very Cold': '🥶',
    'Rainy': '🌧', 'Stormy': '⛈', 'Snowy': '❄️', 'Windy': '💨',
  }[condition] ?? '📍'

  const subtitle = (() => {
    const radius = settings.placesRadius ?? 1000
    const distLabel = radius >= 1000 ? `${radius / 1000} km` : `${radius} m`
    if (['Rainy', 'Stormy', 'Snowy'].includes(condition)) return `Indoor picks · within ${distLabel}`
    if (['Hot', 'Warm'].includes(condition)) return `Great spots for today · within ${distLabel}`
    if (['Cold', 'Very Cold'].includes(condition)) return `Warm places nearby · within ${distLabel}`
    return `Places near you · within ${distLabel}`
  })()

  return (
    <div
      className="cs-places-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cs-places-header">
        <div className="cs-places-header-left">
          <span className="cs-places-pin">📍</span>
          <div>
            <div className="cs-places-title">Nearby Places</div>
            <div className="cs-places-sub">{subtitle}</div>
          </div>
        </div>
        <div className="cs-places-header-right">
          <span className="cs-places-cond-emoji">{conditionEmoji}</span>
          <button className="cs-places-close" onClick={dismiss} aria-label="Dismiss">✕</button>
        </div>
      </div>

      <div className="cs-places-list">
        {places.slice(0, 4).map((place, i) => {
          const cat  = place.categories?.[0]?.name ?? ''
          const icon = categoryIcon(cat)
          const dist = fmtDist(place.distance)
          return (
            <div
              key={i}
              className="cs-places-row cs-places-row--clickable"
              onClick={() => handlePlaceClick(place)}
              title={`Search "${place.name}" on Google`}
            >
              <span className="cs-places-row-icon">{icon}</span>
              <div className="cs-places-row-info">
                <div className="cs-places-row-name">{place.name}</div>
                {cat && <div className="cs-places-row-cat">{cat}</div>}
              </div>
              {dist && <span className="cs-places-row-dist">{dist}</span>}
            </div>
          )
        })}
      </div>

      <div className="cs-places-bar-track">
        <div className="cs-places-bar-fill" ref={barRef} />
      </div>
    </div>
  )
}
