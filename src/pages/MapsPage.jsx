import { Link } from 'react-router-dom'
import HomeNav    from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'
import { globalStyles } from '../styles/homeStyles'

const layers = [
  {
    icon: '🌧', title: 'Precipitation Radar',
    desc: 'See exactly where rain, sleet, and snow are falling right now with live radar overlays updated every 5 minutes.',
    color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)',
    tag: 'Live',
  },
  {
    icon: '🌡', title: 'Temperature Map',
    desc: 'A colour-graded global map showing surface temperatures from arctic lows to desert highs.',
    color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)',
    tag: 'Live',
  },
  {
    icon: '💨', title: 'Wind Flow',
    desc: 'Animated wind particle streams showing speed and direction across any region on Earth.',
    color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)',
    tag: 'Live',
  },
  {
    icon: '🛰', title: 'Satellite Imagery',
    desc: 'True-colour and infrared satellite images updated every 15 minutes from global weather satellites.',
    color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)',
    tag: 'Live',
  },
  {
    icon: '☁️', title: 'Cloud Cover',
    desc: 'Cloud density overlaid on a map so you can instantly see where skies are clear or overcast.',
    color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)',
    tag: 'Live',
  },
  {
    icon: '🌊', title: 'Ocean & Wave Data',
    desc: 'Sea surface temperatures and swell heights for coastal planning and marine activities.',
    color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)',
    tag: 'Coming soon',
  },
]

const root = {
  position: 'relative', minHeight: '100vh',
  fontFamily: "'DM Sans', sans-serif", color: '#e8e0ff', overflowX: 'hidden',
  background: 'linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)',
}

export default function MapsPage() {
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
            background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
            borderRadius: 100, padding: '6px 14px',
            fontSize: 12, fontWeight: 500, color: '#7dd3fc',
            marginBottom: 24, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            Live map layers
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1,
            color: '#f0ecff', marginBottom: 20, letterSpacing: '-1px',
          }}>
            See Weather<br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #a06bff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic',
            }}>in Motion</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(200,190,240,0.7)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Interactive weather maps with live radar, satellite imagery, wind flow, and more — layered over any location on Earth.
          </p>
          <Link to="/auth" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aff 100%)',
            color: '#fff', fontWeight: 600, fontSize: 15,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(14,165,233,0.3)',
          }}>
            Open Maps →
          </Link>
        </section>

        {/* Mock map preview */}
        <section style={{ padding: '0 60px 60px' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            background: 'rgba(8,14,34,0.9)', border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 20, overflow: 'hidden', position: 'relative',
          }}>
            {/* Fake map area */}
            <div style={{
              height: 340, position: 'relative',
              background: 'linear-gradient(180deg, #0c1a2e 0%, #0a1628 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Grid lines to suggest a map */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }} />
              {/* Radar blobs */}
              {[
                { top: '30%', left: '35%', size: 120, color: 'rgba(56,189,248,0.15)' },
                { top: '45%', left: '50%', size: 80,  color: 'rgba(56,189,248,0.2)'  },
                { top: '25%', left: '60%', size: 60,  color: 'rgba(167,139,250,0.15)'},
              ].map((blob, i) => (
                <div key={i} style={{
                  position: 'absolute', top: blob.top, left: blob.left,
                  width: blob.size, height: blob.size, borderRadius: '50%',
                  background: blob.color, filter: 'blur(20px)',
                  transform: 'translate(-50%, -50%)',
                }} />
              ))}
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🗺</div>
                <div style={{ fontSize: 14, color: 'rgba(56,189,248,0.7)', fontWeight: 500 }}>Interactive map available in dashboard</div>
                <Link to="/auth" style={{
                  display: 'inline-block', marginTop: 14,
                  background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)',
                  color: '#7dd3fc', fontSize: 13, fontWeight: 500,
                  padding: '8px 18px', borderRadius: 8, textDecoration: 'none',
                }}>
                  Sign up to explore →
                </Link>
              </div>
            </div>

            {/* Layer toggles */}
            <div style={{
              display: 'flex', gap: 8, padding: '14px 20px',
              borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap',
            }}>
              {['Radar', 'Temperature', 'Wind', 'Satellite', 'Clouds'].map((l, i) => (
                <div key={l} style={{
                  padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                  background: i === 0 ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${i === 0 ? 'rgba(56,189,248,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: i === 0 ? '#7dd3fc' : 'rgba(226,234,252,0.5)',
                }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Layer cards */}
        <section style={{ padding: '0 60px 100px' }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#f0ecff', marginBottom: 40, letterSpacing: '-0.5px', textAlign: 'center',
          }}>
            Six layers. One map.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 900, margin: '0 auto' }}>
            {layers.map(l => (
              <div key={l.title} style={{
                background: l.bg, border: `1px solid ${l.border}`,
                borderRadius: 16, padding: '22px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 26 }}>{l.icon}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                    padding: '3px 8px', borderRadius: 100,
                    background: l.tag === 'Live' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
                    color: l.tag === 'Live' ? '#22c55e' : 'rgba(226,234,252,0.4)',
                    border: l.tag === 'Live' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                    {l.tag}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: l.color, marginBottom: 8 }}>{l.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(200,190,240,0.55)', lineHeight: 1.6 }}>{l.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <HomeFooter />
      </div>
    </div>
  )
}