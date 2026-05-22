import { createContext, useContext, useState, useCallback } from 'react'

const DEFAULTS = {
  tempUnit:             'C',   // 'C' | 'F'
  distanceUnit:         'km',  // 'km' | 'mi'
  timeFormat:           '24',  // '12' | '24'
  notifications:        false,
  weatherRadar:         false,
  activitySuggestions:  true,  // show clothing/activity tips on Suggestions page
  alertSuggestions:     true,  // show safety tips inside Alerts cards
}

function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('cs-settings') || '{}') }
  } catch {
    return { ...DEFAULTS }
  }
}

// ── Conversion helpers ────────────────────────────────────────────
export function fmtTemp(celsius, unit) {
  if (unit === 'F') return `${Math.round(celsius * 9 / 5 + 32)}°F`
  return `${Math.round(celsius)}°C`
}

export function fmtTempShort(celsius, unit) {
  if (unit === 'F') return `${Math.round(celsius * 9 / 5 + 32)}°`
  return `${Math.round(celsius)}°`
}

export function fmtWind(kmh, unit) {
  if (unit === 'mi') return `${Math.round(kmh * 0.621371)} mph`
  return `${Math.round(kmh)} km/h`
}

export function fmtDist(km, unit) {
  if (unit === 'mi') return `${(parseFloat(km) * 0.621371).toFixed(1)} mi`
  return `${km} km`
}

export function fmtTime(dateStr, format) {
  const d = new Date(dateStr)
  if (format === '12') return d.toLocaleTimeString([], { hour: 'numeric', hour12: true })
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}
// ─────────────────────────────────────────────────────────────────

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('cs-settings', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
