import { useState } from 'react'
import { useApp } from '../context/app-context.js'

const TICKET_TYPES = [
  'Task Dispute / No-Show',
  'Prohibited Task / Safety Report',
  'Trust Score Review',
  'Affiliate 10% Transfer Query',
  'KYC / Technical Issue',
]

const fieldCls = 'field px-3.5 py-2.5 rounded-xl'
const labelCls = 'block text-xs font-bold text-slate-700 mb-1'

function Support() {
  const { user, tickets, addTicket, showToast, openModal, requireLogin, site } = useApp()
  const {
    emergencyNumber: EMERGENCY_NUMBER,
    grievanceOfficerName: GRIEVANCE_OFFICER_NAME,
    grievanceEmail: GRIEVANCE_EMAIL,
    jurisdiction: JURISDICTION,
  } = site
  const [type, setType] = useState(TICKET_TYPES[0])
  const [ref, setRef] = useState('')
  const [desc, setDesc] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const d = desc.trim()
    if (!d) return
    if (!requireLogin('Sign in to submit a ticket — your text is kept.')) return
    setBusy(true)
    try {
      await addTicket(type, d, ref.trim())
      setType(TICKET_TYPES[0])
      setRef('')
      setDesc('')
      showToast('Support ticket submitted! Our Mangaluru desk will review shortly.', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="app-view space-y-6">
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Ticket form */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 sm:p-8 shadow-lg shadow-slate-200/40 space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">Dispute &amp; Safety Resolution</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 font-display">Tickets &amp; Complaints Center</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Report task disputes, rule violations, Trust Score appeals, or affiliate payout queries. Verified breaches deduct -5 Trust Points or trigger
              permanent bans.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="ticketType" className={labelCls}>
                  Issue Type
                </label>
                <select id="ticketType" value={type} onChange={(e) => setType(e.target.value)} className={fieldCls}>
                  {TICKET_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ticketRef" className={labelCls}>
                  Task ID or @Username (Optional)
                </label>
                <input
                  id="ticketRef"
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="e.g., #SM-104 or @karthik_bejai"
                  className={fieldCls}
                />
              </div>
            </div>
            <div>
              <label htmlFor="ticketDesc" className={labelCls}>
                Complaint / Ticket Details *
              </label>
              <textarea
                id="ticketDesc"
                required
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe what happened with date, area in Mangaluru, and any proof notes..."
                className={fieldCls}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {busy ? 'Submitting…' : 'Submit Support Ticket'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Your Recent Tickets</h2>
            <div className="space-y-2">
              {tickets.length === 0 && (
                <p className="text-xs text-slate-500">{user ? 'No tickets yet.' : 'Sign in to see your tickets.'}</p>
              )}
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F6F5F2] to-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors animate-fade-up"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">
                      {t.id} • {t.title}
                    </p>
                    <p className="text-slate-600 mt-0.5 break-words">{t.summary}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold shrink-0 bg-gradient-to-r ${
                      t.status === 'Resolved' ? 'from-emerald-100 to-teal-100 text-emerald-800' : 'from-amber-100 to-orange-100 text-amber-900'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SOS + grievance officer */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50/50 rounded-[1.75rem] border border-rose-200/80 p-6 space-y-4 shadow-lg shadow-rose-200/30">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-xs font-extrabold shadow-md animate-pulse shrink-0">
                SOS
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-rose-950 font-display">Emergency &amp; Field Safety</h2>
                <p className="text-xs text-rose-800">Immediate help during an active Mangaluru task</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
              If you ever feel unsafe during an in-person handover or task, leave the location immediately, dial <strong>{EMERGENCY_NUMBER} (India Emergency)</strong>, and
              trigger the Seva Mein GPS safety log.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`tel:${EMERGENCY_NUMBER}`}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-md transition-all hover:scale-105 active:scale-95"
              >
                Call {EMERGENCY_NUMBER} Emergency
              </a>
              <button
                type="button"
                onClick={() => openModal('sos')}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-white/80 border border-rose-300 text-rose-900 hover:bg-rose-100 transition-colors"
              >
                Log GPS &amp; Alert Support
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 space-y-3 text-xs sm:text-sm shadow-lg shadow-slate-200/30">
            <h2 className="text-base font-extrabold text-slate-900 font-display">Grievance &amp; Nodal Officer (IT Rules &amp; DPDP)</h2>
            <p className="text-slate-600">For statutory notices, law enforcement requests, or formal complaints:</p>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F6F5F2] to-slate-50 border border-slate-200 space-y-1 text-slate-800">
              <p>
                <strong>Grievance Officer:</strong> {GRIEVANCE_OFFICER_NAME}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${GRIEVANCE_EMAIL}`} className="text-[#0F5257] hover:underline">
                  {GRIEVANCE_EMAIL}
                </a>
              </p>
              <p>
                <strong>Jurisdiction:</strong> {JURISDICTION}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Support
