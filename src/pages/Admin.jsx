import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import { ADMIN_LOGOUT_EVENT, adminApi, getAdminToken, setAdminToken } from '../lib/api.js'
import DailyBarChart from '../components/admin/DailyBarChart.jsx'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'sos', label: 'SOS Alerts' },
  { key: 'panel', label: 'Panel' },
]

const card = 'bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 shadow-lg shadow-slate-200/40'
const fieldCls = 'field px-3.5 py-2.5 rounded-xl'
const smallBtn = 'px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50'

const fmtDate = (d) => (d ? new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : '—')
const fmtNum = (n) => (n ?? 0).toLocaleString('en-IN')

// Status chips always carry a text label, never colour alone.
const CHIP = {
  open: 'bg-sky-50 text-sky-800 border-sky-200',
  accepted: 'bg-amber-50 text-amber-900 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  Open: 'bg-amber-50 text-amber-900 border-amber-200',
  'In Progress': 'bg-sky-50 text-sky-800 border-sky-200',
  Resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}
function Chip({ children, tone }) {
  return <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${CHIP[tone] || CHIP.cancelled}`}>{children}</span>
}

// Loads a paged admin list; `query` is the filter string, reload when it changes.
function usePagedList(path, key, query) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [status, setStatus] = useState('loading')
  const latest = useRef(0)

  const load = useCallback(
    async (nextPage) => {
      const requestId = ++latest.current
      setStatus('loading')
      try {
        const data = await adminApi(`${path}?${query}${query ? '&' : ''}page=${nextPage}`)
        if (requestId !== latest.current) return // a newer search/filter superseded this one
        setItems((list) => (nextPage === 1 ? data[key] : [...list, ...data[key]]))
        setTotal(data.total)
        setHasMore(data.hasMore)
        setPage(nextPage)
        setStatus('ready')
      } catch {
        if (requestId === latest.current) setStatus('error')
      }
    },
    [path, key, query],
  )

  useEffect(() => {
    load(1)
  }, [load])

  return { items, setItems, total, hasMore, status, reload: () => load(1), more: () => load(page + 1) }
}

function ListFooter({ list }) {
  if (list.status === 'error') {
    return (
      <p className="text-center text-sm text-rose-700">
        Couldn&apos;t load.{' '}
        <button type="button" onClick={list.reload} className="font-bold underline">
          Try again
        </button>
      </p>
    )
  }
  if (list.status === 'loading') return <p className="text-center text-xs text-slate-500">Loading…</p>
  if (list.items.length === 0) return <p className="text-center text-sm text-slate-500 py-6">Nothing here.</p>
  if (!list.hasMore) return null
  return (
    <div className="text-center">
      <button type="button" onClick={list.more} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
        Load more
      </button>
    </div>
  )
}

// Debounced search box value.
function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

/* ---------------- Overview ---------------- */

function Stat({ label, value, hint, tone = 'text-slate-900' }) {
  return (
    <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`text-2xl sm:text-3xl font-extrabold mt-1 ${tone}`}>{value}</p>
      {hint && <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>}
    </div>
  )
}

function Group({ title, children }) {
  return (
    <div className="space-y-2.5">
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>
    </div>
  )
}

function Overview({ goTo }) {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      setStats(await adminApi('/admin/stats'))
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (error) {
    return (
      <div className={`${card} p-6 text-sm text-rose-700`}>
        {error}{' '}
        <button type="button" onClick={load} className="font-bold underline">
          Retry
        </button>
      </div>
    )
  }
  if (!stats) return <div className="h-96 rounded-[1.75rem] bg-white/70 border border-slate-200/80 animate-pulse" aria-label="Loading stats" />

  const { users, tasks, rewards, tickets, sos, series } = stats

  return (
    <div className="space-y-6">
      {(sos.open > 0 || tickets.Open > 0) && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-wrap items-center gap-3 text-sm text-rose-900">
          <span className="font-extrabold">⚠ Needs attention:</span>
          {sos.open > 0 && (
            <button type="button" onClick={() => goTo('sos')} className="font-bold underline">
              {sos.open} unhandled SOS alert{sos.open > 1 ? 's' : ''}
            </button>
          )}
          {tickets.Open > 0 && (
            <button type="button" onClick={() => goTo('tickets')} className="font-bold underline">
              {tickets.Open} open ticket{tickets.Open > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      <Group title="Users">
        <Stat label="Total users" value={fmtNum(users.total)} hint={`+${fmtNum(users.new7d)} in last 7 days`} tone="text-[#0F5257]" />
        <Stat label="KYC verified" value={fmtNum(users.kycVerified)} hint={users.total ? `${Math.round((users.kycVerified / users.total) * 100)}% of users` : '—'} />
        <Stat label="Low trust (<10)" value={fmtNum(users.lowTrust)} />
        <Stat label="Suspended / Banned" value={`${fmtNum(users.suspended)} / ${fmtNum(users.banned)}`} hint={`${users.admins} admin${users.admins === 1 ? '' : 's'}`} />
      </Group>

      <Group title="Tasks">
        <Stat label="Total tasks" value={fmtNum(tasks.total)} hint={`+${fmtNum(tasks.new7d)} in last 7 days`} tone="text-[#0F5257]" />
        <Stat label="Open" value={fmtNum(tasks.open)} hint={`₹${fmtNum(rewards.open)} in rewards`} />
        <Stat label="In progress" value={fmtNum(tasks.accepted)} hint={`₹${fmtNum(rewards.accepted)} in rewards`} />
        <Stat label="Completed" value={fmtNum(tasks.completed)} hint={`₹${fmtNum(rewards.completed)} paid out · ${fmtNum(tasks.cancelled)} cancelled`} />
      </Group>

      <Group title="Support & Safety">
        <Stat label="Open tickets" value={fmtNum(tickets.Open)} tone={tickets.Open ? 'text-amber-700' : 'text-slate-900'} />
        <Stat label="In progress" value={fmtNum(tickets['In Progress'])} />
        <Stat label="Resolved" value={fmtNum(tickets.Resolved)} />
        <Stat label="Unhandled SOS" value={fmtNum(sos.open)} hint={`${fmtNum(sos.total)} total alerts`} tone={sos.open ? 'text-rose-700' : 'text-slate-900'} />
      </Group>

      <div className="grid lg:grid-cols-2 gap-4">
        <DailyBarChart title="New sign-ups per day" series={series.signups} unit="sign-ups" />
        <DailyBarChart title="New tasks per day" series={series.tasks} unit="tasks" />
      </div>
    </div>
  )
}

/* ---------------- Users ---------------- */

const USER_FILTERS = [
  ['all', 'All'],
  ['kyc', 'KYC verified'],
  ['unverified', 'Not verified'],
  ['lowTrust', 'Low trust'],
  ['suspended', 'Suspended'],
  ['banned', 'Banned'],
  ['admins', 'Admins'],
]

function UsersTab() {
  const { showToast, user: me } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const q = useDebounced(search)
  const list = usePagedList('/admin/users', 'users', `filter=${filter}&search=${encodeURIComponent(q)}`)
  const [busyId, setBusyId] = useState(null)

  const act = async (u, action, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return
    setBusyId(u.id)
    try {
      const data = await adminApi(`/admin/users/${u.id}`, { method: 'PATCH', body: { action } })
      list.setItems((items) => items.map((x) => (x.id === u.id ? data.user : x)))
      showToast(`${u.username}: updated`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className={`${card} p-4 sm:p-6 space-y-4`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, @username, email or phone…" className={fieldCls} aria-label="Search users" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${fieldCls} sm:w-48`} aria-label="Filter users">
          {USER_FILTERS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs font-semibold text-slate-500">{fmtNum(list.total)} users</p>

      <div className="space-y-2.5">
        {list.items.map((u) => {
          const busy = busyId === u.id
          const isMe = me?.id === u.id
          return (
            <div key={u.id} className="p-3.5 rounded-2xl border border-slate-200 bg-[#F6F5F2]/60 space-y-2.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-sm">
                    {u.name} <span className="font-semibold text-slate-500">{u.username}</span>
                    {u.role === 'admin' && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold align-middle">ADMIN</span>}
                  </p>
                  <p className="text-xs text-slate-600 break-all">
                    {u.email}
                    {u.phone ? ` · ${u.phone}` : ''}
                    {u.area ? ` · ${u.area}` : ''}
                  </p>
                  <p className="text-[11px] text-slate-500">Joined {fmtDate(u.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Trust {u.trustScore}/30</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    {fmtNum(u.totalPoints)} pts · {u.badge}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border ${u.kycVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                    {u.kycVerified ? '✓ KYC' : 'KYC pending'}
                  </span>
                  {u.strikes > 0 && <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Strikes {u.strikes}</span>}
                  {u.suspendedUntil && <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900">Suspended till {new Date(u.suspendedUntil).toLocaleDateString('en-IN')}</span>}
                  {u.banned && <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800">Banned</span>}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {u.kycVerified ? (
                  <button type="button" disabled={busy} onClick={() => act(u, 'revokeKyc', `Revoke KYC for ${u.username}?`)} className={`${smallBtn} bg-white border border-slate-200 hover:bg-slate-100`}>
                    Revoke KYC
                  </button>
                ) : (
                  <button type="button" disabled={busy} onClick={() => act(u, 'verifyKyc', `Mark ${u.username} as KYC verified?`)} className={`${smallBtn} bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100`}>
                    Verify KYC
                  </button>
                )}
                {!isMe && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => act(u, 'deductTrust', `Deduct 5 trust points from ${u.username}? Reaching 0 suspends (1st) or bans (2nd).`)}
                    className={`${smallBtn} bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100`}
                  >
                    −5 Trust
                  </button>
                )}
                {u.trustScore < 30 && (
                  <button type="button" disabled={busy} onClick={() => act(u, 'resetTrust', `Reset ${u.username}'s trust to 30?`)} className={`${smallBtn} bg-white border border-slate-200 hover:bg-slate-100`}>
                    Reset trust
                  </button>
                )}
                {u.suspendedUntil && (
                  <button type="button" disabled={busy} onClick={() => act(u, 'liftSuspension')} className={`${smallBtn} bg-white border border-slate-200 hover:bg-slate-100`}>
                    Lift suspension
                  </button>
                )}
                {!isMe &&
                  (u.banned ? (
                    <button type="button" disabled={busy} onClick={() => act(u, 'unban', `Unban ${u.username}?`)} className={`${smallBtn} bg-white border border-slate-200 hover:bg-slate-100`}>
                      Unban
                    </button>
                  ) : (
                    <button type="button" disabled={busy} onClick={() => act(u, 'ban', `Permanently ban ${u.username}?`)} className={`${smallBtn} bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100`}>
                      Ban
                    </button>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
      <ListFooter list={list} />
    </div>
  )
}

/* ---------------- Tasks ---------------- */

function TasksTab() {
  const { showToast, refreshJobs } = useApp()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const q = useDebounced(search)
  const list = usePagedList('/admin/tasks', 'tasks', `status=${status}&search=${encodeURIComponent(q)}`)

  const cancel = async (t) => {
    if (!window.confirm(`Take down ${t.id} "${t.title}"? It will be cancelled for everyone.`)) return
    try {
      const data = await adminApi(`/admin/tasks/${encodeURIComponent(t.id)}/cancel`, { method: 'POST' })
      list.setItems((items) => items.map((x) => (x.id === t.id ? { ...x, status: 'cancelled' } : x)))
      refreshJobs()
      showToast(data.message, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className={`${card} p-4 sm:p-6 space-y-4`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, title, area or category…" className={fieldCls} aria-label="Search tasks" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${fieldCls} sm:w-44`} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="accepted">In progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <p className="text-xs font-semibold text-slate-500">{fmtNum(list.total)} tasks</p>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[720px] text-xs">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="py-2 px-2">Task</th>
              <th className="py-2 px-2">Area</th>
              <th className="py-2 px-2 text-right">Reward</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Poster → Helper</th>
              <th className="py-2 px-2">Posted</th>
              <th className="py-2 px-2" />
            </tr>
          </thead>
          <tbody>
            {list.items.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 align-top">
                <td className="py-2.5 px-2">
                  <p className="font-bold text-slate-900">{t.title}</p>
                  <p className="text-slate-500">
                    {t.id} · {t.category} · {t.urgency}
                  </p>
                </td>
                <td className="py-2.5 px-2">{t.area}</td>
                <td className="py-2.5 px-2 text-right font-bold">₹{fmtNum(t.reward)}</td>
                <td className="py-2.5 px-2">
                  <Chip tone={t.status}>{t.status === 'accepted' ? 'in progress' : t.status}</Chip>
                  {t.rating && <p className="mt-1 text-amber-600 font-bold">{t.rating}★</p>}
                </td>
                <td className="py-2.5 px-2">
                  <p>{t.poster}</p>
                  {t.helper && <p className="text-slate-500">→ {t.helper}</p>}
                </td>
                <td className="py-2.5 px-2 whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                <td className="py-2.5 px-2 text-right">
                  {(t.status === 'open' || t.status === 'accepted') && (
                    <button type="button" onClick={() => cancel(t)} className={`${smallBtn} bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100`}>
                      Take down
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ListFooter list={list} />
    </div>
  )
}

/* ---------------- Tickets ---------------- */

const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved']

function TicketsTab() {
  const { showToast } = useApp()
  const [status, setStatus] = useState('Open')
  const list = usePagedList('/admin/tickets', 'tickets', `status=${encodeURIComponent(status)}`)

  const setTicketStatus = async (t, next) => {
    try {
      const data = await adminApi(`/admin/tickets/${encodeURIComponent(t.id)}`, { method: 'PATCH', body: { status: next } })
      list.setItems((items) => items.map((x) => (x.id === t.id ? { ...x, status: data.status } : x)))
      showToast(data.message, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className={`${card} p-4 sm:p-6 space-y-4`}>
      <div className="flex flex-wrap gap-2">
        {['', ...TICKET_STATUSES].map((s) => (
          <button
            key={s || 'all'}
            type="button"
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${status === s ? 'bg-[#0F5257] text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>
      <p className="text-xs font-semibold text-slate-500">{fmtNum(list.total)} tickets</p>

      <div className="space-y-2.5">
        {list.items.map((t) => (
          <div key={t.id} className="p-3.5 rounded-2xl border border-slate-200 bg-[#F6F5F2]/60 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-extrabold text-slate-900 text-sm">
                  {t.id} · {t.title}
                </p>
                <p className="text-xs text-slate-600">
                  {t.user}
                  {t.email ? ` · ${t.email}` : ''} · {fmtDate(t.createdAt)}
                </p>
              </div>
              <Chip tone={t.status}>{t.status}</Chip>
            </div>
            {t.reference && <p className="text-xs font-semibold text-slate-700">Ref: {t.reference}</p>}
            <p className="text-xs text-slate-800 whitespace-pre-wrap break-words">{t.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {TICKET_STATUSES.filter((s) => s !== t.status).map((s) => (
                <button key={s} type="button" onClick={() => setTicketStatus(t, s)} className={`${smallBtn} bg-white border border-slate-200 hover:bg-slate-100`}>
                  Mark {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ListFooter list={list} />
    </div>
  )
}

/* ---------------- SOS ---------------- */

function SosTab() {
  const { showToast } = useApp()
  const [handled, setHandled] = useState('false')
  const list = usePagedList('/admin/sos', 'alerts', `handled=${handled}`)

  const toggle = async (a) => {
    try {
      const data = await adminApi(`/admin/sos/${a.id}`, { method: 'PATCH', body: { handled: !a.handled } })
      list.setItems((items) => items.map((x) => (x.id === a.id ? { ...x, handled: data.handled } : x)))
      showToast(data.message, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className={`${card} p-4 sm:p-6 space-y-4`}>
      <div className="flex flex-wrap gap-2">
        {[
          ['false', 'Unhandled'],
          ['true', 'Handled'],
          ['', 'All'],
        ].map(([v, l]) => (
          <button
            key={l}
            type="button"
            onClick={() => setHandled(v)}
            aria-pressed={handled === v}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${handled === v ? 'bg-rose-700 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="text-xs font-semibold text-slate-500">{fmtNum(list.total)} alerts</p>

      <div className="space-y-2.5">
        {list.items.map((a) => (
          <div
            key={a.id}
            className={`p-3.5 rounded-2xl border flex flex-wrap items-start justify-between gap-3 ${a.handled ? 'border-slate-200 bg-white/60' : 'border-rose-200 bg-rose-50/70'}`}
          >
            <div className="min-w-0 text-xs space-y-0.5">
              <p className="font-extrabold text-slate-900 text-sm">
                {a.handled ? '✓ Handled' : '🚨 Unhandled'} · {a.user}
              </p>
              <p className="text-slate-600">
                {fmtDate(a.createdAt)}
                {a.phone ? ` · 📞 ${a.phone}` : ''} · IP {a.ip || '—'}
              </p>
              {a.lat != null ? (
                <a
                  href={`https://www.google.com/maps?q=${a.lat},${a.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block font-bold text-[#0F5257] hover:underline"
                >
                  📍 {a.lat.toFixed(5)}, {a.lng.toFixed(5)}
                  {a.accuracyM ? ` (±${Math.round(a.accuracyM)} m)` : ''} — open map
                </a>
              ) : (
                <p className="text-slate-500">No GPS shared</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggle(a)}
              className={`${smallBtn} ${a.handled ? 'bg-white border border-slate-200 hover:bg-slate-100' : 'bg-rose-700 text-white hover:bg-rose-800'}`}
            >
              {a.handled ? 'Reopen' : 'Mark handled'}
            </button>
          </div>
        ))}
      </div>
      <ListFooter list={list} />
    </div>
  )
}

/* ---------------- Panel (site settings) ---------------- */

const PANEL_FIELDS = [
  {
    key: 'siteDomain',
    label: 'Site domain',
    hint: 'Without https:// — used for referral links, canonical URLs and the footer.',
    placeholder: 'sevamein.com',
  },
  { key: 'grievanceOfficerName', label: 'Grievance officer name', hint: 'Shown on Support and Privacy Policy (IT Rules 2021 & DPDP Act 2023).' },
  { key: 'grievanceEmail', label: 'Grievance email', type: 'email', hint: 'Shown on Support, Privacy Policy and Google structured data.' },
  { key: 'jurisdiction', label: 'Jurisdiction', hint: 'Legal jurisdiction shown on Support and Privacy Policy.' },
  { key: 'emergencyNumber', label: 'Emergency number', inputMode: 'tel', hint: 'Used by every SOS button and “Call” link.' },
]

function PanelTab() {
  const { showToast, setSite } = useApp()
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(null)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState({})
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setError('')
    try {
      const { settings } = await adminApi('/admin/settings')
      setForm(settings)
      setSaved(settings)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (error && !form) {
    return (
      <div className={`${card} p-6 text-sm text-rose-700`}>
        {error}{' '}
        <button type="button" onClick={load} className="font-bold underline">
          Retry
        </button>
      </div>
    )
  }
  if (!form) return <div className="h-96 rounded-[1.75rem] bg-white/70 border border-slate-200/80 animate-pulse" aria-label="Loading panel" />

  const dirty = PANEL_FIELDS.some(({ key }) => form[key] !== saved[key])
  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setFieldError((fe) => ({ ...fe, [key]: undefined }))
  }

  const save = async (e) => {
    e.preventDefault()
    const missing = PANEL_FIELDS.find(({ key }) => !String(form[key] || '').trim())
    if (missing) {
      setFieldError({ [missing.key]: 'Required.' })
      return
    }
    setBusy(true)
    setFieldError({})
    try {
      const body = Object.fromEntries(PANEL_FIELDS.map(({ key }) => [key, form[key]]))
      const data = await adminApi('/admin/settings', { method: 'PUT', body })
      setForm(data.settings)
      setSaved(data.settings)
      setSite((s) => ({ ...s, ...data.settings })) // update the live site straight away
      showToast(data.message, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} noValidate className={`${card} p-5 sm:p-7 space-y-5`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 font-display">Site Panel</h2>
          <p className="text-xs text-slate-600">Contact and legal details used across the Seva Mein site. Saved in the database.</p>
        </div>
        <p className="text-[11px] text-slate-500">
          Last saved: {saved.updatedAt ? fmtDate(saved.updatedAt) : 'never (showing defaults)'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {PANEL_FIELDS.map((f) => (
          <div key={f.key} className={f.key === 'jurisdiction' ? 'md:col-span-2' : ''}>
            <label htmlFor={`panel-${f.key}`} className="block text-xs font-bold text-slate-700 mb-1">
              {f.label}
            </label>
            <input
              id={`panel-${f.key}`}
              type={f.type || 'text'}
              inputMode={f.inputMode}
              placeholder={f.placeholder}
              value={form[f.key] || ''}
              onChange={set(f.key)}
              aria-invalid={!!fieldError[f.key]}
              className={fieldCls}
            />
            {fieldError[f.key] ? (
              <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldError[f.key]}</p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">{f.hint}</p>
            )}
          </div>
        ))}
      </div>

      <p className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
        Changes go live as soon as you save — pages, SOS buttons, referral links, SEO tags and Google structured data all read these values from the
        backend. No rebuild or redeploy needed.
      </p>

      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          disabled={!dirty || busy}
          onClick={() => {
            setForm(saved)
            setFieldError({})
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          Discard changes
        </button>
        <button
          type="submit"
          disabled={!dirty || busy}
          className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-md transition-all disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save Panel'}
        </button>
      </div>
    </form>
  )
}

/* ---------------- Page ---------------- */

// Checks the stored admin token with the server; 'checking' | 'ok' | 'out'.
function useAdminSession() {
  const [state, setState] = useState(() => (getAdminToken() ? 'checking' : 'out'))
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    if (!getAdminToken()) return
    adminApi('/admin/me')
      .then((data) => {
        setAdmin(data.admin)
        setState('ok')
      })
      .catch(() => {
        setAdminToken(null)
        setState('out')
      })
  }, [])

  useEffect(() => {
    const onLogout = () => setState('out')
    window.addEventListener(ADMIN_LOGOUT_EVENT, onLogout)
    return () => window.removeEventListener(ADMIN_LOGOUT_EVENT, onLogout)
  }, [])

  const signOut = () => {
    setAdminToken(null)
    setState('out')
  }

  return { state, admin, signOut }
}

function Admin() {
  const { showToast } = useApp()
  const navigate = useNavigate()
  const session = useAdminSession()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'overview'
  const goTo = (key) => setParams(key === 'overview' ? {} : { tab: key }, { replace: true })

  if (session.state === 'out') return <Navigate to="/admin/login" replace />
  if (session.state === 'checking') return <div className="h-96 rounded-[1.75rem] bg-white/70 border border-slate-200/80 animate-pulse" aria-label="Loading" />

  const signOut = () => {
    session.signOut()
    showToast('Signed out of the admin dashboard.', 'success')
    navigate('/admin/login', { replace: true })
  }

  return (
    <section className="app-view space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F5257]">Seva Mein Admin</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-500">Signed in as {session.admin?.username}</p>
          <button type="button" onClick={signOut} className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100/80 overflow-x-auto no-scrollbar" role="tablist" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => goTo(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              tab === t.key ? 'bg-white text-[#0F5257] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview goTo={goTo} />}
      {tab === 'users' && <UsersTab />}
      {tab === 'tasks' && <TasksTab />}
      {tab === 'tickets' && <TicketsTab />}
      {tab === 'sos' && <SosTab />}
      {tab === 'panel' && <PanelTab />}
    </section>
  )
}

export default Admin
