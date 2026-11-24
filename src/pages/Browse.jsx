import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import { BROWSE_AREAS, CATEGORIES } from '../data/demo.js'
import JobCard from '../components/JobCard.jsx'
import FeedStatus from '../components/FeedStatus.jsx'

const DEFAULTS = { search: '', area: 'All', category: 'All', sort: 'recent', urgentOnly: false }

function Browse() {
  const { jobs, jobsStatus, refreshJobs } = useApp()
  const [params] = useSearchParams()
  const [filters, setFilters] = useState(() => ({
    ...DEFAULTS,
    category: CATEGORIES.some((c) => c.name === params.get('category')) ? params.get('category') : 'All',
    area: BROWSE_AREAS.some((a) => a.value === params.get('area')) ? params.get('area') : 'All',
  }))

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFilters((f) => ({ ...f, [key]: value }))
  }
  const clear = () => setFilters(DEFAULTS)

  const list = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    let out = [...jobs]
    if (q) {
      out = out.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.posterUsername.toLowerCase().includes(q) ||
          j.area.toLowerCase().includes(q),
      )
    }
    if (filters.area !== 'All') out = out.filter((j) => j.area.toLowerCase().includes(filters.area.toLowerCase()))
    if (filters.category !== 'All') out = out.filter((j) => j.category === filters.category)
    if (filters.urgentOnly) out = out.filter((j) => j.urgency === 'High')
    if (filters.sort === 'rewardHigh') out.sort((a, b) => b.reward - a.reward)
    else if (filters.sort === 'trustHigh') out.sort((a, b) => b.posterTrust - a.posterTrust || b.posterTotalPoints - a.posterTotalPoints)
    return out
  }, [jobs, filters])

  const labelCls = 'block text-xs font-bold text-slate-700 mb-1'
  const fieldCls = 'field px-3.5 py-2.5 rounded-xl'

  return (
    <section className="app-view space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-5 sm:p-7 shadow-lg shadow-slate-200/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F5257]">Explore Mangaluru</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Browse Jobs &amp; Opportunities</h1>
          </div>
          <button type="button" onClick={clear} className="self-start sm:self-center text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline transition-colors">
            Clear all filters
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="sm:col-span-2">
            <label htmlFor="browseSearch" className={labelCls}>
              Search
            </label>
            <input
              id="browseSearch"
              type="text"
              value={filters.search}
              onChange={set('search')}
              placeholder="Job title, campus, or @username..."
              className={fieldCls}
            />
          </div>
          <div>
            <label htmlFor="browseArea" className={labelCls}>
              Location / Area
            </label>
            <select id="browseArea" value={filters.area} onChange={set('area')} className={fieldCls}>
              {BROWSE_AREAS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="browseCategory" className={labelCls}>
              Category
            </label>
            <select id="browseCategory" value={filters.category} onChange={set('category')} className={fieldCls}>
              <option value="All">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="browseSort" className={labelCls}>
              Sort by
            </label>
            <select id="browseSort" value={filters.sort} onChange={set('sort')} className={fieldCls}>
              <option value="recent">Recently posted</option>
              <option value="rewardHigh">Highest reward (₹)</option>
              <option value="trustHigh">Highest Trust Score</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer group">
            <input type="checkbox" checked={filters.urgentOnly} onChange={set('urgentOnly')} className="accent-[#0F5257] cursor-pointer" />
            <span className="group-hover:text-[#0F5257] transition-colors">Urgent tasks only</span>
          </label>
          <p className="text-xs sm:text-sm font-bold text-slate-600 bg-slate-100/80 px-3 py-1 rounded-full">
            {list.length} opportunit{list.length === 1 ? 'y' : 'ies'} found
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobsStatus !== 'ready' ? (
          <FeedStatus status={jobsStatus} onRetry={refreshJobs} />
        ) : list.length === 0 ? (
          <div className="col-span-full bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-10 text-center space-y-3 shadow-lg animate-fade-up">
            <p className="text-lg font-extrabold text-slate-900">No matching opportunities</p>
            <p className="text-sm text-slate-600">Try another Mangaluru locality or clear your active filters.</p>
            <button
              type="button"
              onClick={clear}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 text-white shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          list.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </section>
  )
}

export default Browse
