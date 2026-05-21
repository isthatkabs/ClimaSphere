const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function createSession(firebaseUser) {
  const idToken = await firebaseUser.getIdToken()
  const res = await fetch(`${API}/auth/session`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify({ idToken }),
  })
  if (!res.ok) throw new Error('Failed to create server session')
  return res.json()
}

export async function destroySession() {
  await fetch(`${API}/auth/session`, { method: 'DELETE', credentials: 'include' })
}

export async function checkSession() {
  const res = await fetch(`${API}/auth/session`, { credentials: 'include' })
  return res.json()
}