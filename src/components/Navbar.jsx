import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'Profile' },
]

function Navbar() {
  return (
    <header className="bg-black border-b border-white/10">
      <nav className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center gap-4 sm:gap-6">
        <Link to="/" className="mr-auto">
          <img src="/logo.png" alt="Seva Mein" className="h-6 sm:h-8 w-auto" />
        </Link>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              isActive
                ? 'text-sm sm:text-base text-brand font-semibold'
                : 'text-sm sm:text-base text-white/70 hover:text-white'
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
