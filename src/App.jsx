import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import ForecastPage from './pages/ForecastPage'
import MapsPage from './pages/MapsPage'
import AlertsPage from './pages/AlertsPage'
import ApiPage from './pages/ApiPage'
import { AuthProvider, useAuth } from './context/AuthContext'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"          element={<Home />}         />
        <Route path="/auth"      element={<Auth />}         />
        <Route path="/forecast"  element={<ForecastPage />} />
        <Route path="/maps"      element={<MapsPage />}     />
        <Route path="/alerts"    element={<AlertsPage />}   />
        <Route path="/api"       element={<ApiPage />}      />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App