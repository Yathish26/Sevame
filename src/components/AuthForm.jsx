import { useState } from 'react'
import { useApp } from '../context/app-context.js'
import { getReferral } from '../lib/api.js'

// Same rules as habackend/sevamein/routes/auth.routes.js, checked here first for instant feedback.
const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 6

const EMPTY = { name: '', username: '', email: '', login: '', password: '', confirm: '', agree: false }

const fieldCls = 'field px-3.5 py-2.5 rounded-xl'
const labelCls = 'block text-xs font-bold text-slate-700 mb-1'
const errorCls = 'text-[11px] font-semibold text-rose-600 mt-1'

function validate(mode, form) {
  const errors = {}
  if (mode === 'login') {
    if (!form.login.trim()) errors.login = 'Enter your email or username.'
    if (!form.password) errors.password = 'Enter your password.'
    return errors
  }
  if (!form.name.trim()) errors.name = 'Enter your full name.'
  if (!USERNAME_PATTERN.test(form.username.replace(/^@/, '').trim().toLowerCase())) {
    errors.username = '3–30 characters: letters, numbers or underscores.'
  }
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (form.password.length < MIN_PASSWORD) errors.password = `At least ${MIN_PASSWORD} characters.`
  if (form.confirm !== form.password) errors.confirm = 'Passwords do not match.'
  if (!form.agree) errors.agree = 'Please accept the Terms and Privacy Policy.'
  return errors
}

// Login / register form used by the /login and /register pages and by the sign-in modal.
// `onSwitch(mode)` swaps between the two; `onDone()` runs after a successful sign-in.
function AuthForm({ mode, onSwitch, onDone }) {
  const { login, register, showToast } = useApp()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const isLogin = mode === 'login'
  const referral = !isLogin ? getReferral() : null

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((errs) => (errs[key] ? { ...errs, [key]: undefined } : errs))
    setServerError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    const found = validate(mode, form)
    setErrors(found)
    if (Object.values(found).some(Boolean)) return

    setBusy(true)
    setServerError('')
    try {
      if (isLogin) {
        await login(form.login.trim(), form.password)
        showToast('Welcome back!', 'success')
      } else {
        await register({
          name: form.name.trim(),
          username: form.username.replace(/^@/, '').trim().toLowerCase(),
          email: form.email.trim(),
          password: form.password,
        })
        showToast('Account created! Welcome to Seva Mein.', 'success')
      }
      setForm(EMPTY)
      onDone?.()
    } catch (err) {
      setServerError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const passwordInput = (id, key, autoComplete, label) => (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={form[key]}
        onChange={set(key)}
        aria-invalid={!!errors[key]}
        className={fieldCls}
      />
      {errors[key] && <p className={errorCls}>{errors[key]}</p>}
    </div>
  )

  return (
    <form onSubmit={submit} noValidate className="space-y-3.5 text-sm">
      {referral && (
        <p className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          🎁 You were invited with referral code <strong>{referral}</strong>. It&apos;s applied automatically.
        </p>
      )}

      {isLogin ? (
        <div>
          <label htmlFor={`${mode}-login`} className={labelCls}>
            Email or username
          </label>
          <input
            id={`${mode}-login`}
            autoComplete="username"
            value={form.login}
            onChange={set('login')}
            aria-invalid={!!errors.login}
            placeholder="you@example.com or @username"
            className={fieldCls}
          />
          {errors.login && <p className={errorCls}>{errors.login}</p>}
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="register-name" className={labelCls}>
              Full name
            </label>
            <input id="register-name" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} className={fieldCls} />
            {errors.name && <p className={errorCls}>{errors.name}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="register-username" className={labelCls}>
                Username
              </label>
              <input
                id="register-username"
                autoComplete="username"
                value={form.username}
                onChange={set('username')}
                aria-invalid={!!errors.username}
                placeholder="rohan_mangalore"
                className={fieldCls}
              />
              {errors.username && <p className={errorCls}>{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="register-email" className={labelCls}>
                Email
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                aria-invalid={!!errors.email}
                className={fieldCls}
              />
              {errors.email && <p className={errorCls}>{errors.email}</p>}
            </div>
          </div>
        </>
      )}

      {isLogin ? (
        passwordInput('login-password', 'password', 'current-password', 'Password')
      ) : (
        <div className="grid sm:grid-cols-2 gap-3.5">
          {passwordInput('register-password', 'password', 'new-password', 'Password')}
          {passwordInput('register-confirm', 'confirm', 'new-password', 'Confirm password')}
        </div>
      )}

      <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
        <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="accent-[#0F5257]" />
        Show password
      </label>

      {!isLogin && (
        <div>
          <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" checked={form.agree} onChange={set('agree')} className="mt-0.5 accent-[#0F5257]" />
            <span>
              I agree to Seva Mein&apos;s{' '}
              <a href="/terms-and-conditions" target="_blank" rel="noreferrer" className="font-bold text-[#0F5257] hover:underline">
                Terms &amp; Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" target="_blank" rel="noreferrer" className="font-bold text-[#0F5257] hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agree && <p className={errorCls}>{errors.agree}</p>}
        </div>
      )}

      {serverError && (
        <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-lg shadow-teal-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100"
      >
        {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
      </button>

      {onSwitch && (
        <p className="text-center text-xs text-slate-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => onSwitch(isLogin ? 'register' : 'login')} className="font-bold text-[#0F5257] hover:underline">
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      )}
    </form>
  )
}

export default AuthForm
