import { Link } from 'react-router-dom'
import HomeNav    from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'
import { globalStyles } from '../styles/homeStyles'

const tiers = [
  {
    name: 'Free', price: '$0', period: 'forever',
    color: '#22c55e', border: 'rgba(34,197,94,0.25)', bg: 'rgba(34,197,94,0.05)',
    features: ['1,000 calls/day', '5-day forecast', 'Current conditions', 'City search', 'Community support'],
    url: 'https://openweathermap.org/api',
  },
  {
    name: 'Pro', price: '$12', period: 'per month',
    color: '#a78bfa', border: 'rgba(167,139,250,0.35)', bg: 'rgba(167,139,250,0.07)',
    badge: 'Most popular',
    features: ['100,000 calls/day', '14-day forecast', 'Hourly data', 'Air quality index', 'Radar & satellite', 'Email support'],
    cta: 'Start Free Trial',
    ctaStyle: { background: 'linear-gradient(135deg, #7c3aff, #5a7cff)', color: '#fff', border: 'none' },
    url: 'https://openweathermap.org/price',
  },
  {
    name: 'Enterprise', price: 'Custom', period: 'contact us',
    color: '#fbbf24', border: 'rgba(251,191,36,0.25)', bg: 'rgba(251,191,36,0.05)',
    features: ['Unlimited calls', 'All forecast models', 'Webhooks & streaming', 'SLA guarantee', 'Dedicated support', 'Custom endpoints'],
    cta: 'Contact Sales',
    ctaStyle: { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' },
    url: 'https://openweathermap.org/enterprise',
  },
]

const endpoints = [
  {
    method: 'GET', path: '/v1/current',
    desc: 'Returns real-time weather for any lat/lon — temperature, humidity, wind, pressure, and conditions.',
    url: 'https://openweathermap.org/current',
  },
  {
    method: 'GET', path: '/v1/forecast',
    desc: 'Hourly and daily forecasts up to 5 days. Includes precipitation probability and weather codes.',
    url: 'https://open-meteo.com/en/docs',
  },
  {
    method: 'GET', path: '/v1/alerts',
    desc: 'Active severe weather alerts (storms, snow, fog, extreme heat) for a given location.',
    url: 'https://openweathermap.org/triggers',
  },
  {
    method: 'GET', path: '/v1/air',
    desc: 'Air Quality Index (1–5 scale) plus individual pollutant readings: CO, NO₂, O₃, PM2.5, PM10.',
    url: 'https://openweathermap.org/api/air-pollution',
  },
  {
    method: 'GET', path: '/v1/search',
    desc: 'Geocode a city name into coordinates. Returns up to 5 matching cities with country and state.',
    url: 'https://openweathermap.org/api/geocoding-api',
  },
]

const codeExample = `fetch('https://api.climasphere.io/v1/current?lat=51.5&lon=-0.12', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
.then(res => res.json())
.then(data => {
  console.log(data.temp)        // 18.4
  console.log(data.condition)   // "Partly cloudy"
  console.log(data.wind_kmh)    // 22
})`

const root = {
  position: 'relative', minHeight: '100vh',
  fontFamily: "'DM Sans', sans-serif", color: '#e8e0ff', overflowX: 'hidden',
  background: 'linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)',
}

export default function ApiPage() {
  return (
    <div style={root}>
      <style>{globalStyles}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(138,60,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(138,60,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <HomeNav />

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '80px 60px 60px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: 100, padding: '6px 14px',
            fontSize: 12, fontWeight: 500, color: '#fde68a',
            marginBottom: 24, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
            Developer API
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1,
            color: '#f0ecff', marginBottom: 20, letterSpacing: '-1px',
          }}>
            Build Anything<br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #a06bff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic',
            }}>with Weather Data</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(200,190,240,0.7)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            A clean API giving you current conditions, multi-day forecasts, alerts, and much more for any location on Earth!
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <Link to="/auth" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #7c3aff 0%, #5a7cff 100%)',
              color: '#fff', fontWeight: 600, fontSize: 15,
              padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(124,58,255,0.4)',
            }}>
              Get Free API Key →
            </Link>
            <a href="#endpoints" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'rgba(200,190,240,0.8)', fontWeight: 500, fontSize: 15,
              padding: '13px 24px', borderRadius: 10, textDecoration: 'none',
              border: '1px solid rgba(138,60,255,0.3)',
            }}>
              View Endpoints
            </a>
          </div>
        </section>

        {/* Code example */}
        <section style={{ padding: '0 60px 70px' }}>
          <div style={{
            maxWidth: 760, margin: '0 auto',
            background: 'rgba(8,6,17,0.95)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['#f87171','#fbbf24','#22c55e'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ fontSize: 12, color: 'rgba(226,234,252,0.3)', marginLeft: 8 }}>example.js</span>
            </div>
            <pre style={{
              padding: '24px 28px', fontSize: 13, lineHeight: 1.7,
              color: 'rgba(226,234,252,0.8)', overflowX: 'auto',
              fontFamily: "'Fira Code', 'Courier New', monospace", margin: 0,
            }}>
              {codeExample}
            </pre>
          </div>
        </section>

        {/* Endpoints */}
        <section id="endpoints" style={{ padding: '0 60px 80px' }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#f0ecff', marginBottom: 32, letterSpacing: '-0.5px', textAlign: 'center',
          }}>
            Endpoints
          </h2>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {endpoints.map(e => (
              <div
                key={e.path}
                onClick={() => window.open(e.url, '_blank')}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={ev => ev.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#22c55e',
                  background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
                  padding: '3px 8px', borderRadius: 6, flexShrink: 0, marginTop: 2,
                }}>
                  {e.method}
                </span>
                <div style={{ flex: 1 }}>
                  <code style={{ fontSize: 13, color: '#a78bfa', fontFamily: "'Fira Code', monospace", display: 'block', marginBottom: 4 }}>
                    {e.path}
                  </code>
                  <span style={{ fontSize: 12, color: 'rgba(226,234,252,0.5)', lineHeight: 1.5 }}>{e.desc}</span>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(167,139,250,0.5)', flexShrink: 0, marginTop: 2 }}>↗</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section style={{ padding: '0 60px 100px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#f0ecff', marginBottom: 48, letterSpacing: '-0.5px',
          }}>
            Simple, transparent pricing
          </h2>
          <div style={{ display: 'flex', gap: 20, maxWidth: 900, margin: '0 auto', alignItems: 'flex-start' }}>
            {tiers.map(t => (
              <div
                key={t.name}
                onClick={() => window.open(t.url, '_blank')}
                style={{
                  flex: 1, background: t.bg, border: `1px solid ${t.border}`,
                  borderRadius: 20, padding: '32px 26px', textAlign: 'left',
                  position: 'relative', cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={ev => {
                  ev.currentTarget.style.transform = 'translateY(-4px)'
                  ev.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={ev => {
                  ev.currentTarget.style.transform = 'translateY(0)'
                  ev.currentTarget.style.boxShadow = 'none'
                }}
              >
                {t.badge && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #7c3aff, #5a7cff)',
                    color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 14px',
                    borderRadius: 100, whiteSpace: 'nowrap',
                  }}>
                    {t.badge}
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 600, color: t.color, marginBottom: 8 }}>{t.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: '#f0ecff' }}>{t.price}</span>
                  <span style={{ fontSize: 13, color: 'rgba(226,234,252,0.4)' }}>/ {t.period}</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '20px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: t.cta ? 24 : 0 }}>
                  {t.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span style={{ color: t.color, fontSize: 14 }}>✓</span>
                      <span style={{ color: 'rgba(226,234,252,0.7)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                {t.cta && (
                  <div style={{
                    marginTop: 24,
                    display: 'block', textAlign: 'center', padding: '11px 0',
                    borderRadius: 10, fontSize: 14, fontWeight: 600,
                    ...t.ctaStyle,
                  }}>
                    {t.cta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <HomeFooter />
      </div>
    </div>
  )
}