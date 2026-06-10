import { auth } from '../firebase'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function authHeaders() {
  const token = await auth.currentUser?.getIdToken().catch(() => null)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getAISuggestions(payload) {
  const res = await fetch(`${API}/api/ai/suggestions`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json', ...await authHeaders() },
    body:        JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('AI service unavailable')
  return res.json()
}

export async function getDayPlan(payload) {
  const res = await fetch(`${API}/api/ai/dayplan`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json', ...await authHeaders() },
    body:        JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Day plan unavailable')
  return res.json()
}

export async function chatWithAI(messages, weatherSummary, locationName) {
  const res = await fetch(`${API}/api/ai/chat`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json', ...await authHeaders() },
    body:        JSON.stringify({ messages, weatherSummary, locationName }),
  })
  if (res.status === 401) throw new Error('auth')
  if (!res.ok) throw new Error('AI chat unavailable')
  return res.json()
}
