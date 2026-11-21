import { Link } from 'react-router-dom'
import { AffiliateSection, PolicyPage, TermsSection, TrustSection } from '../components/PolicySections.jsx'

function TermsAndConditions() {
  return (
    <PolicyPage
      kicker="Legal & Governance Charter"
      title="Terms & Conditions"
      subtitle="The rules for posting, accepting and completing tasks on Seva Mein in Mangaluru."
      aside={
        <Link to="/privacy-policy" className="self-start text-xs font-bold text-[#0F5257] hover:underline">
          Read the Privacy Policy →
        </Link>
      }
    >
      <div className="grid gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <TermsSection />
        <TrustSection />
        <AffiliateSection />
      </div>
    </PolicyPage>
  )
}

export default TermsAndConditions
