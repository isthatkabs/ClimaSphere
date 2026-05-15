import { Link } from 'react-router-dom'
import HomeNav    from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'
import { globalStyles } from '../styles/homeStyles'

const root = {
  position: 'relative', minHeight: '100vh',
  fontFamily: "'DM Sans', sans-serif", color: '#e8e0ff', overflowX: 'hidden',
  background: 'linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)',
}

const section = {
  marginBottom: 36,
}

const h2 = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 20, color: '#c4b0ff',
  marginBottom: 10, letterSpacing: '-0.2px',
}

const p = {
  fontSize: 14, lineHeight: 1.8,
  color: 'rgba(200,190,240,0.72)',
  marginBottom: 10,
}

const a = {
  color: '#a78bfa', textDecoration: 'underline',
}

export default function Privacy() {
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

        <section style={{ maxWidth: 740, margin: '0 auto', padding: '70px 40px 100px' }}>
          <Link to="/" style={{ fontSize: 13, color: '#a78bfa', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
            ← Back
          </Link>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(32px, 4vw, 52px)', color: '#f0ecff',
            letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 10,
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(200,190,240,0.4)', marginBottom: 48 }}>
            Last updated: May 2026
          </p>

          <div style={section}>
            <h2 style={h2}>Information We Collect</h2>
            <p style={p}>When you create an account, we collect your email address and a hashed password via Firebase Authentication. Plaintext passwords are never stored.</p>
            <p style={p}>We may also request your approximate location to deliver localised weather data. Location is used only to fulfil your weather requests and is not stored permanently.</p>
          </div>

          <div style={section}>
            <h2 style={h2}>How We Use Your Information</h2>
            <p style={p}>Your data is used solely to operate ClimaSphere — to authenticate you, personalise your weather experience, and respond to any support requests you send us. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </div>

          <div style={section}>
            <h2 style={h2}>Firebase & Third Parties</h2>
            <p style={p}>ClimaSphere uses Google Firebase for authentication and data storage. Your data is subject to <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noreferrer" style={a}>Google's Privacy Policy</a>. We use Firebase Analytics to understand aggregate usage patterns — this data is anonymised and cannot identify you personally.</p>
            <p style={p}>Weather data is fetched from OpenWeatherMap and Open-Meteo. These services receive only the coordinates needed to return forecast data; no personal account details are shared with them.</p>
          </div>

          <div style={section}>
            <h2 style={h2}>Data Retention</h2>
            <p style={p}>Your account data is retained for as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us through the <Link to="/contact" style={a}>Contact</Link> page.</p>
          </div>

          <div style={section}>
            <h2 style={h2}>Your Rights (GDPR)</h2>
            <p style={p}>If you are based in the EU or EEA, you have the right to access, correct, or erase your personal data, the right to data portability, and the right to object to processing. To exercise any of these rights, please use our <Link to="/contact" style={a}>Contact</Link> page.</p>
          </div>

          <div style={section}>
            <h2 style={h2}>Changes to This Policy</h2>
            <p style={p}>We may update this policy from time to time. We will notify you of significant changes via email or a notice within the app.</p>
          </div>

          <div style={section}>
            <h2 style={h2}>Questions?</h2>
            <p style={p}><Link to="/contact" style={a}>Get in touch</Link> and we'll be happy to help.</p>
          </div>
        </section>

        <HomeFooter />
      </div>
    </div>
  )
}