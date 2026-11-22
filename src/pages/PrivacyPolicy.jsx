import { Link } from 'react-router-dom'
import { PolicyPage, PrivacySection } from '../components/PolicySections.jsx'

function PrivacyPolicy() {
  return (
    <PolicyPage
      kicker="Legal & Governance Charter"
      title="Privacy Policy"
      subtitle="How Seva Mein handles your identity, location and account data (DPDP Act 2023)."
      aside={
        <Link to="/terms-and-conditions" className="self-start text-xs font-bold text-[#0F5257] hover:underline">
          Read the Terms &amp; Conditions →
        </Link>
      }
    >
      <div className="grid gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <PrivacySection />
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#F6F5F2] to-slate-50 border border-slate-200/80 space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">Grievance &amp; Nodal Officer</h2>
          <p>
            <strong>Grievance Officer:</strong> [Insert Officer Name]
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:grievance@sevamein.com" className="text-[#0F5257] hover:underline">
              grievance@sevamein.com
            </a>
          </p>
          <p>
            <strong>Jurisdiction:</strong> Mangaluru, Dakshina Kannada, Karnataka
          </p>
        </div>
      </div>
    </PolicyPage>
  )
}

export default PrivacyPolicy
