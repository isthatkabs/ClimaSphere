import { createContext, useContext, useState, useCallback } from 'react'

const KEY = 'cs-locations'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

const LocationsContext = createContext(null)

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState(load)

  const persist = (next) => {
    localStorage.setItem(KEY, JSON.stringify(next))
    return next
  }

  const addLocation = useCallback((loc) => {
    setLocations(prev => {
      if (prev.some(l => l.id === loc.id)) return prev
      const next = [...prev, { ...loc, isHome: prev.length === 0 }]
      return persist(next)
    })
  }, [])

  const removeLocation = useCallback((id) => {
    setLocations(prev => {
      let next = prev.filter(l => l.id !== id)
      const wasHome = prev.find(l => l.id === id)?.isHome
      if (wasHome && next.length > 0) next = next.map((l, i) => ({ ...l, isHome: i === 0 }))
      return persist(next)
    })
  }, [])

  const setHome = useCallback((id) => {
    setLocations(prev => persist(prev.map(l => ({ ...l, isHome: l.id === id }))))
  }, [])

  const homeLocation = locations.find(l => l.isHome) ?? null

  return (
    <LocationsContext.Provider value={{ locations, addLocation, removeLocation, setHome, homeLocation }}>
      {children}
    </LocationsContext.Provider>
  )
}

export function useLocations() {
  const ctx = useContext(LocationsContext)
  if (!ctx) throw new Error('useLocations must be used inside LocationsProvider')
  return ctx
}
