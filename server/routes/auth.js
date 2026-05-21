import { Router } from 'express'
import jwt      from 'jsonwebtoken'

const router     = Router()
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID

// Cache Firebase's public certs so we don't re-fetch on every request
let cachedCerts  = null
let certsExpiry  = 0

async function getFirebaseCerts() {
  if (cachedCerts && Date.now() < certsExpiry) return cachedCerts
  const res     = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')
  const maxAge  = parseInt(res.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1] ?? '3600')
  cachedCerts   = await res.json()
  certsExpiry   = Date.now() + maxAge * 1000
  return cachedCerts
}

async function verifyIdToken(idToken) {
  const certs   = await getFirebaseCerts()
  const decoded = jwt.decode(idToken, { complete: true })
  if (!decoded) throw new Error('Invalid token format')

  const cert = certs[decoded.header.kid]
  if (!cert) throw new Error('Unknown key ID')

  return jwt.verify(idToken, cert, {
    algorithms: ['RS256'],
    audience:   PROJECT_ID,
    issuer:     `https://securetoken.google.com/${PROJECT_ID}`,
  })
}

router.post('/session', async (req, res) => {
  const { idToken } = req.body
  if (!idToken) return res.status(400).json({ error: 'idToken required' })

  try {
    const payload = await verifyIdToken(idToken)
    req.session.uid   = payload.sub
    req.session.email = payload.email   ?? null
    req.session.name  = payload.name    ?? payload.email?.split('@')[0] ?? 'User'
    return res.json({ ok: true, uid: payload.sub })
  } catch (err) {
    console.error('Token verification failed:', err.message)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
})

router.delete('/session', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' })
    res.clearCookie('cs.sid')
    return res.json({ ok: true })
  })
})

router.get('/session', (req, res) => {
  if (req.session?.uid) {
    return res.json({ authenticated: true, uid: req.session.uid, email: req.session.email, name: req.session.name })
  }
  return res.json({ authenticated: false })
})

export default router
