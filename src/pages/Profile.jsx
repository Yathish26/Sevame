import { Link } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import { TRUST_RULES } from '../data/demo.js'
import MyTaskCard from '../components/MyTaskCard.jsx'
import SignInCard from '../components/SignInCard.jsx'
import { MetricCards, ProfileHeader } from '../components/ProfileCard.jsx'

const cardCls = 'bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 shadow-lg'

function Profile() {
  const { user, myTasks, openModal, logout } = useApp()

  if (!user) {
    return (
      <section className="app-view max-w-xl mx-auto">
        <div className={`${cardCls} p-6 sm:p-8`}>
          <SignInCard title="Your Seva Mein profile" text="Sign in to see your Trust Score, points, posted requests and tasks you're helping with." />
        </div>
      </section>
    )
  }

  return (
    <section className="app-view space-y-6">
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className={`lg:col-span-8 ${cardCls} p-5 sm:p-6 shadow-slate-200/50 space-y-5`}>
          <ProfileHeader
            actions={
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => openModal('kyc')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  KYC Details
                </button>
                <button type="button" onClick={logout} className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors">
                  Sign out
                </button>
              </>
            }
          />
          <MetricCards />

          <div className="space-y-2 text-xs">
            <p className="font-extrabold uppercase tracking-wider text-slate-500">Recent Activity</p>
            {user.recentActivity.length === 0 && <p className="text-slate-500">Complete your first task to start earning points.</p>}
            {user.recentActivity.map((a, i) => (
              <div
                key={`${a.at}-${i}`}
                className="p-3 rounded-xl bg-gradient-to-r from-[#F6F5F2] to-slate-50 border border-slate-200 flex justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <span>{a.label}</span>
                {a.points > 0 && <span className="font-bold text-emerald-700 shrink-0">+{a.points} Total Pts</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className={`${cardCls} p-6 shadow-slate-200/40 space-y-3`}>
            <h2 className="text-base font-extrabold text-slate-900 font-display">30-Point Trust Score Rules</h2>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {TRUST_RULES.map(([head, body]) => (
                <li key={head} className="flex items-start gap-2">
                  <span className="text-[#0F5257] font-bold">•</span>
                  <span>
                    <strong>{head}</strong> {body}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-100/95 via-orange-50 to-rose-50/80 rounded-[1.75rem] border border-amber-300/80 p-6 shadow-lg shadow-amber-200/40 space-y-2">
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-md">
              🔥 Refer &amp; Earn 10%
            </span>
            <p className="text-xs text-slate-700 break-all">
              Your link: <strong>{user.affiliateLink}</strong>
            </p>
            <Link to="/" className="inline-block text-xs font-bold text-[#0F5257] hover:underline">
              Copy from the home page →
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Your Posted Requests</h2>
          <Link to="/post" className="text-sm font-bold text-[#0F5257] hover:underline shrink-0">
            + Post new
          </Link>
        </div>
        {myTasks.posted.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myTasks.posted.map((task) => (
              <MyTaskCard key={task.id} task={task} role="poster" />
            ))}
          </div>
        ) : (
          <div className={`${cardCls} p-8 text-center text-sm text-slate-600`}>
            You haven&apos;t posted any requests yet.{' '}
            <Link to="/post" className="font-bold text-[#0F5257] hover:underline">
              Post your first task →
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Tasks You&apos;re Helping With</h2>
          <Link to="/browse" className="text-sm font-bold text-[#0F5257] hover:underline shrink-0">
            Find tasks →
          </Link>
        </div>
        {myTasks.helping.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myTasks.helping.map((task) => (
              <MyTaskCard key={task.id} task={task} role="helper" />
            ))}
          </div>
        ) : (
          <div className={`${cardCls} p-8 text-center text-sm text-slate-600`}>
            You haven&apos;t accepted any tasks yet.{' '}
            <Link to="/browse" className="font-bold text-[#0F5257] hover:underline">
              Browse open tasks →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default Profile
