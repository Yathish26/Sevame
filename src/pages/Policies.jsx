import { Link } from 'react-router-dom'
import { AffiliateSection, PolicyPage, PrivacySection, TermsSection, TrustSection } from '../components/PolicySections.jsx'

function Policies() {
  return (
    <PolicyPage
      kicker="Legal & Governance Charter"
      title="Terms & Conditions, Privacy Policy & Trust Rules"
      subtitle="Clear, plain-English policies governing Seva Mein in Mangaluru."
      aside={
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link to="/terms-and-conditions" className="px-3 py-1.5 rounded-full bg-teal-50 text-[#0F5257] border border-teal-200 hover:bg-teal-100 transition-colors">
            Terms only
          </Link>
          <Link to="/privacy-policy" className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors">
            Privacy only
          </Link>
        </div>
      }
    >
      <div className="grid md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <TermsSection />
        <PrivacySection />
        <TrustSection />
        <AffiliateSection />
      </div>
    </PolicyPage>
  )
}

export default Policies
