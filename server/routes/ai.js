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

export default router
