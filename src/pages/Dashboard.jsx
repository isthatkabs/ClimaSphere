import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import '../styles/dash-base.css'
import '../styles/dash-sidebar.css'
import '../styles/dash-header.css'
import '../styles/dash-hero.css'
import '../styles/dash-hourly.css'
import '../styles/dash-metrics.css'
import '../styles/dash-forecast.css'
import '../styles/dash-sidecards.css'

import Sidebar        from '../components/dashboard/Sidebar'
import DashHeader     from '../components/dashboard/DashHeader'
import HeroCard       from '../components/dashboard/HeroCard'
import HourlyForecast from '../components/dashboard/HourlyForecast'
import MetricsGrid    from '../components/dashboard/MetricsGrid'
import WeeklyForecast from '../components/dashboard/WeeklyForecast'
import SideCards      from '../components/dashboard/SideCards'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <div className="dash-root">

      <Sidebar onLogout={handleLogout} />

      <div className="dash-main">
        <DashHeader />

        <div className="dash-content">
          <HeroCard />
          <HourlyForecast />

          <div className="dash-bottom-grid">
            <div className="dash-bottom-left">
              <MetricsGrid />
              <WeeklyForecast />
            </div>
            <SideCards />
          </div>
        </div>

      </div>
    </div>
  )
}