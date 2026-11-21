import { Link } from 'react-router-dom'

function NoticeBar() {
  return (
    <div className="relative z-10 bg-gradient-to-r from-[#042F2E] via-[#083B3F] to-[#0F5257] text-teal-50 text-xs py-2.5 px-4 border-b border-teal-800/60 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
        <p className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-300 to-amber-400 text-slate-950 shadow-sm badge-pulse">
            ⚡ 1-Month Mangaluru Trial
          </span>
          <span className="text-teal-100/90">
            Online peer-to-peer connection intermediary (Section 79 IT Act). Users act independently—not as employees or couriers.
          </span>
        </p>
        <Link
          to="/policies"
          className="shrink-0 font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 transition-colors"
        >
          Terms &amp; Privacy →
        </Link>
      </div>
    </div>
  )
}

export default NoticeBar
