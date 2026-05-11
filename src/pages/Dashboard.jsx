import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCurrentWeather, getForecast } from '../services/weather'

import '../styles/dash-base.css'
import '../styles/dash-header.css'
import '../styles/dash-hero.css'
import '../styles/dash-hourly.css'
import '../styles/dash-metrics.css'
import '../styles/dash-forecast.css'
import '../styles/dash-sidebar.css'
import '../styles/dash-sidecards.css'

import Sidebar        from '../components/dashboard/Sidebar'
import DashHeader     from '../components/dashboard/DashHeader'
import HeroCard       from '../components/dashboard/HeroCard'
import HourlyForecast from '../components/dashboard/HourlyForecast'
import MetricsGrid    from '../components/dashboard/MetricsGrid'
import WeeklyForecast from '../components/dashboard/WeeklyForecast'
import SideCards      from '../components/dashboard/SideCards'

const DEFAULT_LOCATION = { lat: 51.5074, lon: -0.1278, name: 'London' }

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [weather,  setWeather]  = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)
        const [currentData, forecastData] = await Promise.all([
          getCurrentWeather(location.lat, location.lon),
          getForecast(location.lat, location.lon),
        ])
        setWeather(currentData)
        setForecast(forecastData)
      } catch (err) {
        setError(err.message || 'Failed to fetch weather')
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [location])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="dash-root">
        <Sidebar onLogout={handleLogout} />
        <div className="dash-main">
          <DashHeader onSearch={setLocation} onReset={() => setLocation(DEFAULT_LOCATION)} />
          <div className="dash-content">
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading weather data…
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dash-root">
        <Sidebar onLogout={handleLogout} />
        <div className="dash-main">
          <DashHeader onSearch={setLocation} onReset={() => setLocation(DEFAULT_LOCATION)} />
          <div className="dash-content">
            <div style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>
              <p>Could not load weather for "{location.name}".</p>
              <p style={{ marginTop: 8, fontSize: 13, opacity: 0.6 }}>
                Check the city name and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-root">
      <Sidebar onLogout={handleLogout} />

      <div className="dash-main">
        <DashHeader onSearch={setLocation} onReset={() => setLocation(DEFAULT_LOCATION)} />

        <div className="dash-content">
          <HeroCard weather={weather} />
          <HourlyForecast forecast={forecast} />
          <div className="dash-bottom-grid">
            <div className="dash-bottom-left">
              <MetricsGrid weather={weather} />
              <WeeklyForecast forecast={forecast} />
            </div>
            <div className="dash-bottom-right">
              <SideCards weather={weather} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}