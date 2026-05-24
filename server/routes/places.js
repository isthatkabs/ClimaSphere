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

function friendlyCategory(categories = []) {
  const raw = (Array.isArray(categories) ? categories : [categories]).join(',').toLowerCase()
  if (raw.includes('cafe') || raw.includes('coffee'))              return 'Café'
  if (raw.includes('fast_food') || raw.includes('takeaway'))       return 'Takeaway'
  if (raw.includes('bakery') || raw.includes('pastry'))            return 'Bakery'
  if (raw.includes('ice_cream') || raw.includes('dessert'))        return 'Ice Cream'
  if (raw.includes('restaurant'))                                  return 'Restaurant'
  if (raw.includes('pub') || raw.includes('biergarten'))           return 'Pub'
  if (raw.includes('bar'))                                         return 'Bar'
  if (raw.includes('food_court'))                                  return 'Food Court'
  if (raw.includes('supermarket'))                                 return 'Supermarket'
  if (raw.includes('food_and_drink') || raw.includes('butcher'))   return 'Food & Drink'
  if (raw.includes('convenience'))                                 return 'Convenience Store'
  if (raw.includes('department_store'))                            return 'Department Store'
  if (raw.includes('shopping') || raw.includes('mall'))            return 'Shopping'
  if (raw.includes('clothing') || raw.includes('fashion'))         return 'Clothing'
  if (raw.includes('cinema') || raw.includes('movie'))             return 'Cinema'
  if (raw.includes('museum'))                                      return 'Museum'
  if (raw.includes('art') || raw.includes('gallery'))              return 'Art Gallery'
  if (raw.includes('library'))                                     return 'Library'
  if (raw.includes('zoo'))                                         return 'Zoo'
  if (raw.includes('attraction') || raw.includes('tourism'))       return 'Attraction'
  if (raw.includes('playground'))                                  return 'Playground'
  if (raw.includes('park') || raw.includes('garden'))              return 'Park'
  if (raw.includes('forest') || raw.includes('nature'))            return 'Nature'
  if (raw.includes('sport') || raw.includes('gym') || raw.includes('fitness')) return 'Sports & Fitness'
  if (raw.includes('swimming'))                                    return 'Swimming Pool'
  if (raw.includes('pharmacy') || raw.includes('chemist'))         return 'Pharmacy'
  if (raw.includes('hotel') || raw.includes('accommodation'))      return 'Hotel'
  if (raw.includes('catering'))                                    return 'Eatery'
  if (raw.includes('commercial'))                                  return 'Shop'
  if (raw.includes('leisure'))                                     return 'Leisure'
  if (raw.includes('entertainment'))                               return 'Entertainment'
  return 'Local Place'
}

router.get('/nearby', async (req, res) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY
  const { lat, lon, radius = 1000, condition = 'Mild' } = req.query
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' })
  if (!API_KEY || API_KEY === 'your_geoapify_api_key_here') {
    return res.status(503).json({ error: 'Places API not configured' })
  }

  const categories = getCategories(condition)
  const url = `${GEOAPIFY_URL}?categories=${categories}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=10&apiKey=${API_KEY}`

  try {
    const upstream = await fetch(url)
    const data     = await upstream.json()

    const results = (data?.features ?? [])
      .map(f => ({
        name:       f.properties?.name,
        categories: [{ name: friendlyCategory(f.properties?.categories ?? []) }],
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
