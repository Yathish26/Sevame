import { useEffect, useState } from 'react'
import { useApp } from '../context/app-context.js'
import { TRUST_RULES } from '../data/demo.js'
import { getCoords } from '../lib/api.js'
import SignInCard from './SignInCard.jsx'
import AuthForm from './AuthForm.jsx'

const MANGALURU_PIN = '12.8855°N, 74.8388°E'

function ModalShell({ title, onClose, children, size = 'max-w-md', danger = false, header }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 modal-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`bg-white/95 backdrop-blur-md rounded-[1.75rem] ${size} w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-fade-up ${
          danger ? 'border-2 border-rose-500/60' : 'border border-slate-200/80'
        }`}
      >
        <div className={`flex items-center justify-between gap-3 border-b pb-3 ${danger ? 'border-rose-100' : 'border-slate-100'}`}>
          {header || <h3 className="text-lg font-extrabold text-slate-900 font-display">{title}</h3>}
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const primaryBtn =
  'px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100'

/* ---------- Task acceptance + consent + OTP ---------- */
function AcceptTaskModal() {
  const { selectedJob: job, user, closeModal, showToast, acceptTask, completeTask, requireLogin } = useApp()
  const [c1, setC1] = useState(false)
  const [c2, setC2] = useState(false)
  const [auditMeta, setAuditMeta] = useState('')
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)

  if (!job) return null

  const confirmConsent = async () => {
    if (!c1 || !c2) {
      showToast('Both safety and intermediary consent checkboxes are required.', 'error')
      return
    }
    if (!requireLogin('Sign in to accept tasks.')) return
    setBusy(true)
    try {
      const coords = await getCoords()
      const { consentLog } = await acceptTask(job.id, coords)
      const when = new Date(consentLog.at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      const gps = consentLog.lat != null ? `${consentLog.lat.toFixed(4)}°N, ${consentLog.lng.toFixed(4)}°E` : `${MANGALURU_PIN} (approx.)`
      setAuditMeta(`Audit Log: User ${user.username} | Task ${job.id} | IP ${consentLog.ip || 'logged'} | GPS ${gps} | ${when}`)
      showToast('Consent logged! Task is now yours.', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const complete = async () => {
    if (!/^\d{4}$/.test(otp)) {
      showToast('Enter the 4-digit OTP the poster gives you.', 'warn')
      return
    }
    setBusy(true)
    try {
      const data = await completeTask(job.id, otp)
      closeModal()
      showToast(data.message, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell
      title="Task Acceptance & Safety Gate"
      onClose={closeModal}
      size="max-w-lg"
      header={<span className="text-xs font-extrabold uppercase tracking-wider text-[#0F5257]">Task Acceptance &amp; Safety Gate</span>}
    >
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F6F5F2] to-teal-50/20 border border-slate-200/80 space-y-1.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-extrabold text-[#0F5257]">
            {job.id} • {job.category}
          </span>
          <span className="font-extrabold text-slate-900">₹{job.reward}</span>
        </div>
        <p className="font-bold text-slate-900 text-sm">{job.title}</p>
        <p className="text-xs text-slate-600">
          📍 {job.area} ({job.coverageKm} km radius) • Poster: {job.posterName} ({job.posterUsername})
        </p>
        <p className="text-xs font-semibold text-slate-700">
          Poster Health: Trust {job.posterTrust}/30 • {job.posterTotalPoints} Total Pts
        </p>
      </div>

      {!auditMeta ? (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 text-xs text-slate-800 space-y-2">
            <p className="font-extrabold text-amber-950">Mandatory &quot;I Accept &amp; Proceed&quot; Acknowledgment</p>
            <label className="flex items-start gap-2 cursor-pointer group">
              <input type="checkbox" checked={c1} onChange={(e) => setC1(e.target.checked)} className="mt-0.5 accent-[#0F5257] cursor-pointer" />
              <span className="group-hover:text-slate-900 transition-colors">
                I confirm this task is lawful and contains no prohibited items, cash transfers, or unsafe requests.
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer group">
              <input type="checkbox" checked={c2} onChange={(e) => setC2(e.target.checked)} className="mt-0.5 accent-[#0F5257] cursor-pointer" />
              <span className="group-hover:text-slate-900 transition-colors">
                I agree to Seva Mein&apos;s Section 79 Intermediary Terms &amp; understand GPS, IP, and timestamp are logged upon acceptance.
              </span>
            </label>
          </div>
          <button
            type="button"
            onClick={confirmConsent}
            disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-lg shadow-teal-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? 'Logging consent…' : 'I Accept & Proceed'}
          </button>
        </div>
      ) : (
        <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 text-xs">
          <p className="font-extrabold text-emerald-950">✓ Consent Logged! Task Accepted</p>
          <p className="text-emerald-800 font-mono text-[11px] break-words">{auditMeta}</p>
          <p className="text-emerald-900">
            When the task is done, ask <strong>{job.posterName}</strong> for their 4-digit completion OTP. You can also finish it later from your Profile.
          </p>
          <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 flex flex-wrap items-end justify-between gap-3 shadow-sm">
            <div>
              <label htmlFor="acceptOtp" className="block text-slate-500 mb-1">
                Completion OTP
              </label>
              <input
                id="acceptOtp"
                inputMode="numeric"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="field w-28 px-3 py-2 rounded-xl text-lg font-extrabold tracking-widest font-mono"
              />
            </div>
            <button
              type="button"
              onClick={complete}
              disabled={busy}
              className="px-3.5 py-2 rounded-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              Verify OTP &amp; Complete (+5 Pts)
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  )
}

/* ---------- SOS ---------- */
function SosModal() {
  const { user, closeModal, showToast, logSos, site } = useApp()
  const EMERGENCY_NUMBER = site.emergencyNumber
  const [status, setStatus] = useState('Coordinates: Ready to capture Mangaluru GPS pin...')
  const [busy, setBusy] = useState(false)

  const triggerSos = async () => {
    setBusy(true)
    setStatus('Capturing GPS…')
    const coords = await getCoords()
    const where = coords ? `GPS: ${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E` : `Mangaluru Zone Pin (${MANGALURU_PIN})`
    try {
      await logSos(coords)
      const stamp = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })
      setStatus(`ALERT SENT at ${stamp} • ${where} logged`)
      showToast('SOS logged with the Seva Mein Safety Desk!', 'error')
    } catch {
      setStatus(`Could not reach the safety desk • ${where}. Call ${EMERGENCY_NUMBER} now.`)
      showToast(`SOS could not be sent. Call ${EMERGENCY_NUMBER} directly.`, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell
      title="Safety & GPS Alert"
      onClose={closeModal}
      danger
      header={
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 text-white text-xs font-extrabold shadow-sm animate-pulse">
            SOS EMERGENCY
          </span>
          <h3 className="text-base font-extrabold text-slate-900">Safety &amp; GPS Alert</h3>
        </div>
      }
    >
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
        If you are in immediate danger in Mangaluru, call <strong className="text-rose-700">{EMERGENCY_NUMBER}</strong> right away. You can also log your live GPS
        coordinates and alert Seva Mein&apos;s safety desk.
      </p>
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/50 border border-rose-200/80 text-xs space-y-1">
        <p className="font-bold text-rose-950">{user ? `User: ${user.name} (${user.username})` : 'Not signed in — alert is logged anonymously'}</p>
        <p className="text-rose-800">{status}</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={`tel:${EMERGENCY_NUMBER}`}
          className="py-3 rounded-xl text-center text-xs font-extrabold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-md transition-all hover:scale-105 active:scale-95"
        >
          Dial {EMERGENCY_NUMBER} Now
        </a>
        <button
          type="button"
          onClick={triggerSos}
          disabled={busy}
          className="py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Log GPS & Alert'}
        </button>
      </div>
    </ModalShell>
  )
}

/* ---------- Quick ticket ---------- */
const MODAL_TICKET_CATEGORIES = [
  'Report Rule Breach / Scam',
  'Task Dispute / Payment Issue',
  'Trust Score Appeal',
  'Affiliate 10% Transfer Support',
  'Harrasment and Sexual Misconduct'
]

function TicketModal() {
  const { closeModal, addTicket, showToast, requireLogin } = useApp()
  const [cat, setCat] = useState(MODAL_TICKET_CATEGORIES[0])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    if (!requireLogin('Sign in to raise a ticket.')) return
    setBusy(true)
    try {
      await addTicket(cat, text.trim())
      closeModal()
      showToast('Complaint / Ticket logged successfully.', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell title="Raise Ticket / Complaint" onClose={closeModal}>
      <form onSubmit={submit} className="space-y-3 text-sm">
        <div>
          <label htmlFor="modalTicketCat" className="block text-xs font-bold text-slate-700 mb-1">
            Category
          </label>
          <select id="modalTicketCat" value={cat} onChange={(e) => setCat(e.target.value)} className="field px-3.5 py-2.5 rounded-xl">
            {MODAL_TICKET_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="modalTicketText" className="block text-xs font-bold text-slate-700 mb-1">
            Details *
          </label>
          <textarea
            id="modalTicketText"
            required
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Explain the issue clearly..."
            className="field px-3.5 py-2.5 rounded-xl"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? 'Submitting…' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

/* ---------- KYC ---------- */
function KycModal() {
  const { user, closeModal, verifyKyc, showToast } = useApp()
  const [busy, setBusy] = useState(false)

  if (!user) {
    return (
      <ModalShell title="DigiLocker KYC Verification" onClose={closeModal}>
        <SignInCard title="Sign in first" text="KYC is linked to your Seva Mein account. Sign in or create one to verify." />
      </ModalShell>
    )
  }

  const simulate = async () => {
    setBusy(true)
    try {
      const updated = await verifyKyc()
      closeModal()
      showToast(`DigiLocker KYC callback verified! Trust Score active at ${updated?.trustScore ?? user.trustScore}/30.`, 'success')
    } catch (err) {
      showToast(err.message, 'warn')
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell title="DigiLocker KYC Verification" onClose={closeModal}>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 space-y-1.5 text-xs text-emerald-950 shadow-sm">
        <p className="font-extrabold">Current Status: {user.kycVerified ? 'Verified via DigiLocker API' : 'Pending verification'}</p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        {user.area && (
          <p>
            <strong>Area:</strong> {user.area}, Mangaluru
          </p>
        )}
        <p>
          <strong>Privacy Guardrail:</strong> Raw Aadhaar number is never stored on Seva Mein servers.
        </p>
      </div>
      <p className="text-xs text-slate-600">
        Need to re-verify or test the onboarding flow for new Mangaluru college users? Run a simulated DigiLocker OAuth callback below:
      </p>
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
          Close
        </button>
        <button type="button" onClick={simulate} disabled={busy} className={primaryBtn}>
          {busy ? 'Checking…' : 'Simulate DigiLocker Re-Check'}
        </button>
      </div>
    </ModalShell>
  )
}

/* ---------- Trust rules ---------- */
function TrustRulesModal() {
  const { closeModal } = useApp()
  return (
    <ModalShell title="30-Point Trust Score Rules" onClose={closeModal}>
      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
        {TRUST_RULES.map(([head, body]) => (
          <li key={head} className="flex items-start gap-2">
            <span className="text-[#0F5257] font-bold">•</span>
            <span>
              <strong>{head}</strong> {body}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={closeModal}
          className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-md transition-all hover:scale-105 active:scale-95"
        >
          Got It
        </button>
      </div>
    </ModalShell>
  )
}

/* ---------- Sign in / Register ---------- */
// Pop-up version of /login and /register, used mid-flow (posting, accepting, tickets) so drafts aren't lost.
function AuthModal() {
  const { closeModal } = useApp()
  const [mode, setMode] = useState('login')

  return (
    <ModalShell title={mode === 'login' ? 'Sign in' : 'Create account'} onClose={closeModal}>
      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 text-xs font-bold">
        {[
          ['login', 'Sign in'],
          ['register', 'Create account'],
        ].map(([key, text]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            aria-pressed={mode === key}
            className={`py-2 rounded-lg transition-all ${mode === key ? 'bg-white text-[#0F5257] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {text}
          </button>
        ))}
      </div>

      <AuthForm key={mode} mode={mode} onSwitch={setMode} onDone={closeModal} />
    </ModalShell>
  )
}

function Modals() {
  const { activeModal } = useApp()
  switch (activeModal) {
    case 'auth':
      return <AuthModal />
    case 'acceptTask':
      return <AcceptTaskModal />
    case 'sos':
      return <SosModal />
    case 'ticket':
      return <TicketModal />
    case 'kyc':
      return <KycModal />
    case 'trustRules':
      return <TrustRulesModal />
    default:
      return null
  }
}

export default Modals
