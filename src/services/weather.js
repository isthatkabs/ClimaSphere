const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE    = 'https://api.openweathermap.org/data/2.5'
const GEO     = 'https://api.openweathermap.org/geo/1.0'

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return []
  const res  = await fetch(`${GEO}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function getCurrentWeather(lat, lon) {
  const res  = await fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
  const data = await res.json()
  if (data.cod && data.cod !== 200) throw new Error(data.message || 'City not found')
  return data
}

export async function getForecast(lat, lon) {
  const res  = await fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=40`)
  const data = await res.json()
  if (data.cod && data.cod !== '200') throw new Error(data.message || 'Forecast not found')
  return data
}