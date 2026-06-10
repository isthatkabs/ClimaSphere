import { verifyIdToken } from '../utils/verifyIdToken.js'

export async function requireSession(req, res, next) {
  console.log('[auth] session uid:', req.session?.uid, '| has bearer:', !!req.headers['authorization'])
  if (req.session?.uid) return next()

  const authHeader = req.headers['authorization']
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    try {
      const payload = await verifyIdToken(token)
      req.session.uid   = payload.sub
      req.session.email = payload.email ?? null
      req.session.name  = payload.name  ?? payload.email?.split('@')[0] ?? 'User'
      return next()
    } catch {
      return res.status(401).json({ error: 'Unauthorized — please log in' })
    }
  }

  return res.status(401).json({ error: 'Unauthorized — please log in' })
}