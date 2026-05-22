import { useState, useEffect, useRef } from 'react'
import { searchCities } from './mapHelpers'

function getCountryName(code) {
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code }
  catch { return code }
}

export default function MapSearch({ onSelect }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [open,    setOpen]    = useState(false)
  const [active,  setActive]  = useState(-1)  // keyboard nav index
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const wrapRef     = useRef(null)

  /* debounced search */
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setResults([]); setOpen(false); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchCities(query)
        setResults(data)
        setOpen(data.length > 0)
        setActive(-1)
      } catch { setResults([]) }
      setLoading(false)
    }, 320)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  /* close on outside click */
  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function pick(result) {
    setQuery('')
    setResults([])
    setOpen(false)
    setActive(-1)
    onSelect(result)
  }

  function handleKey(e) {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && active >= 0) pick(results[active])
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div
      ref={wrapRef}
      style={{ position: 'absolute', top: 14, left: 14, zIndex: 1000, width: 250 }}
    >
      {/* ── Input ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        gap:            8,
        background:     'rgba(6,11,26,0.92)',
        border:         '1px solid rgba(124,58,237,0.35)',
        borderRadius:   open && results.length ? '12px 12px 0 0' : 12,
        padding:        '9px 13px',
        backdropFilter: 'blur(20px)',
        boxShadow:      '0 4px 24px rgba(0,0,0,0.4)',
        transition:     'border-radius 0.1s',
      }}>
        <span style={{ fontSize: 14, opacity: loading ? 0.4 : 0.6, flexShrink: 0 }}>
          {loading ? '⏳' : '🔍'}
        </span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search city…"
          style={{
            flex:        1,
            background:  'none',
            border:      'none',
            outline:     'none',
            color:       '#e2eafc',
            fontSize:    13,
            fontFamily:  'inherit',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(226,234,252,0.35)', fontSize: 14, lineHeight: 1, padding: 0,
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(226,234,252,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(226,234,252,0.35)'}
          >✕</button>
        )}
      </div>

      {/* ── Dropdown ── */}
      {open && results.length > 0 && (
        <div style={{
          background:     'rgba(6,11,26,0.96)',
          border:         '1px solid rgba(124,58,237,0.35)',
          borderTop:      'none',
          borderRadius:   '0 0 12px 12px',
          backdropFilter: 'blur(20px)',
          boxShadow:      '0 8px 24px rgba(0,0,0,0.5)',
          overflow:       'hidden',
        }}>
          {results.map((r, i) => (
            <button
              key={`${r.lat}-${r.lon}-${i}`}
              onMouseDown={() => pick(r)}
              onMouseEnter={() => setActive(i)}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        10,
                width:      '100%',
                padding:    '10px 13px',
                background: i === active ? 'rgba(124,58,237,0.15)' : 'transparent',
                border:     'none',
                borderTop:  i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                cursor:     'pointer',
                textAlign:  'left',
                fontFamily: 'inherit',
                transition: 'background 0.1s',
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>📍</span>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize:     13,
                  fontWeight:   500,
                  color:        '#e2eafc',
                  whiteSpace:   'nowrap',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {r.name}{r.state ? `, ${r.state}` : ''}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(226,234,252,0.4)', marginTop: 1 }}>
                  {getCountryName(r.country)} · {r.lat.toFixed(2)}°, {r.lon.toFixed(2)}°
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
