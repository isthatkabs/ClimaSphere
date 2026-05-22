import 'dotenv/config'
import express     from 'express'
import session     from 'express-session'
import cors        from 'cors'
import authRoutes    from './routes/auth.js'
import weatherRoutes from './routes/weather.js'
import aiRoutes      from './routes/ai.js'

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())

app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  name:              'cs.sid',
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  },
}))

app.use('/auth',        authRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api/ai',      aiRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }))

app.listen(PORT, () =>
  console.log(`✅  ClimaSphere server running → http://localhost:${PORT}`)
)