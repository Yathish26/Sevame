import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppContext } from './app-context.js'
import { api, getReferral, getToken, LOGOUT_EVENT, setReferral, setToken } from '../lib/api.js'
import { SITE_FALLBACK } from '../data/siteFallback.js'

const EMPTY_MINE = { posted: [], helping: [] }

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(() => !getToken())
  const [jobs, setJobs] = useState([])
  const [jobsStatus, setJobsStatus] = useState('loading') // loading | ready | error
  const [myTasks, setMyTasks] = useState(EMPTY_MINE)
  const [tickets, setTickets] = useState([])
  const [activeModal, setActiveModal] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [toasts, setToasts] = useState([])
  const [site, setSite] = useState(SITE_FALLBACK) // domain, grievance officer, emergency number… (Admin → Panel)
  const toastSeq = useRef(0)

  const showToast = useCallback((message, type = 'success') => {
    toastSeq.current += 1
    const id = toastSeq.current
    setToasts((list) => [...list, { id, message, type, leaving: false }])
    setTimeout(() => {
      setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    }, 3600)
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id))
    }, 3900)
  }, [])

  const openModal = useCallback((name) => setActiveModal(name), [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  // ---------- Loading ----------

  const refreshJobs = useCallback(async () => {
    try {
      const data = await api('/tasks?limit=100')
      setJobs(data.tasks)
      setJobsStatus('ready')
    } catch {
      setJobsStatus('error')
    }
  }, [])

  const refreshMine = useCallback(async () => {
    try {
      const [mine, t] = await Promise.all([api('/tasks/mine'), api('/tickets')])
      setMyTasks(mine)
      setTickets(t.tickets)
    } catch {
      /* 401 is handled by the logout event; other errors keep the old lists */
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const data = await api('/auth/me')
    setUser(data.user)
    return data.user
  }, [])

  const refreshSite = useCallback(async () => {
    try {
      const data = await api('/settings')
      setSite({ ...SITE_FALLBACK, ...data.settings })
    } catch {
      /* keep the fallback values */
    }
  }, [])

  useEffect(() => {
    refreshJobs()
    refreshSite()
  }, [refreshJobs, refreshSite])

  // Restore the session from a stored token.
  useEffect(() => {
    if (!getToken()) return
    refreshUser()
      .catch(() => setToken(null))
      .finally(() => setAuthReady(true))
  }, [refreshUser])

  // Reload my tasks/tickets only when the signed-in account changes, not on every profile update.
  const userId = user?.id
  useEffect(() => {
    if (userId) refreshMine()
  }, [userId, refreshMine])

  // ---------- Auth ----------

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    setMyTasks(EMPTY_MINE)
    setTickets([])
  }, [])

  useEffect(() => {
    const onLogout = () => {
      clearSession()
      showToast('Your session expired. Please sign in again.', 'warn')
    }
    window.addEventListener(LOGOUT_EVENT, onLogout)
    return () => window.removeEventListener(LOGOUT_EVENT, onLogout)
  }, [clearSession, showToast])

  const startSession = useCallback((data) => {
    setToken(data.token)
    setUser(data.user)
  }, [])

  const login = useCallback(
    async (loginId, password) => {
      startSession(await api('/auth/login', { method: 'POST', body: { login: loginId, password } }))
    },
    [startSession],
  )

  const register = useCallback(
    async (fields) => {
      const data = await api('/auth/register', { method: 'POST', body: { ...fields, ref: getReferral() || undefined } })
      setReferral(null)
      startSession(data)
    },
    [startSession],
  )

  const logout = useCallback(() => {
    clearSession()
    showToast('Signed out.', 'success')
  }, [clearSession, showToast])

  // Returns true when signed in; otherwise opens the sign-in modal.
  const requireLogin = useCallback(
    (reason = 'Please sign in to continue.') => {
      if (user) return true
      showToast(reason, 'warn')
      setActiveModal('auth')
      return false
    },
    [user, showToast],
  )

  const updateProfile = useCallback(async (fields) => {
    const data = await api('/auth/me', { method: 'PUT', body: fields })
    setUser(data.user)
  }, [])

  const verifyKyc = useCallback(async () => {
    const data = await api('/auth/me/kyc/simulate', { method: 'POST' })
    setUser(data.user)
    return data.user
  }, [])

  // ---------- Tasks ----------

  const replaceMine = (key, task) =>
    setMyTasks((m) => ({ ...m, [key]: m[key].some((t) => t.id === task.id) ? m[key].map((t) => (t.id === task.id ? task : t)) : [task, ...m[key]] }))

  const openAcceptModal = useCallback((job) => {
    setSelectedJob(job)
    setActiveModal('acceptTask')
  }, [])

  const postTask = useCallback(async (fields) => {
    const data = await api('/tasks', { method: 'POST', body: fields })
    setJobs((list) => [data.task, ...list])
    replaceMine('posted', data.task)
    return data.task
  }, [])

  const acceptTask = useCallback(async (code, coords) => {
    const data = await api(`/tasks/${encodeURIComponent(code)}/accept`, { method: 'POST', body: { consent: true, ...coords } })
    setJobs((list) => list.filter((j) => j.id !== code))
    replaceMine('helping', data.task)
    return data
  }, [])

  const completeTask = useCallback(async (code, otp) => {
    const data = await api(`/tasks/${encodeURIComponent(code)}/complete`, { method: 'POST', body: { otp } })
    replaceMine('helping', data.task)
    setUser(data.user)
    return data
  }, [])

  const rateTask = useCallback(async (code, rating) => {
    const data = await api(`/tasks/${encodeURIComponent(code)}/rate`, { method: 'POST', body: { rating } })
    replaceMine('posted', data.task)
    return data
  }, [])

  const cancelTask = useCallback(async (code) => {
    const data = await api(`/tasks/${encodeURIComponent(code)}`, { method: 'DELETE' })
    setJobs((list) => list.filter((j) => j.id !== code))
    replaceMine('posted', data.task)
  }, [])

  // ---------- Support ----------

  const addTicket = useCallback(async (title, summary, reference) => {
    const data = await api('/tickets', { method: 'POST', body: { title, summary, reference } })
    setTickets((list) => [data.ticket, ...list])
  }, [])

  const logSos = useCallback((coords) => api('/sos', { method: 'POST', body: coords || {} }), [])

  const value = useMemo(
    () => ({
      site,
      setSite,
      refreshSite,
      user,
      authReady,
      jobs,
      jobsStatus,
      myTasks,
      tickets,
      toasts,
      activeModal,
      selectedJob,
      showToast,
      openModal,
      closeModal,
      openAcceptModal,
      refreshJobs,
      refreshMine,
      refreshUser,
      login,
      register,
      logout,
      requireLogin,
      updateProfile,
      verifyKyc,
      postTask,
      acceptTask,
      completeTask,
      rateTask,
      cancelTask,
      addTicket,
      logSos,
    }),
    [
      site, refreshSite,
      user, authReady, jobs, jobsStatus, myTasks, tickets, toasts, activeModal, selectedJob,
      showToast, openModal, closeModal, openAcceptModal, refreshJobs, refreshMine, refreshUser,
      login, register, logout, requireLogin, updateProfile, verifyKyc,
      postTask, acceptTask, completeTask, rateTask, cancelTask, addTicket, logSos,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
