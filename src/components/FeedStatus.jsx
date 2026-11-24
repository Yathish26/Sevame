// Loading skeleton or error box for the task feed (Home + Browse).
function FeedStatus({ status, onRetry }) {
  if (status === 'loading') {
    return (
      <div className="col-span-full grid md:grid-cols-2 lg:grid-cols-3 gap-5" aria-label="Loading tasks">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-72 rounded-[1.75rem] bg-white/70 border border-slate-200/80 animate-pulse" />
        ))}
      </div>
    )
  }
  return (
    <div className="col-span-full bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-rose-200/80 p-8 text-center text-sm text-slate-600 shadow-lg space-y-3">
      <p>Couldn&apos;t load tasks right now.</p>
      <button type="button" onClick={onRetry} className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#0F5257] text-white hover:bg-teal-900 transition-colors">
        Try again
      </button>
    </div>
  )
}

export default FeedStatus
