import { Link } from 'react-router-dom'
import { useApp } from '../context/app-context.js'
import { SITE_DOMAIN, SITE_URL } from '../master.js'

function Footer() {
  const { openModal } = useApp()

  return (
    <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 pb-6 border-t border-slate-200/80 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link to="/" className="inline-flex items-center rounded-lg bg-black px-2 py-1.5" aria-label="Seva Mein home">
          <img src="/logo.png" alt={`Seva Mein — ${SITE_DOMAIN}`} className="h-4 w-auto" />
        </Link>
        <p>
          © {new Date().getFullYear()} <strong className="text-slate-800">Seva Mein</strong> (
          <a href={SITE_URL} className="font-semibold text-[#0F5257] hover:underline">
            {SITE_DOMAIN}
          </a>
          ) • Mangaluru Peer-to-Peer Task Marketplace (Section 79 Intermediary).
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 font-semibold">
        <Link to="/terms-and-conditions" className="hover:text-[#0F5257] transition-colors">
          Terms &amp; Conditions
        </Link>
        <Link to="/privacy-policy" className="hover:text-[#0F5257] transition-colors">
          Privacy Policy
        </Link>
        <Link to="/support" className="hover:text-[#0F5257] transition-colors">
          Tickets &amp; Complaints
        </Link>
        <button type="button" onClick={() => openModal('sos')} className="text-rose-600 hover:text-rose-700 hover:underline transition-colors">
          SOS Safety
        </button>
      </div>
    </footer>
  )
}

export default Footer
