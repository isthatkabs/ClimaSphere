import { Router } from 'express'
import { requireSession } from '../middleware/requireSession.js'

const router       = Router()
const GEOAPIFY_URL = 'https://api.geoapify.com/v2/places'

router.use(requireSession)

const INDOOR  = 'catering.cafe,catering.restaurant,catering.bar,catering.pub,catering.fast_food,catering.ice_cream,entertainment.cinema,education.library,entertainment.museum,commercial.shopping_mall'
const OUTDOOR = 'leisure.park,leisure.playground,natural.forest,entertainment.zoo,tourism.attraction'
const ALL     = `${INDOOR},${OUTDOOR}`

function getCategories(condition) {
  switch (condition) {
    case 'Stormy':
    case 'Rainy':
    case 'Cold':
    case 'Very Cold':
    case 'Snowy':
      return INDOOR
    default:
      return ALL
  }
}

function friendlyCategory(raw = '') {
  if (raw.includes('cafe'))           return 'Cafe'
  if (raw.includes('restaurant'))     return 'Restaurant'
  if (raw.includes('bar'))            return 'Bar'
  if (raw.includes('pub'))            return 'Pub'
  if (raw.includes('fast_food'))      return 'Fast Food'
  if (raw.includes('ice_cream'))      return 'Ice Cream'
  if (raw.includes('cinema'))         return 'Cinema'
  if (raw.includes('library'))        return 'Library'
  if (raw.includes('museum'))         return 'Museum'
  if (raw.includes('shopping'))       return 'Shopping'
  if (raw.includes('park'))           return 'Park'
  if (raw.includes('playground'))     return 'Playground'
  if (raw.includes('forest'))         return 'Nature'
  if (raw.includes('zoo'))            return 'Zoo'
  if (raw.includes('attraction'))     return 'Attraction'
  return 'Place'
}

router.get('/nearby', async (req, res) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY
  const { lat, lon, radius = 1000, condition = 'Mild' } = req.query
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' })
  if (!API_KEY || API_KEY === 'your_geoapify_api_key_here') {
    return res.status(503).json({ error: 'Places API not configured' })
  }

  const categories = getCategories(condition)
  const url = `${GEOAPIFY_URL}?categories=${categories}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=6&apiKey=${API_KEY}`

  try {
    const upstream = await fetch(url)
    const data     = await upstream.json()

    const results = (data?.features ?? [])
      .map(f => ({
        name:       f.properties?.name,
        categories: [{ name: friendlyCategory(f.properties?.categories?.[0] ?? '') }],
        distance:   Math.round(f.properties?.distance ?? 0),
      }))
      .filter(r => r.name)

    console.log(`[places] Geoapify results=${results.length} for ll=${lat},${lon} r=${radius} cond=${condition}`)
    return res.json({ results })
  } catch (err) {
    console.error('[places] fetch error:', err.message)
    return res.status(502).json({ error: 'Places service temporarily unavailable' })
  }
})

export default router
