import { useEffect, useState } from 'react'

export function Spinner() {
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

export function HintBadge() {
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