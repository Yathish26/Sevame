import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/app-context.js'

// Shown in place of account-only content when nobody is signed in.
// Links to /login and /register, coming back to the current page afterwards.
function SignInCard({ title = 'Sign in to Seva Mein', text = 'Create a free account to post requests, accept tasks and track your Trust Score.', className = '' }) {
  const { authReady, closeModal } = useApp()
  const { pathname } = useLocation()
  const next = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname)}`

  if (!authReady) {
    return <div className={`rounded-2xl bg-slate-100/80 animate-pulse min-h-32 ${className}`} aria-label="Loading account" />
  }

  return (
    <div className={`flex flex-col items-start justify-center gap-3 ${className}`}>
      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">{title}</h2>
      <p className="text-xs sm:text-sm text-slate-600">{text}</p>
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/login${next}`}
          onClick={closeModal}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-md transition-all hover:scale-105 active:scale-95"
        >
          Sign in
        </Link>
        <Link
          to={`/register${next}`}
          onClick={closeModal}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors"
        >
          Create account
        </Link>
      </div>
    </div>
  )
}

export default SignInCard
