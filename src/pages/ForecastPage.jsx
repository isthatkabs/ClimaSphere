import { Link } from 'react-router-dom'
import HomeNav    from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'
import { globalStyles } from '../styles/homeStyles'

const hours = [
  { time: 'Now',   icon: '⛅', temp: 18, precip: 10 },
  { time: '2 PM',  icon: '🌤', temp: 20, precip: 5  },
  { time: '3 PM',  icon: '☀️', temp: 22, precip: 0  },
  { time: '4 PM',  icon: '☀️', temp: 21, precip: 0  },
  { time: '5 PM',  icon: '🌤', temp: 19, precip: 8  },
  { time: '6 PM',  icon: '🌦', temp: 17, precip: 45 },
  { time: '7 PM',  icon: '🌧', temp: 15, precip: 70 },
]

const days = [
  { day: 'Today', icon: '⛅', cond: 'Partly cloudy', hi: 22, lo: 13, precip: '10%' },
  { day: 'Tue',   icon: '🌧', cond: 'Heavy rain',    hi: 16, lo: 11, precip: '85%' },
  { day: 'Wed',   icon: '🌦', cond: 'Showers',       hi: 17, lo: 10, precip: '60%' },
  { day: 'Thu',   icon: '☁️', cond: 'Overcast',      hi: 14, lo: 9,  precip: '20%' },
  { day: 'Fri',   icon: '🌤', cond: 'Mostly sunny',  hi: 19, lo: 10, precip: '5%'  },
]

const features = [
  { icon: '⏱', title: 'Hourly Breakdown',   desc: 'Temperature, precipitation chance, and wind speed for every hour of the day.' },
  { icon: '📅', title: '5-Day Forecast',     desc: 'Plan your week with high/low temps, conditions, and rain probability each day.' },
  { icon: '🎯', title: '95% Accuracy',       desc: 'Powered by OpenWeatherMap and Open-Meteo for the most reliable predictions.' },
  { icon: '🌍', title: '200,000+ Cities',    desc: 'Search any city worldwide and get a full local forecast instantly.' },
  { icon: '💨', title: 'Wind & Pressure',    desc: 'Full atmospheric data including wind direction, gusts, and barometric pressure.' },
  { icon: '🔄', title: '10-Min Refresh',     desc: 'Forecast data updates every 10 minutes so you always have the latest picture.' },
]

const root = {
  position: 'relative', minHeight: '100vh',
  fontFamily: "'DM Sans', sans-serif",
  color: '#e8e0ff', overflowX: 'hidden',
  background: 'linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)',
}

export default function ForecastPage() {
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
            background: 'rgba(138,60,255,0.15)', border: '1px solid rgba(138,60,255,0.3)',
            borderRadius: 100, padding: '6px 14px',
            fontSize: 12, fontWeight: 500, color: '#b090ff',
            marginBottom: 24, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aff', display: 'inline-block' }} />
            Live forecast data
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1,
            color: '#f0ecff', marginBottom: 20, letterSpacing: '-1px',
          }}>
            Precision Forecasting,<br />
            <span style={{
              background: 'linear-gradient(135deg, #a06bff 0%, #6fa8ff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic',
            }}>Up to 5 Days Ahead</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(200,190,240,0.7)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Hourly breakdowns, daily summaries, and real-time atmospheric data — all in one place.
          </p>
          <Link to="/auth" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #7c3aff 0%, #5a7cff 100%)',
            color: '#fff', fontWeight: 600, fontSize: 15,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(124,58,255,0.4)',
          }}>
            View Your Forecast →
          </Link>
        </section>

        {/* Hourly preview */}
        <section style={{ padding: '0 60px 60px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '28px 32px', maxWidth: 900, margin: '0 auto',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(226,234,252,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
              Hourly forecast
            </p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {hours.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '14px 18px',
                  background: i === 0 ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${i === 0 ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, minWidth: 72, flexShrink: 0,
                }}>
                  <span style={{ fontSize: 10, color: 'rgba(226,234,252,0.4)', textTransform: 'uppercase' }}>{h.time}</span>
                  <span style={{ fontSize: 22 }}>{h.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{h.temp}°</span>
                  <span style={{ fontSize: 11, color: '#38bdf8' }}>💧{h.precip}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5-day preview */}
        <section style={{ padding: '0 60px 80px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <p style={{ fontSize: 12, color: 'rgba(226,234,252,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
              5-day forecast
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {days.map((d, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px 20px',
                  background: i === 0 ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${i === 0 ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 12,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 500, width: 44 }}>{d.day}</span>
                  <span style={{ fontSize: 20 }}>{d.icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(226,234,252,0.5)', flex: 1 }}>{d.cond}</span>
                  <span style={{ fontSize: 12, color: '#38bdf8' }}>💧 {d.precip}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{d.hi}°</span>
                  <span style={{ fontSize: 14, color: 'rgba(226,234,252,0.4)' }}>{d.lo}°</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section style={{ padding: '0 60px 100px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 42px)',
            color: '#f0ecff', marginBottom: 48, letterSpacing: '-0.5px',
          }}>
            Everything you need to know about tomorrow
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto' }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: 'rgba(20,12,40,0.7)', border: '1px solid rgba(138,60,255,0.15)',
                borderRadius: 18, padding: '28px 24px', textAlign: 'left',
              }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#e0d4ff', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(180,160,240,0.6)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <HomeFooter />
      </div>
    </div>
  )
}