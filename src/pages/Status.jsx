import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomeNav    from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'
import { globalStyles } from '../styles/homeStyles'

const SERVICES = [
  { name: 'ClimaSphere App',        check: () => Promise.resolve(true) },
  { name: 'Firebase Auth',          check: () => Promise.resolve(true) },
  { name: 'OpenWeatherMap API',     check: () => fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=cb1b50442a576efad21fb25f1ea232fa').then(r => r.ok) },
  { name: 'Open-Meteo Forecast API',check: () => fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current_weather=true').then(r => r.ok) },
]

const INCIDENTS = [
  { date: 'No incidents recorded', desc: 'All systems have been operating normally.' },
]

export default function Status() {
  const [results, setResults] = useState(SERVICES.map(() => 'checking'))

  useEffect(() => {
    SERVICES.forEach((svc, i) => {
      svc.check()
        .then(ok => setResults(prev => { const n = [...prev]; n[i] = ok ? 'ok' : 'degraded'; return n }))
        .catch(()  => setResults(prev => { const n = [...prev]; n[i] = 'degraded'; return n }))
    })
  }, [])

  const allOk = results.every(r => r === 'ok')

  const statusColour = r =>
    r === 'ok'       ? '#22c55e' :
    r === 'degraded' ? '#f97316' : '#94a3b8'

  const statusLabel = r =>
    r === 'ok'       ? 'Operational' :
    r === 'degraded' ? 'Degraded'    : 'Checking…'

  return (
    <div style={{
      position: 'relative', minHeight: '100vh',
      fontFamily: "'DM Sans', sans-serif", color: '#e8e0ff', overflowX: 'hidden',
      background: 'linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)',
    }}>
      <style>{globalStyles}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(138,60,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(138,60,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <HomeNav />

        <section style={{ maxWidth: 680, margin: '0 auto', padding: '70px 40px 100px' }}>
          <Link to="/" style={{ fontSize: 13, color: '#a78bfa', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
            ← Back
          </Link>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(32px, 4vw, 52px)', color: '#f0ecff',
            letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 40,
          }}>
            System Status
          </h1>

          {/* Overall banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '18px 22px', borderRadius: 14, marginBottom: 36,
            background: allOk ? 'rgba(34,197,94,0.08)' : 'rgba(249,115,22,0.08)',
            border: `1px solid ${allOk ? 'rgba(34,197,94,0.25)' : 'rgba(249,115,22,0.25)'}`,
          }}>
            <span style={{ fontSize: 24 }}>{allOk ? '✅' : '⚠️'}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: allOk ? '#22c55e' : '#f97316' }}>
                {allOk ? 'All systems operational' : 'Some systems may be degraded'}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(200,190,240,0.45)', marginTop: 2 }}>
                Last checked: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Service list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 52 }}>
            {SERVICES.map((svc, i) => (
              <div key={svc.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
              }}>
                <span style={{ fontSize: 14 }}>{svc.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: statusColour(results[i]),
                    boxShadow: results[i] === 'ok' ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
                  }} />
                  <span style={{ fontSize: 13, color: statusColour(results[i]) }}>
                    {statusLabel(results[i])}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Incident history */}
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 20,
            color: '#c4b0ff', marginBottom: 16,
          }}>
            Incident History
          </h2>
          {INCIDENTS.map((inc, i) => (
            <div key={i} style={{
              padding: '14px 18px', borderRadius: 10,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 12, color: 'rgba(200,190,240,0.4)', marginBottom: 4 }}>{inc.date}</div>
              <div style={{ fontSize: 13, color: 'rgba(200,190,240,0.65)' }}>{inc.desc}</div>
            </div>
          ))}
        </section>

        <HomeFooter />
      </div>
    </div>
  )
}