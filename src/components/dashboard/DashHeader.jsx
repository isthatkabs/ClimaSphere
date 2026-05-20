import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInitials, getNow, getGreeting } from '../../data/dashData'
import { searchCities } from '../../services/weather'

function getCountryName(code) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

export default function DashHeader({ onSearch, onReset }) {
  const { user }                        = useAuth()
  const navigate                        = useNavigate()
  const [input, setInput]               = useState('')
  const [suggestions, setSuggestions]   = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [noResults, setNoResults]       = useState(false)
  const debounceRef                     = useRef(null)
  const wrapRef                         = useRef(null)
  const inputRef                        = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setInput(val)
    setNoResults(false)
    clearTimeout(debounceRef.current)

    if (val.trim().length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchCities(val)
      if (results.length === 0) {
        setNoResults(true)
        setSuggestions([])
      } else {
        setSuggestions(results)
        setNoResults(false)
      }
      setShowDropdown(true)
    }, 400)
  }

  const handleSelect = (city) => {
    setInput(`${city.name}, ${getCountryName(city.country)}`)
    setShowDropdown(false)
    setSuggestions([])
    onSearch({ lat: city.lat, lon: city.lon, name: city.name, country: city.country })
  }

  const handleClear = () => {
    setInput('')
    setSuggestions([])
    setShowDropdown(false)
    setNoResults(false)
  }

  const handleSearchIconClick = () => {
    handleClear()
    inputRef.current?.focus()
  }

  const handleReset = () => {
    handleClear()
    onReset()
  }

  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <div className="dash-greeting">
          {user ? getGreeting(user) : 'Welcome to ClimaSphere 🌐'}
        </div>
        <div className="dash-date">{getNow()}</div>
      </div>

      <div style={{ position: 'relative' }} ref={wrapRef}>
        <div className="dash-search-wrap">
          <span
            className="dash-search-icon"
            onClick={handleSearchIconClick}
            style={{ cursor: 'pointer' }}
            title="Clear search"
          >
            🔍
          </span>
          <input
            ref={inputRef}
            className="dash-search"
            placeholder="Search a city…"
            value={input}
            onChange={handleChange}
            onFocus={handleClear}
            autoComplete="off"
          />
          {input && (
            <span
              onClick={handleClear}
              title="Clear"
              style={{ cursor: 'pointer', opacity: 0.4, fontSize: 12, paddingRight: 4 }}
            >
              ✕
            </span>
          )}
        </div>

        {showDropdown && (
          <div style={{
            position: 'absolute', top: '110%', left: 0, right: 0,
            background: '#0f1729',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, overflow: 'hidden',
            zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {noResults ? (
              <div style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(226,234,252,0.4)' }}>
                No cities found — check the spelling
              </div>
            ) : (
              suggestions.map((city, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(city)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{
                    padding: '10px 16px', cursor: 'pointer', fontSize: 13,
                    borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'background 0.1s',
                  }}
                >
                  <span>{city.name}{city.state ? `, ${city.state}` : ''}</span>
                  <span style={{ opacity: 0.4, fontSize: 11 }}>{getCountryName(city.country)}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="dash-header-right">
        <button className="dash-icon-btn" title="Notifications">🔔</button>
        <button
          className="dash-icon-btn"
          title="Back to home"
          onClick={handleReset}
        >
          🏠
        </button>

        <div
          className="dash-avatar"
          title={user?.email}
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="avatar"
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
            />
          ) : (
            getInitials(user?.email)
          )}
        </div>
      </div>
    </header>
  )
}