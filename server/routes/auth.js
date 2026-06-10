import { Router }         from 'express'
import { verifyIdToken } from '../utils/verifyIdToken.js'

const router = Router()

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
