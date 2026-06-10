import { useSettings } from '../context/SettingsContext'
import { profileStyles as s } from '../styles/profileStyles'

const OPTIONS = [
  {
    value:   'timeOfDay',
    emoji:   '🕐',
    label:   'Time of Day',
    preview: 'Good morning / afternoon / evening',
  },
  {
    value:   'hey',
    emoji:   '👋',
    label:   'Hey',
    preview: 'Hey, [Your Name]',
  },
  {
    value:   'hi',
    emoji:   '😊',
    label:   'Hi',
    preview: 'Hi, [Your Name]',
  },
  {
    value:   'welcome',
    emoji:   '🏠',
    label:   'Welcome Back',
    preview: 'Welcome back, [Your Name]',
  },
]

export default function GreetingCard() {
  const { settings, updateSetting } = useSettings()
  const current = settings.greetingStyle ?? 'timeOfDay'

  return (
    <div style={s.card}>
      <h3 style={s.sectionTitle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginRight: 8 }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Dashboard Greeting
      </h3>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 14px', lineHeight: 1.6 }}>
        Choose how you're greeted each time you open the dashboard.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {OPTIONS.map(({ value, emoji, label, preview }) => {
          const active = current === value
          return (
            <button
              key={value}
              onClick={() => updateSetting('greetingStyle', value)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '12px', textAlign: 'left', cursor: 'pointer',
                background: active ? 'rgba(90,124,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(90,124,255,0.55)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 10, transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1, marginTop: 1 }}>{emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: active ? '#a78bfa' : '#e2eafc',
                  fontSize: 12, fontWeight: 600, lineHeight: 1.3,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {label}
                  {active && <span style={{ color: '#a78bfa', fontSize: 11 }}>✓</span>}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, marginTop: 3, lineHeight: 1.4 }}>
                  "{preview}"
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
