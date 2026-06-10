import { auth } from '../firebase'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const _cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getNearbyPlaces(lat, lon, radius = 1000, condition = 'Mild', interests = []) {
  const key = `${lat}|${lon}|${radius}|${condition}|${(interests ?? []).join(',')}`
  const hit  = _cache.get(key)
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data

  const token = await auth.currentUser?.getIdToken().catch(() => null)
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const params = new URLSearchParams({ lat, lon, radius, condition })
  if (interests.length) params.set('interests', interests.join(','))
  const res = await fetch(`${API}/api/places/nearby?${params}`, { credentials: 'include', headers })
  if (!res.ok) throw new Error('Failed to fetch places')
  const data = await res.json()
  _cache.set(key, { data, ts: Date.now() })
  return data
}
