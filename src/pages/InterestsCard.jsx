import { useSettings } from '../context/SettingsContext'
import { profileStyles as s } from '../styles/profileStyles'

const INTERESTS = [
  { id: 'Outdoors & Nature',      emoji: '🌿', sub: 'Hiking, parks, nature walks' },
  { id: 'Food & Drink',           emoji: '🍽️', sub: 'Cafés, restaurants, bars' },
  { id: 'Arts & Culture',         emoji: '🏛️', sub: 'Museums, galleries, theatre' },
  { id: 'Sports & Fitness',       emoji: '🏋️', sub: 'Gym, swimming, cycling' },
  { id: 'Cinema & Entertainment', emoji: '🎬', sub: 'Movies, shows, board games' },
  { id: 'Photography',            emoji: '📸', sub: 'Scenic spots, sunset walks' },
  { id: 'Books & Reading',        emoji: '📚', sub: 'Libraries, podcasts, reading' },
  { id: 'Shopping',               emoji: '🛍️', sub: 'Malls, markets, shops' },
]

export default function InterestsCard() {
  const { settings, updateSetting } = useSettings()
  const interests = settings.interests ?? []

  function toggle(id) {
    const next = interests.includes(id)
      ? interests.filter(i => i !== id)
      : [...interests, id]
    updateSetting('interests', next)
  }

  return (
    <div style={s.card}>
      <h3 style={s.sectionTitle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginRight: 8 }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        My Interests
      </h3>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 14px', lineHeight: 1.6 }}>
        Select what you enjoy — your activity suggestions, clothing tips, and nearby place recommendations will be personalised accordingly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {INTERESTS.map(({ id, emoji, sub }) => {
          const active = interests.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                background: active ? 'rgba(90,124,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(90,124,255,0.55)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 10, transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: active ? '#a78bfa' : '#e2eafc', fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{id}</div>
                <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, marginTop: 2 }}>{sub}</div>
              </div>
              {active && (
                <span style={{ color: '#a78bfa', fontSize: 13, flexShrink: 0, marginLeft: 2 }}>✓</span>
              )}
            </button>
          )
        })}
      </div>

      {interests.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 12, textAlign: 'center' }}>
          No interests selected — tap any to personalise your experience
        </p>
      )}

      {interests.length > 0 && (
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 12, textAlign: 'center' }}>
          {interests.length} interest{interests.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}
