import { Link } from 'react-router-dom'

export default function ApiHero() {
  return (
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
        }}>
          with Weather Data
        </span>
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
  )
}