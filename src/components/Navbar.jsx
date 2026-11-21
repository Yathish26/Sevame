import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/app-context.js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse Jobs' },
  { to: '/post', label: '+ Post Request' },
  { to: '/support', label: 'Tickets' },
  { to: '/profile', label: 'Profile' },
  { to: '/policies', label: 'Policies' },
]

function Navbar() {
  const { user, openModal } = useApp()

  return (
    <header className="sticky top-0 z-40 glass-bar bg-white/85 border-b border-slate-200/70 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand logo (original Seva Mein logo) */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Seva Mein home">
            <span className="inline-flex items-center rounded-xl bg-black px-2.5 py-2 shadow-lg shadow-slate-900/20 ring-1 ring-black/10 group-hover:scale-[1.03] transition-transform duration-300">
              <img src="/logo.png" alt="Seva Mein" className="h-5 sm:h-6 w-auto" />
            </span>
            <span className="hidden sm:flex lg:hidden xl:flex items-center gap-1 text-[11px] font-bold text-[#0F5257]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Mangaluru • Kudla
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600 bg-slate-100/60 p-1 rounded-full" aria-label="Main Navigation">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  isActive
                    ? 'px-3 xl:px-4 py-1.5 rounded-full text-[#0F5257] bg-white shadow-sm font-bold transition-all whitespace-nowrap'
                    : 'px-3 xl:px-4 py-1.5 rounded-full hover:text-slate-900 hover:bg-white/60 transition-all whitespace-nowrap'
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Always-visible quick actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => openModal('kyc')}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all"
              title="DigiLocker KYC Status"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="hidden min-[400px]:inline">{user.kycVerified ? 'KYC Verified' : 'Get KYC'}</span>
              <span className="min-[400px]:hidden">KYC</span>
            </button>

            <button
              type="button"
              onClick={() => openModal('ticket')}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all"
              title="Raise Support Ticket or Complaint"
            >
              <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="hidden sm:inline">Ticket / Complaint</span>
              <span className="sm:hidden">Ticket</span>
            </button>

            <button
              type="button"
              onClick={() => openModal('sos')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-br from-rose-600 to-rose-700 text-white hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-600/30 transition-all animate-pulse hover:animate-none ring-2 ring-rose-400/40"
              title="Emergency SOS & GPS Logger"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>SOS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
