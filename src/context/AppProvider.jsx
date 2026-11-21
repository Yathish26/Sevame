import { useCallback, useMemo, useRef, useState } from 'react'
import { AppContext } from './app-context.js'
import { demoUser, initialJobs, initialTickets } from '../data/demo.js'

export function AppProvider({ children }) {
  const [user, setUser] = useState(demoUser)
  const [jobs, setJobs] = useState(initialJobs)
  const [tickets, setTickets] = useState(initialTickets)
  const [activeModal, setActiveModal] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [toasts, setToasts] = useState([])
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

  const openAcceptModal = useCallback((job) => {
    setSelectedJob(job)
    setActiveModal('acceptTask')
  }, [])

  const earnPoints = useCallback(() => {
    setUser((u) => ({
      ...u,
      totalPoints: u.totalPoints + 15,
      trustScore: Math.min(30, u.trustScore + 1),
    }))
  }, [])

  const addJob = useCallback((job) => setJobs((list) => [job, ...list]), [])

  const addTicket = useCallback((title, summary) => {
    const id = '#TKT-' + Math.floor(3000 + Math.random() * 6999)
    setTickets((list) => [{ id, title, summary, status: 'Open' }, ...list])
  }, [])

  const verifyKyc = useCallback(() => setUser((u) => ({ ...u, kycVerified: true })), [])

  const value = useMemo(
    () => ({
      user,
      jobs,
      tickets,
      toasts,
      activeModal,
      selectedJob,
      showToast,
      openModal,
      closeModal,
      openAcceptModal,
      earnPoints,
      addJob,
      addTicket,
      verifyKyc,
    }),
    [user, jobs, tickets, toasts, activeModal, selectedJob, showToast, openModal, closeModal, openAcceptModal, earnPoints, addJob, addTicket, verifyKyc],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
