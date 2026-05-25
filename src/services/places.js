const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function getNearbyPlaces(lat, lon, radius = 1000, condition = 'Mild', interests = []) {
  const params = new URLSearchParams({ lat, lon, radius, condition })
  if (interests.length) params.set('interests', interests.join(','))
  const res = await fetch(`${API}/api/places/nearby?${params}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch places')
  return res.json()
}
