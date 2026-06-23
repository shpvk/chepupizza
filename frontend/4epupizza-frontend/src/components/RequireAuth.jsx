import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function RequireAuth({ children }) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default RequireAuth
