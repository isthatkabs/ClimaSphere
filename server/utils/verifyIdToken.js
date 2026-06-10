import jwt from 'jsonwebtoken'

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID

let cachedCerts = null
let certsExpiry = 0

async function getFirebaseCerts() {
  if (cachedCerts && Date.now() < certsExpiry) return cachedCerts
  const res    = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')
  const maxAge = parseInt(res.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1] ?? '3600')
  cachedCerts  = await res.json()
  certsExpiry  = Date.now() + maxAge * 1000
  return cachedCerts
}

export async function verifyIdToken(idToken) {
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
