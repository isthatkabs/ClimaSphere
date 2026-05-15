import { Link } from 'react-router-dom'
import HomeNav    from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'
import { globalStyles } from '../styles/homeStyles'

const root = {
  position: 'relative', minHeight: '100vh',
  fontFamily: "'DM Sans', sans-serif", color: '#e8e0ff', overflowX: 'hidden',
  background: 'linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)',
}
const h2 = { fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#c4b0ff', marginBottom: 10, letterSpacing: '-0.2px' }
const p  = { fontSize: 14, lineHeight: 1.8, color: 'rgba(200,190,240,0.72)', marginBottom: 10 }
const a  = { color: '#a78bfa', textDecoration: 'underline' }

export default function Terms() {
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
            Terms of Service
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(200,190,240,0.4)', marginBottom: 48 }}>
            Last updated: May 2026
          </p>

          {[
            {
              title: 'Acceptance of Terms',
              body: 'By accessing or using ClimaSphere, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.',
            },
            {
              title: 'Description of Service',
              body: 'ClimaSphere provides weather forecasting, mapping, and alerting features. The service is provided free of charge for personal, non-commercial use. We reserve the right to modify or discontinue features at any time.',
            },
            {
              title: 'Accuracy of Weather Data',
              body: 'Weather forecasts are inherently uncertain. ClimaSphere sources data from OpenWeatherMap and Open-Meteo and presents it in good faith, but we make no guarantees regarding accuracy. Do not rely solely on ClimaSphere for safety-critical decisions.',
            },
            {
              title: 'Your Account',
              body: 'You are responsible for keeping your account credentials secure. You must notify us immediately if you suspect unauthorised access. ClimaSphere is not liable for losses resulting from unauthorised use of your account.',
            },
            {
              title: 'Acceptable Use',
              body: 'You agree not to use ClimaSphere to scrape data at scale, attempt to reverse-engineer the service, or use it in any way that violates applicable laws. Automated requests that place unreasonable load on our infrastructure are prohibited.',
            },
            {
              title: 'Limitation of Liability',
              body: 'To the fullest extent permitted by law, ClimaSphere and its creators are not liable for any indirect, incidental, or consequential damages arising from your use of the service, including losses resulting from weather-related decisions made based on our data.',
            },
            {
              title: 'Governing Law',
              body: 'These terms are governed by the laws of the Netherlands. Any disputes shall be subject to the exclusive jurisdiction of the courts of Rotterdam.',
            },
            {
              title: 'Changes to These Terms',
              body: 'We may revise these terms at any time. Continued use of ClimaSphere after changes constitutes acceptance of the new terms.',
            },
          ].map(({ title, body }) => (
            <div key={title} style={{ marginBottom: 34 }}>
              <h2 style={h2}>{title}</h2>
              <p style={p}>{body}</p>
            </div>
          ))}

          <p style={p}>Questions? <Link to="/contact" style={a}>Contact us</Link>.</p>
        </section>

        <HomeFooter />
      </div>
    </div>
  )
}