import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProfileStep1 from './pages/ProfileStep1'
import ProfileStep2 from './pages/ProfileStep2'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route
            path="/"
            element={<Layout />}
          >
            <Route index element={<Home />} />
            <Route path="profile/step1" element={<ProfileStep1 />} />
            <Route path="profile/step2" element={<ProfileStep2 />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
