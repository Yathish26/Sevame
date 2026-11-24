import { useState } from 'react'
import { useApp } from '../context/app-context.js'

const STATUS = {
  open: { label: 'Open', cls: 'from-sky-100 to-blue-100 text-sky-800' },
  accepted: { label: 'In progress', cls: 'from-amber-100 to-orange-100 text-amber-900' },
  completed: { label: 'Completed', cls: 'from-emerald-100 to-teal-100 text-emerald-800' },
  cancelled: { label: 'Cancelled', cls: 'from-slate-100 to-slate-200 text-slate-600' },
}

const btn = 'px-3 py-2 rounded-xl text-xs font-extrabold transition-all disabled:opacity-60'

// A task in the signed-in user's own lists. role = 'poster' (I posted it) or 'helper' (I accepted it).
function MyTaskCard({ task, role }) {
  const { cancelTask, completeTask, rateTask, showToast } = useApp()
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)
  const status = STATUS[task.status] || STATUS.open

  const run = async (fn, success) => {
    setBusy(true)
    try {
      const data = await fn()
      showToast(data?.message || success, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const cancel = () => {
    if (window.confirm(`Cancel "${task.title}"?`)) run(() => cancelTask(task.id), 'Request cancelled.')
  }
  const complete = () => {
    if (!/^\d{4}$/.test(otp)) return showToast('Enter the 4-digit OTP from the poster.', 'warn')
    run(() => completeTask(task.id, otp))
  }

  return (
    <article className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-5 shadow-lg shadow-slate-200/40 flex flex-col gap-3 animate-fade-up">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-extrabold text-[#0F5257]">
          {task.id} • {task.category}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r ${status.cls}`}>{status.label}</span>
      </div>
      <h3 className="text-base font-extrabold text-slate-900 leading-snug font-display">{task.title}</h3>
      <p className="text-xs text-slate-600">
        📍 {task.area} • ₹{task.reward} • ⏰ {task.deadline || 'No deadline'}
      </p>

      <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
        {role === 'poster' && task.status === 'accepted' && (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 space-y-1">
            <p className="text-slate-700">
              Helper: <strong>{task.helperName}</strong> {task.helperUsername}
            </p>
            <p className="text-slate-600">Share this OTP only after the task is done:</p>
            <p className="text-xl font-extrabold tracking-widest font-mono text-slate-900">{task.completionOtp}</p>
          </div>
        )}

        {role === 'poster' && task.status === 'completed' &&
          (task.rating ? (
            <p className="text-slate-700">
              You rated {task.helperName || 'the helper'} <strong className="text-amber-600">{'★'.repeat(task.rating)}</strong>
            </p>
          ) : (
            <div className="space-y-1.5">
              <p className="text-slate-700">Rate {task.helperName || 'your helper'} (5★ gives them +10 pts):</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={busy}
                    onClick={() => run(() => rateTask(task.id, n))}
                    className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 font-extrabold hover:bg-amber-100 transition-colors disabled:opacity-60"
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    {n}★
                  </button>
                ))}
              </div>
            </div>
          ))}

        {role === 'poster' && (task.status === 'open' || task.status === 'accepted') && (
          <button type="button" onClick={cancel} disabled={busy} className={`${btn} bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100`}>
            Cancel request
          </button>
        )}

        {role === 'helper' && (
          <p className="text-slate-700">
            Poster: <strong>{task.posterName}</strong> {task.posterUsername}
          </p>
        )}

        {role === 'helper' && task.status === 'accepted' && (
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label htmlFor={`otp-${task.id}`} className="block text-slate-500 mb-1">
                Completion OTP from poster
              </label>
              <input
                id={`otp-${task.id}`}
                inputMode="numeric"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="field w-24 px-3 py-2 rounded-xl font-extrabold tracking-widest font-mono"
              />
            </div>
            <button
              type="button"
              onClick={complete}
              disabled={busy}
              className={`${btn} bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md hover:scale-105 active:scale-95`}
            >
              Verify &amp; Complete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default MyTaskCard
