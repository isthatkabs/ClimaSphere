import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NAV } from '../data/dashData'

export default function Sidebar({ onLogout }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="dash-sidebar">
      <div className="dash-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="dash-logo-icon">🌐</div>
        <div className="dash-logo-text">
          Clima<strong>Sphere</strong>
        </div>
      </div>

      <nav className="dash-nav">
        {NAV.map(({ icon, label, active }) => (
          <button
            key={label}
            className={`dash-nav-item${active ? ' active' : ''}`}
          >
            <span className="dash-nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="dash-sidebar-divider" />

      <div className="dash-sidebar-bottom">
        <div className="dash-alert-chip">
          <div className="dash-alert-dot" />
          <div className="dash-alert-text">
            <div className="dash-alert-title">Rain alert tonight</div>
            <div className="dash-alert-sub">Heavy rain from 6 PM</div>
          </div>
        </div>

        {user ? (
          <button className="dash-logout-btn" onClick={onLogout}>
            <span>🚪</span> Sign out
          </button>
        ) : (
          <button className="dash-logout-btn" onClick={() => navigate('/auth')}>
            <span>🔑</span> Login
          </button>
        )}
      </div>
    </aside>
  )
}