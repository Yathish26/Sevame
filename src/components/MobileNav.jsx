import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/browse', label: 'Browse', icon: '🗂️' },
  { to: '/post', label: 'Post', primary: true },
  { to: '/support', label: 'Tickets', icon: '🎫' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/90 glass-bar border-t border-slate-200/80 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 h-16 items-center text-[11px] font-bold">
        {items.map((item) =>
          item.primary ? (
            <NavLink key={item.to} to={item.to} className="flex flex-col items-center justify-center -mt-4">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F5257] to-teal-800 text-amber-400 flex items-center justify-center text-xl font-extrabold shadow-lg shadow-teal-900/30 ring-2 ring-amber-400/30">
                +
              </span>
              <span className="text-slate-700 mt-0.5">{item.label}</span>
            </NavLink>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive ? 'text-[#0F5257]' : 'text-slate-500'}`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ),
        )}
      </div>
    </nav>
  )
}

export default MobileNav
