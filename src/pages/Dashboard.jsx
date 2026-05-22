import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocations } from '../context/LocationsContext'
import { getCurrentWeather, getForecast } from '../services/weather'

import '../styles/dash-base.css'
import '../styles/dash-header.css'
import '../styles/dash-hero.css'
import '../styles/dash-hourly.css'
import '../styles/dash-metrics.css'
import '../styles/dash-forecast.css'
import '../styles/dash-sidebar.css'
import '../styles/dash-sidecards.css'
import '../styles/dash-map.css'
import '../styles/dash-settings.css'

import Settings         from './Settings'
import ManageLocations  from './ManageLocations'
import Sidebar        from '../components/dashboard/Sidebar'
import DashHeader     from '../components/dashboard/DashHeader'
import HeroCard       from '../components/dashboard/HeroCard'
import HourlyForecast from '../components/dashboard/HourlyForecast'
import MetricsGrid    from '../components/dashboard/MetricsGrid'
import WeeklyForecast from '../components/dashboard/WeeklyForecast'
import SideCards      from '../components/dashboard/SideCards'
import FloatingAlert  from '../components/dashboard/FloatingAlert'
import MapView        from '../components/dashboard/map/MapView'

const DEFAULT_LOCATION = { lat: 51.5074, lon: -0.1278, name: 'London' }

export default function Dashboard() {
  const { logout } = useAuth()
  const { homeLocation } = useLocations()
  const navigate   = useNavigate()
  const location   = useLocation()

  const [loc,          setLoc]          = useState(null)
  const [weather,      setWeather]      = useState(null)
  const [forecast,     setForecast]     = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [activePage,   setActivePage]   = useState('Overview')
  const [selectedHour, setSelectedHour] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const page = params.get('page')
    if (page === 'Map')       setActivePage('Map')
    if (page === 'Locations') setActivePage('Locations')
  }, [location.search])

  useEffect(() => {
    if (homeLocation) {
      setLoc({ lat: homeLocation.lat, lon: homeLocation.lon, name: homeLocation.name })
      return
    }
    if (!navigator.geolocation) {
      setLoc(DEFAULT_LOCATION)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude, name: 'Your Location' }),
      () => setLoc(DEFAULT_LOCATION),
      { timeout: 8000 }
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loc) return
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)
        setSelectedHour(null)
        const [currentData, forecastData] = await Promise.all([
          getCurrentWeather(loc.lat, loc.lon),
          getForecast(loc.lat, loc.lon),
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
  }, [loc])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleReset = () => {
    if (!navigator.geolocation) {
      setLoc(DEFAULT_LOCATION)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({
        lat:  pos.coords.latitude,
        lon:  pos.coords.longitude,
        name: 'Your Location',
      }),
      () => setLoc(DEFAULT_LOCATION),
      { timeout: 8000 }
    )
  }

  if (loading) {
    return (
      <div className="dash-root">
        <Sidebar onLogout={handleLogout} forecast={forecast} activePage={activePage} onNav={setActivePage} />
        <div className="dash-main">
          <DashHeader onSearch={setLoc} onReset={handleReset} />
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
        <Sidebar onLogout={handleLogout} forecast={forecast} activePage={activePage} onNav={setActivePage} />
        <div className="dash-main">
          <DashHeader onSearch={setLoc} onReset={handleReset} />
          <div className="dash-content">
            <div style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>
              <p>Could not load weather for "{loc.name}".</p>
              <p style={{ marginTop: 8, fontSize: 13, opacity: 0.6 }}>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-root">
      <Sidebar onLogout={handleLogout} forecast={forecast} activePage={activePage} onNav={setActivePage} />

      <div className="dash-main">
        <DashHeader onSearch={setLoc} onReset={handleReset} />

        <div className="dash-content">
          {activePage === 'Settings' ? (
            <Settings />
          ) : activePage === 'Locations' ? (
            <ManageLocations onSwitch={(loc) => { setLoc(loc); setActivePage('Overview') }} />
          ) : activePage === 'Map' ? (
            <MapView weather={weather} />
          ) : (
            <>
              <HeroCard weather={weather} />
              <HourlyForecast
                forecast={forecast}
                onHourSelect={setSelectedHour}
              />
              <div className="dash-bottom-grid">
                <div className="dash-bottom-left">
                  <MetricsGrid
                    weather={weather}
                    selectedHour={selectedHour}
                  />
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

      <FloatingAlert forecast={forecast} />
    </div>
  )
}