import { Routes, Route, Navigate } from 'react-router-dom'
import Home         from './pages/Home'
import Auth         from './pages/Auth'
import Dashboard    from './pages/Dashboard'
import ForecastPage from './pages/ForecastPage'
import MapsPage     from './pages/MapsPage'
import AlertsPage   from './pages/AlertsPage'
import Privacy      from './pages/Privacy'
import Terms        from './pages/Terms'
import Status       from './pages/Status'
import Contact      from './pages/Contact'
import ProfilePage  from './pages/ProfilePage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { LocationsProvider } from './context/LocationsContext'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" />
}

function App() {
  return (
    <SettingsProvider>
    <LocationsProvider>
    <AuthProvider>
      <Routes>
        <Route path="/"         element={<Home />}         />
        <Route path="/auth"     element={<Auth />}         />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/maps"     element={<MapsPage />}     />
        <Route path="/alerts"   element={<AlertsPage />}   />
        <Route path="/privacy"  element={<Privacy />}      />
        <Route path="/terms"    element={<Terms />}        />
        <Route path="/status"   element={<Status />}       />
        <Route path="/contact"  element={<Contact />}      />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
    </LocationsProvider>
    </SettingsProvider>
  )
}

export default App