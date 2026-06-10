import { auth } from '../firebase'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function get(path) {
  const headers = {}
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken()
      if (token) headers['Authorization'] = `Bearer ${token}`
    } catch { /* no token */ }
  }

  const res = await fetch(`${API}${path}`, { credentials: 'include', headers })
  if (res.status === 401) throw new Error('Session expired — please log in again')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Weather service unavailable')
  }
  return res.json()
}

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return []
  try {
    const data = await get(`/api/weather/search?q=${encodeURIComponent(query)}`)
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

export async function getCurrentWeather(lat, lon) {
  const data = await get(`/api/weather/current?lat=${lat}&lon=${lon}`)
  if (data.cod && data.cod !== 200) throw new Error(data.message || 'City not found')
  return data
}

export async function getForecast(lat, lon) {
  return get(`/api/weather/forecast?lat=${lat}&lon=${lon}`)
}

export async function getAQI(lat, lon) {
  return get(`/api/weather/aqi?lat=${lat}&lon=${lon}`)
}