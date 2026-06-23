import { buildApiUrl } from './apiConfig'

const AUTH_STORAGE_KEY = '4epupizza_auth'
const AUTH_API_URL = buildApiUrl('/api/Auth')

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)
    if (parsed?.token && parsed?.username) {
      return parsed
    }
  } catch {
    // Ignore invalid persisted auth data.
  }

  return null
}

function setStoredAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

async function parseAuthResponse(response) {
  const text = await response.text()
  let data

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.message || data?.title || text || 'Auth request failed'
    throw new Error(message)
  }

  if (!data?.token) {
    throw new Error('Auth response does not contain a token')
  }

  return {
    id: data.id,
    username: data.username,
    token: data.token,
  }
}

async function requestAuth(path, credentials) {
  const response = await fetch(`${AUTH_API_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  return parseAuthResponse(response)
}

export async function login(credentials) {
  return requestAuth('login', credentials)
}

export async function register(credentials) {
  return requestAuth('register', credentials)
}

export function getAuthHeader() {
  const auth = getStoredAuth()
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}
}

export { clearStoredAuth, getStoredAuth, setStoredAuth }
