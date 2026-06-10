import { Router }        from 'express'
import { requireSession } from '../middleware/requireSession.js'

const router   = Router()
const API_KEY  = process.env.WEATHER_API_KEY
const OWM_BASE = 'https://api.openweathermap.org/data/2.5'
const OWM_GEO  = 'https://api.openweathermap.org/geo/1.0'
const METEO    = 'https://api.open-meteo.com/v1'

router.use(requireSession)

async function proxy(res, url) {
  try {
    const upstream = await fetch(url)
    const data     = await upstream.json()
    if (upstream.status === 401 || upstream.status === 403) {
      console.error('Weather API key error:', upstream.status, data?.message)
      return res.status(502).json({ error: 'Weather service configuration error' })
    }
    return res.status(upstream.status).json(data)
  } catch (err) {
    console.error('Upstream fetch error:', err.message)
    return res.status(502).json({ error: 'Weather service temporarily unavailable' })
  }
}

router.get('/current', (req, res) => {
  const { lat, lon } = req.query
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' })
  return proxy(res, `${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
})

router.get('/forecast', (req, res) => {
  const { lat, lon } = req.query
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' })
  const url =
    `${METEO}/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,precipitation_probability,weathercode,relativehumidity_2m,` +
    `windspeed_10m,apparent_temperature,cloudcover,visibility,surface_pressure,uv_index` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max` +
    `&timezone=auto&forecast_days=5`
  return proxy(res, url)
})

router.get('/search', (req, res) => {
  const { q } = req.query
  if (!q || q.trim().length < 2) return res.json([])
  return proxy(res, `${OWM_GEO}/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`)
})

router.get('/aqi', (req, res) => {
  const { lat, lon } = req.query
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' })
  return proxy(res, `${OWM_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
})

export default router