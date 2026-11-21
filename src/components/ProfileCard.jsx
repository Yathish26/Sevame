import { useApp } from '../context/app-context.js'

const RADIUS = 28
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function trustTier(score) {
  if (score >= 20) return { label: 'High Trust', cls: 'from-emerald-100 to-teal-100 text-emerald-800' }
  if (score >= 10) return { label: 'Moderate Trust', cls: 'from-amber-100 to-yellow-100 text-amber-800' }
  return { label: 'Low Trust', cls: 'from-rose-100 to-pink-100 text-rose-800' }
}

export function TrustRing({ score }) {
  const offset = CIRCUMFERENCE - (score / 30) * CIRCUMFERENCE
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 trust-ring" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F5257" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="#E2E8F0" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="url(#trustGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-extrabold text-slate-900">{score}</span>
      </div>
    </div>
  )
}

export function MetricCards() {
  const { user, openModal, earnPoints, showToast } = useApp()
  const tier = trustTier(user.trustScore)

  const simulate = () => {
    earnPoints()
    showToast('+15 Total Points (+5 completion, +10 5★ review) credited!', 'success')
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Trust Score */}
      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200/80 space-y-2.5 overflow-hidden">
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-emerald-400/10 blur-xl" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trust Score</span>
          <button type="button" onClick={() => openModal('trustRules')} className="text-xs font-bold text-[#0F5257] hover:underline">
            Rules?
          </button>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <TrustRing score={user.trustScore} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">{user.trustScore}</span>
              <span className="text-sm font-semibold text-slate-500">/ 30</span>
            </div>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r ${tier.cls}`}>{tier.label}</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug relative z-10">
          Hard cap 30. -5 per breach; {'<'}10 triggers restricted routing &amp; 50% recovery speed.
        </p>
      </div>

      {/* Total Points */}
      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/90 space-y-2.5 overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Total Points</span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-200/80 text-amber-950 shadow-sm">{user.badge}</span>
        </div>
        <div className="flex items-baseline justify-between relative z-10">
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-800">
            {user.totalPoints.toLocaleString('en-IN')} <span className="text-sm font-semibold text-amber-700">Pts</span>
          </p>
          <span className="text-xs font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">No Ceiling</span>
        </div>
        <p className="text-[11px] text-amber-950/80 leading-snug relative z-10">
          Lifetime reputation: <strong>+5 pts</strong> per completed task &amp; <strong>+10 pts</strong> per 5-star peer review.
        </p>
        <div className="pt-0.5 relative z-10">
          <button
            type="button"
            onClick={simulate}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/30 to-amber-400/20 hover:from-amber-500/40 hover:to-amber-400/30 text-amber-950 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            + Simulate 5★ Task (+15 Pts)
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProfileHeader({ actions }) {
  const { user } = useApp()
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F5257] via-teal-700 to-emerald-700 text-white flex items-center justify-center text-xl font-extrabold shadow-lg ring-2 ring-amber-400/40 shrink-0">
          {user.initials}
          {user.kycVerified && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-black">
              ✓
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">{user.name}</h2>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Demo User • {user.username}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 flex items-start gap-1.5">
            <span>📍</span>
            <span>
              <strong>Demo Address:</strong> {user.address} <span className="text-slate-400">(Private)</span>
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-200 shadow-sm">
          <span>✓</span> {user.kycVerified ? 'KYC Verified' : 'KYC Pending'}
        </span>
        {actions}
      </div>
    </div>
  )
}
