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
  const { messages, weatherSummary } = req.body

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }

  const system =
    `You are ClimaSphere's helpful weather and lifestyle assistant. ` +
    `The user's current local conditions are: ${weatherSummary ?? 'unknown'}. ` +
    `\n\nYou can help with a wide range of questions, including:\n` +
    `- What to wear or pack for the current or forecasted weather\n` +
    `- Activity suggestions suited to today's conditions\n` +
    `- Travel and destination recommendations (e.g. "where in the UK is warm this weekend?")\n` +
    `- Weather-related event planning (picnics, sports, days out, holidays)\n` +
    `- Seasonal lifestyle advice (what to do in summer, winter, etc.)\n` +
    `- General questions about weather patterns, climate, or how weather affects plans\n` +
    `\nBe conversational, practical, and friendly. ` +
    `Give lists when they're more useful than paragraphs. ` +
    `Keep answers focused — don't waffle. ` +
    `Only decline if a question is completely unrelated to weather, travel, activities, or lifestyle.`

  try {
    const message = await getClient().messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system,
      messages,
    })

    res.json({ reply: message.content[0].text })
  } catch (err) {
    console.error('AI chat error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
