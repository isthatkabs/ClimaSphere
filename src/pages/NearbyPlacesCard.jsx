import { useSettings } from '../context/SettingsContext'
import { profileStyles as s } from '../styles/profileStyles'

function SegPicker({ options, value, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 2,
      background: 'rgba(0,0,0,0.18)', borderRadius: 7, padding: 2, flexShrink: 0,
    }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          background: value === o.value ? 'rgba(90,124,255,0.75)' : 'transparent',
          border: `1px solid ${value === o.value ? 'rgba(90,124,255,0.9)' : 'transparent'}`,
          borderRadius: 5, padding: '4px 10px',
          color: value === o.value ? '#fff' : 'rgba(255,255,255,0.9)',
          fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}>{o.label}</button>
      ))}
    </div>
  )
}

function SmallToggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      width: 38, height: 21, borderRadius: 11, flexShrink: 0, cursor: 'pointer',
      background: on ? 'rgba(90,124,255,0.8)' : 'rgba(255,255,255,0.14)',
      border: `1px solid ${on ? 'rgba(90,124,255,0.9)' : 'rgba(255,255,255,0.2)'}`,
      position: 'relative', transition: 'background 0.2s, border 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 19 : 2,
        width: 15, height: 15, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }} />
    </div>
  )
}

function PrefRow({ icon, label, sub, children, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 0',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 1 }}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}

const RADIUS_OPTIONS = [
  { label: '500 m', value: 500 },
  { label: '1 km',  value: 1000 },
  { label: '2 km',  value: 2000 },
  { label: '5 km',  value: 5000 },
]

export default function NearbyPlacesCard() {
  const { settings, updateSetting } = useSettings()

  return (
    <div style={s.card}>
      <h3 style={s.sectionTitle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginRight: 8 }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Nearby Places
      </h3>

      <PrefRow
        icon="📍"
        label="Place Recommendations"
        sub="Show nearby places as a popup on the home page"
        last={!settings.nearbyPlaces}
      >
        <SmallToggle
          on={settings.nearbyPlaces}
          onToggle={() => updateSetting('nearbyPlaces', !settings.nearbyPlaces)}
        />
      </PrefRow>

      {settings.nearbyPlaces && (
        <PrefRow icon="📏" label="Search Radius" sub="How far to look for places" last>
          <SegPicker
            options={RADIUS_OPTIONS}
            value={settings.placesRadius}
            onChange={v => updateSetting('placesRadius', v)}
          />
        </PrefRow>
      )}
    </div>
  )
}
