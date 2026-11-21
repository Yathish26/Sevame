import { useApp } from '../context/app-context.js'

const styles = {
  success: 'bg-slate-900 text-white border-emerald-500',
  warn: 'bg-amber-950 text-amber-50 border-amber-400',
  error: 'bg-rose-900 text-white border-rose-400',
}

function Toasts() {
  const { toasts } = useApp()

  return (
    <div
      className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl border-l-4 text-xs sm:text-sm font-semibold transition-all duration-300 animate-fade-up ${
            styles[t.type] || styles.success
          } ${t.leaving ? 'opacity-0 translate-x-4' : ''}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

export default Toasts
