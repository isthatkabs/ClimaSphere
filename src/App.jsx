// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'

// Protects /dashboard from logged-out users
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Auth />} />
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