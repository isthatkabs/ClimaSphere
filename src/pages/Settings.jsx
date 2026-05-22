import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import '../styles/dash-settings.css'

function Toggle({ on, onToggle }) {
  return (
    <button
      className={`cs-toggle${on ? ' on' : ''}`}
      onClick={onToggle}
      aria-pressed={on}
    >
      <span className="cs-toggle-thumb" />
    </button>
  )
}

function SegmentPicker({ options, value, onChange }) {
  return (
    <div className="cs-segment">
      {options.map(o => (
        <button
          key={o}
          className={`cs-segment-btn${value === o ? ' active' : ''}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function Row({ icon, label, sub, children, onClick, showChevron }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`cs-row${onClick ? ' clickable' : ''}`} onClick={onClick}>
      <span className="cs-row-icon">{icon}</span>
      <div className="cs-row-text">
        <span className="cs-row-label">{label}</span>
        {sub && <span className="cs-row-sub">{sub}</span>}
      </div>
      <div className="cs-row-action">
        {children}
        {showChevron && <span className="cs-chevron">›</span>}
      </div>
    </Tag>
  )
}

function Section({ title, children }) {
  return (
    <div className="cs-section">
      <div className="cs-section-title">{title}</div>
      <div className="cs-card">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { settings, updateSetting } = useSettings()
  const navigate = useNavigate()

  return (
    <div className="cs-settings">
      <div className="cs-settings-header">
        <h2 className="cs-settings-title">Settings</h2>
        <p className="cs-settings-sub">Manage your preferences</p>
      </div>

      <Section title="GENERAL">
        <Row icon="🏠" label="Home" sub="Return to landing page" onClick={() => navigate('/')} showChevron />
        <Row icon="📍" label="Manage Locations" sub="Add or remove saved cities" onClick={() => {}} showChevron />
        <Row icon="🔔" label="Notifications" sub="Weather alerts and updates">
          <Toggle
            on={settings.notifications}
            onToggle={() => updateSetting('notifications', !settings.notifications)}
          />
        </Row>
        <Row icon="🗺" label="Weather Radar" sub="Live precipitation radar" onClick={() => navigate('/dashboard?page=Map')} showChevron />
      </Section>

      <Section title="UNITS">
        <Row icon="🌡" label="Temperature" sub="Display scale for temperature">
          <SegmentPicker
            options={['°C', '°F']}
            value={settings.tempUnit === 'C' ? '°C' : '°F'}
            onChange={v => updateSetting('tempUnit', v === '°C' ? 'C' : 'F')}
          />
        </Row>
        <Row icon="💨" label="Wind Speed" sub="km/h or mph">
          <SegmentPicker
            options={['km/h', 'mph']}
            value={settings.distanceUnit === 'km' ? 'km/h' : 'mph'}
            onChange={v => updateSetting('distanceUnit', v === 'km/h' ? 'km' : 'mi')}
          />
        </Row>
        <Row icon="🕐" label="Time Format" sub="12-hour or 24-hour clock">
          <SegmentPicker
            options={['12h', '24h']}
            value={settings.timeFormat === '12' ? '12h' : '24h'}
            onChange={v => updateSetting('timeFormat', v === '12h' ? '12' : '24')}
          />
        </Row>
      </Section>

      <Section title="ABOUT">
        <Row icon="💬" label="Send Feedback" sub="Report a bug or suggest a feature" onClick={() => navigate('/contact')} showChevron />
        <Row icon="🔒" label="Privacy Policy" onClick={() => navigate('/privacy')} showChevron />
        <Row icon="📄" label="Terms of Service" onClick={() => navigate('/terms')} showChevron />
        <Row icon="ℹ️" label="Version" sub="ClimaSphere 1.0.0">
          <span className="cs-badge">Latest</span>
        </Row>
      </Section>
    </div>
  )
}
