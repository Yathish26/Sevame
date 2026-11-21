import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import { CATEGORIES, POST_AREAS } from '../data/demo.js'

const INITIAL = {
  category: 'Quick jobs',
  title: '',
  description: '',
  photoName: '',
  area: 'Bejai',
  radius: 5,
  deadline: 'Tomorrow at 5:00 PM',
  urgency: 'Normal',
  reward: 250,
  maxLimit: 400,
  consent: false,
}

const primaryBtn =
  'py-3 rounded-full text-sm font-extrabold bg-gradient-to-r from-[#0F5257] to-teal-800 hover:from-teal-900 hover:to-teal-700 text-white transition-all shadow-md'
const backBtn = 'py-3 rounded-full text-sm font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors'
const labelCls = 'block text-xs font-bold text-slate-700 mb-1'
const fieldCls = 'field px-4 py-3 rounded-2xl'

function PostRequest() {
  const { user, addJob, showToast } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const goStep = (next) => {
    if (next === 3 && (!form.title.trim() || !form.description.trim())) {
      showToast('Please enter both a Task Title and Description before continuing.', 'warn')
      return
    }
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const publish = () => {
    if (!form.consent) {
      showToast('Please check "I Accept & Proceed" to confirm safety and intermediary terms.', 'error')
      return
    }
    const reward = Number(form.reward) || 200
    const maxBudget = Math.max(reward, Number(form.maxLimit) || reward)
    const job = {
      id: 'SM-' + Math.floor(200 + Math.random() * 799),
      title: form.title.trim(),
      category: form.category,
      area: form.area,
      coverageKm: Number(form.radius) || 5,
      reward,
      maxBudget,
      urgency: form.urgency,
      deadline: form.deadline.trim() || 'Tomorrow',
      description: form.description.trim(),
      posterName: user.name,
      posterUsername: user.username,
      posterKyc: user.kycVerified,
      posterTrust: user.trustScore,
      posterTotalPoints: user.totalPoints,
      posterBadge: user.badge,
    }
    addJob(job)
    setForm(INITIAL)
    setStep(1)
    showToast(`Task "${job.title}" published live to Mangaluru feed!`, 'success')
    navigate('/')
  }

  return (
    <section className="app-view max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Post a request</h1>
            <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 text-[#0F5257] border border-teal-200/80 shadow-sm">
              Step {step} of 4
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-gradient-to-r from-[#0F5257] to-teal-600 shadow-sm' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-5 animate-fade-up">
            <p className="text-sm text-slate-600">Choose the category that best fits your task in Mangaluru:</p>
            <div className="grid grid-cols-2 gap-3.5">
              {CATEGORIES.map((c) => {
                const selected = form.category === c.name
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => update('category', c.name)}
                    aria-pressed={selected}
                    className={`p-4 rounded-2xl text-left space-y-1.5 transition-all ${
                      selected
                        ? 'border-2 border-[#0F5257] bg-gradient-to-br from-teal-50 to-emerald-50/50 shadow-md'
                        : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <p className="text-sm font-extrabold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-600">{c.hint}</p>
                  </button>
                )
              })}
            </div>
            <button type="button" onClick={() => goStep(2)} className={`w-full ${primaryBtn} shadow-lg shadow-teal-900/20 hover:scale-[1.01] active:scale-[0.99]`}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <div>
              <label htmlFor="wizTitle" className={labelCls}>
                Topic / Task Title *
              </label>
              <input
                id="wizTitle"
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g., Collect bound lab manual from Surathkal print shop"
                className={fieldCls}
              />
            </div>
            <div>
              <label htmlFor="wizDesc" className={labelCls}>
                Description *
              </label>
              <textarea
                id="wizDesc"
                rows={4}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="What needs doing? Mention meeting point, timing, and any requirements helpers should know."
                className={fieldCls}
              />
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F5F2]/80 border border-dashed border-slate-300 space-y-2">
              <label htmlFor="wizPhoto" className="block text-xs font-bold text-slate-800">
                Reference Photo (Optional)
              </label>
              <input
                id="wizPhoto"
                type="file"
                accept="image/*"
                onChange={(e) => update('photoName', e.target.files?.[0]?.name || '')}
                className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F5257] file:text-white hover:file:bg-teal-900 file:transition-colors file:cursor-pointer cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                {form.photoName ? `Attached: ${form.photoName} (ready for task preview)` : 'Upload an item or venue reference photo (no personal IDs).'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => goStep(1)} className={backBtn}>
                Back
              </button>
              <button type="button" onClick={() => goStep(3)} className={primaryBtn}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-up">
            <div>
              <label htmlFor="wizArea" className={labelCls}>
                Area / Locality in Mangaluru *
              </label>
              <select id="wizArea" value={form.area} onChange={(e) => update('area', e.target.value)} className={fieldCls}>
                {POST_AREAS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Only an approximate area is shown publicly. Exact pin is shared only after task acceptance.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="wizRadius" className="text-xs font-bold text-slate-700">
                  Search Coverage Radius
                </label>
                <span className="text-xs font-extrabold text-[#0F5257] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">{form.radius} km</span>
              </div>
              <input
                id="wizRadius"
                type="range"
                min="1"
                max="15"
                value={form.radius}
                onChange={(e) => update('radius', Number(e.target.value))}
                className="range-brand w-full cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="wizDeadline" className={labelCls}>
                Deadline
              </label>
              <input id="wizDeadline" type="text" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} className={fieldCls} />
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1.5">Urgency</span>
              <div className="grid grid-cols-3 gap-2.5">
                {['Low', 'Normal', 'High'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => update('urgency', u)}
                    aria-pressed={form.urgency === u}
                    className={`py-2.5 rounded-full text-xs font-bold transition-all ${
                      form.urgency === u
                        ? 'border-2 border-[#0F5257] bg-gradient-to-r from-teal-50 to-emerald-50 text-[#0F5257] shadow-md'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => goStep(2)} className={backBtn}>
                Back
              </button>
              <button type="button" onClick={() => goStep(4)} className={primaryBtn}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fade-up">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="wizStartReward" className={labelCls}>
                  Starting reward (₹) *
                </label>
                <input
                  id="wizStartReward"
                  type="number"
                  min="50"
                  value={form.reward}
                  onChange={(e) => update('reward', e.target.value)}
                  className={`${fieldCls} font-bold`}
                />
              </div>
              <div>
                <label htmlFor="wizMaxLimit" className={labelCls}>
                  Maximum spending limit (₹)
                </label>
                <input
                  id="wizMaxLimit"
                  type="number"
                  min="50"
                  value={form.maxLimit}
                  onChange={(e) => update('maxLimit', e.target.value)}
                  className={`${fieldCls} font-bold`}
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">You can raise the reward later, but never above your maximum spending limit.</p>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 space-y-2.5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-950">Mandatory Safety &amp; Intermediary Consent</p>
              <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  className="mt-0.5 accent-[#0F5257] cursor-pointer"
                />
                <span className="group-hover:text-slate-900 transition-colors">
                  <strong>I Accept &amp; Proceed:</strong> I confirm this request is lawful, involves no prohibited items or unsafe venues, and complies with
                  Seva Mein&apos;s Section 79 Intermediary Terms &amp; 30-Point Trust Score rules.
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => goStep(3)} className={backBtn}>
                Back
              </button>
              <button
                type="button"
                onClick={publish}
                className="py-3 rounded-full text-sm font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Publish Task
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default PostRequest
