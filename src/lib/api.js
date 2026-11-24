// Talks to the Sevamein API on the Hire Arrive backend (habackend/sevamein).
// Set VITE_SERVER in .env (e.g. http://localhost:5000) to point at a local backend.
const SERVER = (import.meta.env.VITE_SERVER || 'https://api.hirearrive.in').replace(/\/$/, '')
export const API_BASE = `${SERVER}/api/sevamein`

const TOKEN_KEY = 'sevamein_token'
const REF_KEY = 'sevamein_ref'
export const LOGOUT_EVENT = 'sevamein:logout'

// Storage can throw (private mode, blocked site data), so every access is guarded.
function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function write(key, value) {
  try {
    if (value) localStorage.setItem(key, value)
    else localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export const getToken = () => read(TOKEN_KEY)
export const setToken = (token) => write(TOKEN_KEY, token)
export const getReferral = () => read(REF_KEY)
export const setReferral = (code) => write(REF_KEY, code)

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// Admin session is separate from the user session (own token, own logout event).
const ADMIN_TOKEN_KEY = 'sevamein_admin_token'
export const ADMIN_LOGOUT_EVENT = 'sevamein:admin-logout'
export const getAdminToken = () => read(ADMIN_TOKEN_KEY)
export const setAdminToken = (token) => write(ADMIN_TOKEN_KEY, token)

const USER_SESSION = { get: getToken, set: setToken, event: LOGOUT_EVENT }
const ADMIN_SESSION = { get: getAdminToken, set: setAdminToken, event: ADMIN_LOGOUT_EVENT }

// Signed-in user requests.
export function api(path, options) {
  return request(path, options, USER_SESSION)
}

// Admin dashboard requests (token from /admin/login).
export function adminApi(path, options) {
  return request(path, options, ADMIN_SESSION)
}

async function request(path, { method = 'GET', body } = {}, session) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = session.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach Seva Mein servers. Check your connection and try again.', 0)
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    // A stored token that the server rejects means the session is over.
    if (res.status === 401 && token) {
      session.set(null)
      window.dispatchEvent(new Event(session.event))
    }
    throw new ApiError(data.message || `Request failed (${res.status})`, res.status)
  }
  return data
}

// Best-effort GPS fix; resolves null if unavailable, denied or slow.
export function getCoords(timeoutMs = 6000) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracyM: pos.coords.accuracy }),
      () => resolve(null),
      { timeout: timeoutMs, maximumAge: 60000 },
    )
  })
}
