import { useApp } from '../context/app-context.js'

const urgencyColors = {
  High: 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200/80',
  Normal: 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200/80',
  Low: 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-200/80',
}

function JobCard({ job }) {
  const { user, openAcceptModal } = useApp()
  const urgClass = urgencyColors[job.urgency] || urgencyColors.Normal
  const isMine = !!user && job.posterUsername === user.username

  return (
    <article className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-5 shadow-lg shadow-slate-200/40 card-lift flex flex-col justify-between gap-4 animate-fade-up">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-teal-50 to-emerald-50 text-[#0F5257] border border-teal-200/80 shadow-sm">
            {job.category}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shadow-sm ${urgClass}`}>{job.urgency} Urgency</span>
        </div>

        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug font-display">{job.title}</h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#F6F5F2] to-slate-50 border border-slate-200/80 shadow-sm">
            📍 {job.area} • {job.coverageKm} km coverage
          </span>
          <span className="text-slate-500">⏰ {job.deadline}</span>
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 space-y-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#F6F5F2] to-slate-50 border border-slate-200/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 text-xs font-extrabold text-slate-900 truncate">
              {job.posterName} <span className="font-semibold text-slate-500">{job.posterUsername}</span>
            </p>
            {job.posterKyc && (
              <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200/60">
                ✓ KYC
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-slate-800">
              Trust: <span className="text-[#0F5257]">{job.posterTrust}/30</span>
            </span>
            <span className="font-bold text-amber-800 text-right">
              Total: {job.posterTotalPoints.toLocaleString('en-IN')} Pts ({job.posterBadge})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Starting Reward</p>
            <p className="text-lg font-extrabold text-slate-900">
              ₹{job.reward} <span className="text-[11px] font-normal text-slate-500">(Max ₹{job.maxBudget})</span>
            </p>
          </div>
          {isMine ? (
            <span className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Your request</span>
          ) : (
            <button
              type="button"
              onClick={() => openAcceptModal(job)}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-md shadow-teal-900/20 transition-all hover:scale-105 active:scale-95"
            >
              Accept / Apply
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default JobCard
