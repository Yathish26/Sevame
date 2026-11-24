import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import AuthForm from '../components/AuthForm.jsx'

// Only allow in-app redirects (no "//evil.com" or absolute URLs).
function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/login') && !value.startsWith('/register') ? value : '/profile'
}

const COPY = {
  login: {
    kicker: 'Welcome back',
    title: 'Sign in to Seva Mein',
    text: 'Post requests, accept nearby tasks and track your Trust Score.',
  },
  register: {
    kicker: 'Join Mangaluru’s help network',
    title: 'Create your account',
    text: 'Free to join. Get help nearby or earn by helping your neighbours.',
  },
}

// Shared page for /login and /register. ?next=/path sends the user back after signing in.
function AuthPage({ mode }) {
  const { user, authReady } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const copy = COPY[mode]

  if (!authReady) {
    return (
      <section className="app-view max-w-lg mx-auto">
        <div className="h-96 rounded-[1.75rem] bg-white/70 border border-slate-200/80 animate-pulse" aria-label="Loading" />
      </section>
    )
  }

  // Already signed in (or just signed in): go where they were heading.
  if (user) return <Navigate to={next} replace />

  const switchTo = (other) => navigate(`/${other}${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`, { replace: true })

  return (
    <section className="app-view max-w-lg mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-5">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F5257]">{copy.kicker}</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">{copy.title}</h1>
          <p className="text-sm text-slate-600">{copy.text}</p>
        </div>

        {/* key resets the form when switching between login and register */}
        <AuthForm key={mode} mode={mode} onSwitch={switchTo} onDone={() => navigate(next, { replace: true })} />

        <p className="text-center text-[11px] text-slate-500">
          Trouble signing in?{' '}
          <Link to="/support" className="font-bold text-[#0F5257] hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </section>
  )
}

export default AuthPage
