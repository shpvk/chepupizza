import { useMemo, useState } from 'react'
import {
  clearStoredAuth,
  getStoredAuth,
  login as loginRequest,
  register as registerRequest,
  setStoredAuth,
} from '../services/authApi'
import { AuthContext } from './authStore'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuth())

  async function login(credentials) {
    const auth = await loginRequest(credentials)
    setStoredAuth(auth)
    setUser(auth)
    return auth
  }

  async function register(credentials) {
    const auth = await registerRequest(credentials)
    setStoredAuth(auth)
    setUser(auth)
    return auth
  }

  function logout() {
    clearStoredAuth()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      token: user?.token || '',
      login,
      register,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
