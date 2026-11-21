import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import { CATEGORIES, HOME_AREAS } from '../data/demo.js'
import JobCard from '../components/JobCard.jsx'
import { MetricCards, ProfileHeader } from '../components/ProfileCard.jsx'

function Hero() {
  const { openModal } = useApp()
  const navigate = useNavigate()

  const shortcuts = [
    {
      onClick: () => openModal('sos'),
      cls: 'bg-gradient-to-br from-rose-500/25 to-rose-600/15 hover:from-rose-500/35 hover:to-rose-600/25 border-rose-400/40 hover:shadow-rose-900/30',
      kicker: 'Emergency',
      kickerCls: 'text-rose-200',
      icon: '🚨',
      title: 'SOS & GPS Alert',
      sub: 'Instant 112 & live location log',
      subCls: 'text-rose-100/70',
    },
    {
      onClick: () => openModal('ticket'),
      cls: 'bg-gradient-to-br from-amber-400/20 to-amber-500/10 hover:from-amber-400/30 hover:to-amber-500/20 border-amber-300/35 hover:shadow-amber-900/20',
      kicker: 'Help Desk',
      kickerCls: 'text-amber-300',
      icon: '🎫',
      title: 'Tickets & Complaints',
      sub: 'Report dispute or rule breach',
      subCls: 'text-teal-100/70',
    },
    {
      onClick: () => openModal('kyc'),
      cls: 'bg-white/10 hover:bg-white/15 border-white/15',
      kicker: 'Identity',
      kickerCls: 'text-emerald-300',
      icon: '🛡️',
      title: 'DigiLocker KYC',
      sub: 'Verify or check badge status',
      subCls: 'text-teal-100/70',
    },
    {
      onClick: () => navigate('/policies'),
      cls: 'bg-white/10 hover:bg-white/15 border-white/15',
      kicker: 'Legal & Rules',
      kickerCls: 'text-sky-300',
      icon: '📜',
      title: 'Terms & Privacy',
      sub: 'Trust Score & Safety Charter',
      subCls: 'text-teal-100/70',
    },
  ]

  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-[#0A3D40] via-[#0F5257] to-[#062B2E] text-white p-6 sm:p-9 lg:p-10 shadow-2xl relative overflow-hidden border border-teal-600/40 ring-1 ring-white/10">
      <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl animate-float-medium" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-48 h-48 rounded-3xl bg-gradient-to-br from-amber-300/10 to-transparent rotate-12 backdrop-blur-sm border border-white/5 animate-float-fast" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full border border-amber-300/20 animate-float-slow" />

      <div className="grid lg:grid-cols-12 gap-7 items-center relative z-10">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-amber-300/40 text-xs font-bold text-amber-300 shadow-lg backdrop-blur-sm">
            <span className="text-base">✨</span>
            <span>Mangaluru Campus &amp; Neighborhood Network</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold tracking-tight leading-[1.08] font-display gradient-text hero-glow">
            Get help nearby,
            <br className="hidden sm:block" /> in minutes.
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-xl leading-relaxed">
            Post a task, compare offers from KYC-verified locals &amp; students across Surathkal, Bejai, Kadri, Kottara &amp; Hampankatta, and pay safely in ₹.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/post"
              className="btn-glow px-7 py-3.5 rounded-full text-sm sm:text-base font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              + Post a request
            </Link>
            <Link
              to="/browse"
              className="px-5 py-3.5 rounded-full text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm transition-all hover:border-white/40"
            >
              Browse All Jobs
            </Link>
          </div>
          <p className="text-xs text-teal-200/80 flex items-start gap-1.5 pt-1">
            <span>🔒</span> Your exact home address is never shown publicly. Helpers only see an approximate area &amp; coverage radius.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {shortcuts.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={s.onClick}
              className={`group p-4 rounded-2xl border text-left transition-all hover:scale-[1.03] hover:shadow-xl backdrop-blur-sm ${s.cls}`}
            >
              <span className={`text-xs font-extrabold uppercase tracking-wider ${s.kickerCls}`}>{s.kicker}</span>
              <p className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-1.5">
                <span className="text-lg group-hover:rotate-12 transition-transform">{s.icon}</span> {s.title}
              </p>
              <p className={`text-xs mt-0.5 ${s.subCls}`}>{s.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AffiliateCard() {
  const { user, showToast } = useApp()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(user.affiliateLink)
      showToast('Affiliate link copied! Earn 10% once after referral completes first task.', 'success')
    } catch {
      showToast('Could not copy automatically — select the link and press Ctrl+C / Cmd+C.', 'warn')
    }
  }

  return (
    <div className="lg:col-span-5 bg-gradient-to-br from-amber-100/95 via-orange-50 to-rose-50/80 rounded-[1.75rem] border border-amber-300/80 p-5 sm:p-6 shadow-lg shadow-amber-200/40 card-lift flex flex-col justify-between gap-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-400/25 blur-2xl animate-float-medium" />
      <div className="pointer-events-none absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-rose-300/20 blur-2xl animate-float-slow" />
      <div className="space-y-2.5 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-md badge-pulse">
            🔥 LIMITED OFFER
          </span>
          <span className="text-xs font-bold text-amber-900">One-Time Payout Rule</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
          Refer &amp; Earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">10%</span> Commission
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Share your Mangaluru campus &amp; neighborhood invite link. You earn <strong>10% once</strong> on your referred friend&apos;s{' '}
          <strong>first completed task</strong>.
        </p>
      </div>

      <div className="space-y-2.5 relative z-10">
        <label htmlFor="affiliateInput" className="block text-[11px] font-bold uppercase tracking-wider text-amber-950">
          Your Unique Affiliate Link
        </label>
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl border-2 border-amber-300/80 shadow-md">
          <input
            id="affiliateInput"
            type="text"
            readOnly
            value={user.affiliateLink}
            onFocus={(e) => e.target.select()}
            className="w-full min-w-0 bg-transparent px-2.5 py-1.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none"
          />
          <button
            type="button"
            onClick={copy}
            className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Copy Link
          </button>
        </div>
        <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-amber-200/80 text-[11px] text-slate-700">
          <p>
            <strong>Transfer Condition:</strong> Earnings are transferred to your verified UPI/bank only <em>after</em> the referred user&apos;s first task is
            completed and OTP-confirmed. Each referral pays out once.
          </p>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const { jobs } = useApp()
  const navigate = useNavigate()
  const [activeArea, setActiveArea] = useState('All')

  const filtered = activeArea === 'All' ? jobs : jobs.filter((j) => j.area.toLowerCase().includes(activeArea.toLowerCase()))

  return (
    <section className="app-view space-y-7">
      <Hero />

      {/* Profile + affiliate */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-5 sm:p-6 shadow-lg shadow-slate-200/50 card-lift flex flex-col justify-between gap-5">
          <ProfileHeader
            actions={
              <Link to="/profile" className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                Full Profile
              </Link>
            }
          />
          <MetricCards />
        </div>
        <AffiliateCard />
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Categories</h2>
            <p className="text-xs sm:text-sm text-slate-600">Tap a category to filter active tasks in Mangaluru</p>
          </div>
          <Link to="/browse" className="text-sm font-bold text-[#0F5257] hover:underline flex items-center gap-1 group shrink-0">
            See all <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => navigate(`/browse?category=${encodeURIComponent(c.name)}`)}
              className="cat-card card-lift bg-white/90 backdrop-blur-sm hover:border-[#0F5257]/50 rounded-2xl border border-slate-200/80 p-4 text-center shadow-sm"
            >
              <span className={`cat-emoji w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${c.tint} text-2xl flex items-center justify-center mb-2 shadow-inner`}>
                {c.emoji}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F5257] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Mangaluru Feed
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Top Opportunities &amp; Active Tasks</h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            {HOME_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setActiveArea(area)}
                className={
                  activeArea === area
                    ? 'px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#0F5257] to-teal-800 text-white shrink-0 shadow-md shadow-teal-900/20'
                    : 'px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 shrink-0 transition-all'
                }
              >
                {area === 'All' ? 'All Mangaluru' : area}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-8 text-center text-sm text-slate-600 shadow-lg">
            No active tasks in {activeArea} right now.{' '}
            <Link to="/post" className="font-bold text-[#0F5257] hover:underline">
              Post the first one →
            </Link>
          </div>
        )}
      </div>

      {/* How it works + ground rules */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 shadow-lg shadow-slate-200/40 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 font-display">How Seva Mein Works</h2>
          <div className="space-y-3">
            {[
              ['1', 'from-teal-100 to-teal-200 text-[#0F5257]', 'to-teal-50/30 hover:border-teal-300/60', 'Describe your task, set area coverage radius, and choose reward budget in ₹'],
              ['2', 'from-amber-100 to-amber-200 text-amber-800', 'to-amber-50/30 hover:border-amber-300/60', 'KYC-verified peers nearby send offers with visible Trust Score & Total Points'],
              ['3', 'from-emerald-100 to-emerald-200 text-emerald-800', 'to-emerald-50/30 hover:border-emerald-300/60', 'Accept safety terms, verify via OTP handshake, upload proof & rate each other'],
            ].map(([n, badge, row, text]) => (
              <div key={n} className={`flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-[#F6F5F2] border border-slate-200/70 transition-colors ${row}`}>
                <span className={`w-8 h-8 rounded-full bg-gradient-to-br font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm ${badge}`}>{n}</span>
                <p className="text-sm font-semibold text-slate-800">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 shadow-lg shadow-slate-200/40 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 font-display">Basic Ground Rules</h2>
            <Link to="/policies" className="text-xs font-bold text-[#0F5257] hover:underline flex items-center gap-1 group shrink-0">
              Full Charter <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span>
                <strong>Mandatory KYC:</strong> DigiLocker verification required before posting or accepting tasks.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span>
                <strong>Two-Strike Ban:</strong> Dropping to 0/30 Trust Score triggers a 30-day pause; a second offense results in a permanent KYC-linked ban.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-600 font-bold mt-0.5">✕</span>
              <span>
                <strong>Strictly Prohibited:</strong> Cash/crypto transport, alcohol/tobacco, weapons, escort/adult requests, exam cheating, or unsafe isolated
                locations.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Home
