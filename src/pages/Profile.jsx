import { Link } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import { recentActivity, TRUST_RULES } from '../data/demo.js'
import JobCard from '../components/JobCard.jsx'
import { MetricCards, ProfileHeader } from '../components/ProfileCard.jsx'

function Profile() {
  const { user, jobs, openModal } = useApp()
  const myJobs = jobs.filter((j) => j.posterUsername === user.username)

  return (
    <section className="app-view space-y-6">
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-5 sm:p-6 shadow-lg shadow-slate-200/50 space-y-5">
          <ProfileHeader
            actions={
              <button
                type="button"
                onClick={() => openModal('kyc')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                KYC Details
              </button>
            }
          />
          <MetricCards />

          <div className="space-y-2 text-xs">
            <p className="font-extrabold uppercase tracking-wider text-slate-500">Recent Completed Activity</p>
            {recentActivity.map((a) => (
              <div
                key={a.label}
                className="p-3 rounded-xl bg-gradient-to-r from-[#F6F5F2] to-slate-50 border border-slate-200 flex justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <span>{a.label}</span>
                <span className="font-bold text-emerald-700 shrink-0">+{a.points} Total Pts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 shadow-lg shadow-slate-200/40 space-y-3">
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
        {myJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-8 text-center text-sm text-slate-600 shadow-lg">
            You haven&apos;t posted any requests yet.{' '}
            <Link to="/post" className="font-bold text-[#0F5257] hover:underline">
              Post your first task →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default Profile
