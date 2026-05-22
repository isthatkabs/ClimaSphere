const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function getAISuggestions(payload) {
  const res = await fetch(`${API}/api/ai/suggestions`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('AI service unavailable')
  return res.json()
}

export async function chatWithAI(messages, weatherSummary) {
  const res = await fetch(`${API}/api/ai/chat`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify({ messages, weatherSummary }),
  })
  if (!res.ok) throw new Error('AI chat unavailable')
  return res.json()
}
