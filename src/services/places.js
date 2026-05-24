const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function getNearbyPlaces(lat, lon, radius = 1000, condition = 'Mild') {
  const res = await fetch(
    `${API}/api/places/nearby?lat=${lat}&lon=${lon}&radius=${radius}&condition=${encodeURIComponent(condition)}`,
    { credentials: 'include' }
  )
  if (!res.ok) throw new Error('Failed to fetch places')
  return res.json()
}
