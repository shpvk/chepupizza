const USE_LOCAL_API = true
const LOCAL_API_BASE_URL = 'https://localhost:7067'
const DEPLOYED_API_BASE_URL = 'https://fourepupizza.onrender.com'
const DEFAULT_API_BASE_URL = USE_LOCAL_API ? LOCAL_API_BASE_URL : DEPLOYED_API_BASE_URL

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL

export function buildApiUrl(path) {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBaseUrl}${normalizedPath}`
}
