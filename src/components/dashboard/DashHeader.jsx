import { useAuth } from '../../context/AuthContext'
import { getInitials, getNow, getGreeting } from '../../data/dashData'

export default function DashHeader() {
  const { user } = useAuth()

  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <div className="dash-greeting">
          {user ? getGreeting(user) : 'Welcome to ClimaSphere 🌐'}
        </div>
        <div className="dash-date">{getNow()}</div>
      </div>

      <div className="dash-search-wrap">
        <span className="dash-search-icon">🔍</span>
        <input className="dash-search" placeholder="Search a city…" />
      </div>

      <div className="dash-header-right">
        <button className="dash-icon-btn" title="Notifications">🔔</button>
        <button
          className="dash-icon-btn"
          title="Refresh"
          onClick={() => window.location.reload()}
        >
          🔄
        </button>
        <div className="dash-avatar" title={user?.email}>
          {getInitials(user?.email)}
        </div>
      </div>
    </header>
  )
}