import { Router }        from 'express'
import Anthropic         from '@anthropic-ai/sdk'
import { requireSession } from '../middleware/requireSession.js'

const router = Router()

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key || key.startsWith('your_')) throw new Error('ANTHROPIC_API_KEY not set in server/.env')
  return new Anthropic({ apiKey: key })
}

router.use(requireSession)

router.post('/suggestions', async (req, res) => {
  const {
    location,
    country,
    temp,
    feelsLike,
    windspeed,
    precipProb,
    weathercode,
    uvIndex,
    humidity,
    primaryCondition,
  } = req.body

  const weatherContext = [
    `Location: ${location}${country ? `, ${country}` : ''}`,
    `Temperature: ${Math.round(temp)}°C (feels like ${Math.round(feelsLike)}°C)`,
    `Wind speed: ${Math.round(windspeed)} km/h`,
    `Precipitation chance: ${precipProb}%`,
    `Humidity: ${humidity}%`,
    `UV Index: ${uvIndex ?? 'unknown'}`,
    `Overall condition: ${primaryCondition}`,
  ].join('\n')

  try {
    const message = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 180,
      messages: [{
        role: 'user',
        content:
          `You are ClimaSphere's friendly weather advisor. Write 2–3 short, warm, practical sentences ` +
          `advising the user how to make the most of their day given these conditions. ` +
          `Be specific to the weather — mention concrete things they should do or watch out for. ` +
          `Do not use bullet points. Do not start with "I" or greet the user.\n\n${weatherContext}`,
      }],
    })

    res.json({ insight: message.content[0].text })
  } catch (err) {
    console.error('AI suggestions error:', err.message)
    const status = err.message.includes('not set') ? 503 : 500
    res.status(status).json({ error: err.message })
  }
})

router.post('/chat', async (req, res) => {
  const { messages, weatherSummary, locationName } = req.body

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }

  const GENERIC_NAMES = ['your location', 'my location', 'current location', 'here']
  const city = locationName && !GENERIC_NAMES.includes(locationName.toLowerCase().trim())
    ? locationName
    : null

  const cityClause = city
    ? `The user is in ${city}. When they ask about places, venues, things to do, or where to eat/go, you MUST name exactly 3 specific real places that exist in ${city} — actual restaurants, cafes, parks, landmarks, or attractions. Format the response as: one short intro sentence, then each place on its own new line as "1. Place Name — brief description", then a final short sentence (e.g. recommending they check Google Maps or Just Eat for hours). Do not ask the user for their location. Do not say you don't know where they are. You know they are in ${city}.`
    : `The user's location is in the weather context above. When they ask about places or things to do, use that location. Name exactly 3 specific real places, each on its own new line as "1. Place Name — brief description", with one short intro sentence before and one short closing sentence after. Do not ask the user to confirm their location.`

  const system =
    `You are ClimaSphere's helpful weather and lifestyle assistant. ` +
    `The user's current local conditions are: ${weatherSummary ?? 'unknown'}. ` +
    `${cityClause} ` +
    `For non-place questions keep replies short and direct — 2 to 4 sentences max unless the user explicitly asks for more detail. ` +
    `Never use markdown formatting: no asterisks, no bold, no headers. Numbered lists (1. 2. 3.) are allowed when listing places. Plain conversational text otherwise. ` +
    `Only decline if a question is completely unrelated to weather, travel, activities, or lifestyle.`

  try {
    const message = await getClient().messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 350,
      system,
      messages,
    })

    res.json({ reply: message.content[0].text })
  } catch (err) {
    console.error('AI chat error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.post('/dayplan', async (req, res) => {
  const {
    location, country, temp, feelsLike, windspeed,
    precipProb, primaryCondition, interests,
  } = req.body

  const weatherContext = [
    `Location: ${location}${country ? `, ${country}` : ''}`,
    `Temperature: ${Math.round(temp)}°C (feels like ${Math.round(feelsLike)}°C)`,
    `Wind: ${Math.round(windspeed)} km/h`,
    `Rain chance: ${precipProb}%`,
    `Condition: ${primaryCondition}`,
  ].join('\n')

  const interestsList = Array.isArray(interests) && interests.length > 0
    ? interests.join(', ')
    : 'general activities'

  const prompt =
    `You are ClimaSphere's day planner. Generate a personalised full-day plan.\n\n` +
    `Weather:\n${weatherContext}\n\n` +
    `User interests: ${interestsList}\n\n` +
    `Return ONLY valid JSON in this exact structure, no other text:\n` +
    `{"slots":[` +
    `{"period":"Morning","time":"8:00 AM – 12:00 PM","emoji":"🌅","theme":"short catchy phrase","items":[{"emoji":"☕","title":"Short title","detail":"One short sentence."}]},` +
    `{"period":"Afternoon","time":"12:00 PM – 5:00 PM","emoji":"☀️","theme":"short catchy phrase","items":[...]},` +
    `{"period":"Evening","time":"5:00 PM – 9:00 PM","emoji":"🌆","theme":"short catchy phrase","items":[...]}` +
    `]}\n\n` +
    `Rules: 2-3 items per slot. Tailor to user interests. Adjust for weather (indoor if rainy). Titles 3-6 words. Detail max 10 words. Fitting emojis.`

  try {
    const message = await getClient().messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 900,
      messages:   [{ role: 'user', content: prompt }],
    })

    const text      = message.content[0].text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    res.json(JSON.parse(jsonMatch[0]))
  } catch (err) {
    console.error('Day plan error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
