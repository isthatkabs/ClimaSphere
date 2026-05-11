import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCurrentWeather, getForecast } from '../services/weather'

// ✅ Import from the actual styles folder (was: './Dashboard.css' which doesn't exist)
import '../styles/dash-base.css'
import '../styles/dash-header.css'
import '../styles/dash-hero.css'
import '../styles/dash-hourly.css'
import '../styles/dash-metrics.css'
import '../styles/dash-forecast.css'
import '../styles/dash-sidebar.css'
import '../styles/dash-sidecards.css'

import Sidebar from '../components/dashboard/Sidebar'
import DashHeader from '../components/dashboard/DashHeader'
import HeroCard from '../components/dashboard/HeroCard'
import HourlyForecast from '../components/dashboard/HourlyForecast'
import MetricsGrid from '../components/dashboard/MetricsGrid'
import WeeklyForecast from '../components/dashboard/WeeklyForecast'
import SideCards from '../components/dashboard/SideCards'


export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [city, setCity] = useState('London')

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch current weather and forecast
        const [currentData, forecastData] = await Promise.all([
          getCurrentWeather(city),
          getForecast(city),
        ])

        setWeather(currentData)
        setForecast(forecastData)
      } catch (err) {
        setError(err.message || 'Failed to fetch weather')
        console.error('Weather fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [city])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSearch = (newCity) => {
    setCity(newCity)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="dash-root">
        <Sidebar handleLogout={handleLogout} />
        <div className="dash-main">
          <DashHeader city={city} onSearch={handleSearch} />
          <div className="dash-content">
            <div style={{ padding: '40px', textAlign: 'center', color: '#e2eafc' }}>
              Loading weather data...
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="dash-root">
        <Sidebar handleLogout={handleLogout} />
        <div className="dash-main">
          <DashHeader city={city} onSearch={handleSearch} />
          <div className="dash-content">
            <div style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>
              <p>Error: {error}</p>
              <p>Please try another city or refresh the page.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-root">
      <Sidebar handleLogout={handleLogout} />

      <div className="dash-main">
        <DashHeader city={city} onSearch={handleSearch} />

        <div className="dash-content">
          {weather && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}