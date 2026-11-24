import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import { adminApi, getAdminToken, setAdminToken } from '../lib/api.js'

const fieldCls = 'field px-3.5 py-2.5 rounded-xl'
const labelCls = 'block text-xs font-bold text-slate-700 mb-1'

// /admin/login — separate from user sign-in; uses the fixed admin credentials.
function AdminLogin() {
  const { showToast } = useApp()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (getAdminToken()) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Enter the admin username and password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const data = await adminApi('/admin/login', { method: 'POST', body: { username: username.trim(), password } })
      setAdminToken(data.token)
      showToast('Signed in to the admin dashboard.', 'success')
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="app-view max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-5">
        <div className="space-y-1">
          <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold tracking-wider">ADMIN</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Admin sign in</h1>
          <p className="text-sm text-slate-600">Staff access to the Seva Mein dashboard.</p>
        </div>

        <form onSubmit={submit} noValidate className="space-y-3.5 text-sm">
          <div>
            <label htmlFor="admin-username" className={labelCls}>
              Admin username
            </label>
            <input
              id="admin-username"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              className={fieldCls}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className={labelCls}>
              Password
            </label>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className={fieldCls}
            />
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="accent-[#0F5257]" />
            Show password
          </label>

          {error && (
            <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-extrabold bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in to dashboard'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default AdminLogin
