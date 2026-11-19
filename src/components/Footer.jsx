import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-center text-xs sm:text-sm text-white/60">
        <p>&copy; {new Date().getFullYear()} Sevame. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/privacy-policy" className="hover:text-brand">
            Privacy Policy
          </Link>
          <Link to="/terms-and-conditions" className="hover:text-brand">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
