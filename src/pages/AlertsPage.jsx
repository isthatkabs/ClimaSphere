import { Link } from 'react-router-dom'
import HomeNav    from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'
import { globalStyles } from '../styles/homeStyles'

const alertTypes = [
  { icon: '⛈', title: 'Thunderstorm',   desc: 'Severe storm warnings with lightning and high wind activity.',    color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.2)'  },
  { icon: '🌧', title: 'Heavy Rain',     desc: 'Alerts when precipitation probability exceeds 60% in your area.', color: '#22c55e', bg: 'rgba(34,197,94,0.07)',   border: 'rgba(34,197,94,0.18)'   },
  { icon: '❄️', title: 'Snow & Ice',     desc: 'Winter weather warnings for snow accumulation and icy conditions.', color: '#38bdf8', bg: 'rgba(56,189,248,0.07)', border: 'rgba(56,189,248,0.2)'  },
  { icon: '💨', title: 'Strong Winds',   desc: 'Notified when sustained winds or gusts exceed dangerous thresholds.', color: '#a78bfa', bg: 'rgba(167,139,250,0.07)', border: 'rgba(167,139,250,0.2)' },
  { icon: '🌫', title: 'Dense Fog',      desc: 'Visibility warnings when fog reduces sight lines below 1 km.',     color: '#94a3b8', bg: 'rgba(148,163,184,0.07)', border: 'rgba(148,163,184,0.2)' },
  { icon: '🌡', title: 'Extreme Heat',   desc: 'Heat advisory alerts when temperatures exceed your comfort threshold.', color: '#fb923c', bg: 'rgba(251,146,60,0.07)', border: 'rgba(251,146,60,0.2)'  },
]

const steps = [
  { num: '01', title: 'Create your account',    desc: 'Sign up for free — no credit card required.'                    },
  { num: '02', title: 'Allow location access',  desc: 'ClimaSphere detects your location automatically on first load.'  },
  { num: '03', title: 'Alerts activate',        desc: 'Your dashboard checks the forecast and surfaces alerts in real time.' },
]

const exampleAlerts = [
  { color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.2)', title: 'Storm alert today',   sub: 'Thunderstorms from 6 PM' },
  { color: '#22c55e', bg: 'rgba(34,197,94,0.07)',   border: 'rgba(34,197,94,0.18)',  title: 'Rain alert today',    sub: '72% chance from 3 PM'    },
  { color: '#38bdf8', bg: 'rgba(56,189,248,0.07)',  border: 'rgba(56,189,248,0.2)',  title: 'Snow expected today', sub: 'Snow from 9 PM'           },
]

const root = {
  position: 'relative', minHeight: '100vh',
  fontFamily: "'DM Sans', sans-serif", color: '#e8e0ff', overflowX: 'hidden',
  background: 'linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)',
}

export default function AlertsPage() {
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
            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
            borderRadius: 100, padding: '6px 14px',
            fontSize: 12, fontWeight: 500, color: '#fca5a5',
            marginBottom: 24, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            Smart weather alerts
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1,
            color: '#f0ecff', marginBottom: 20, letterSpacing: '-1px',
          }}>
            Never Be Caught<br />
            <span style={{
              background: 'linear-gradient(135deg, #f87171 0%, #a06bff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic',
            }}>Off Guard Again</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(200,190,240,0.7)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            ClimaSphere monitors your local forecast around the clock and alerts you the moment conditions change — no setup needed.
          </p>
          <Link to="/auth" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #7c3aff 0%, #5a7cff 100%)',
            color: '#fff', fontWeight: 600, fontSize: 15,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(124,58,255,0.4)',
          }}>
            Enable Alerts →
          </Link>
        </section>

        {/* Live alert chip previews */}
        <section style={{ padding: '0 60px 70px' }}>
          <div style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'rgba(226,234,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6, textAlign: 'center' }}>
              Example alerts
            </p>
            {exampleAlerts.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12,
                background: a.bg, border: `1px solid ${a.border}`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(226,234,252,0.5)', marginTop: 2 }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: '0 60px 80px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#f0ecff', marginBottom: 48, letterSpacing: '-0.5px',
          }}>
            Up and running in seconds
          </h2>
          <div style={{ display: 'flex', gap: 20, maxWidth: 800, margin: '0 auto', justifyContent: 'center' }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                flex: 1, background: 'rgba(20,12,40,0.7)', border: '1px solid rgba(138,60,255,0.15)',
                borderRadius: 18, padding: '32px 24px', textAlign: 'left', position: 'relative',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: '0.08em',
                  textTransform: 'uppercase', marginBottom: 14,
                }}>
                  {s.num}
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#e0d4ff', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(180,160,240,0.6)', lineHeight: 1.6 }}>{s.desc}</div>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 18, color: 'rgba(138,60,255,0.4)', zIndex: 1,
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Alert type grid */}
        <section style={{ padding: '0 60px 100px' }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#f0ecff', marginBottom: 40, letterSpacing: '-0.5px', textAlign: 'center',
          }}>
            Six types of alerts covered
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 900, margin: '0 auto' }}>
            {alertTypes.map(a => (
              <div key={a.title} style={{
                background: a.bg, border: `1px solid ${a.border}`, borderRadius: 16, padding: '22px 20px',
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{a.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: a.color, marginBottom: 8 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(200,190,240,0.55)', lineHeight: 1.6 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <HomeFooter />
      </div>
    </div>
  )
}