import { Router } from 'express'
import admin      from 'firebase-admin'

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
    console.error('❌  Firebase Admin env vars missing')
    process.exit(1)
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  })

  console.log('✅  Firebase Admin SDK initialised')
}

const router = Router()

router.post('/session', async (req, res) => {
  const { idToken } = req.body
  if (!idToken) return res.status(400).json({ error: 'idToken required' })

  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    req.session.uid   = decoded.uid
    req.session.email = decoded.email ?? null
    req.session.name  = decoded.name  ?? decoded.email?.split('@')[0] ?? 'User'
    return res.json({ ok: true, uid: decoded.uid })
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