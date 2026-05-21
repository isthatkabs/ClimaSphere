export function requireSession(req, res, next) {
  if (!req.session?.uid) {
    return res.status(401).json({ error: 'Unauthorized — please log in' })
  }
  next()
}