function PolicyCard({ id, tint, title, children }) {
  return (
    <div
      id={id}
      className={`scroll-mt-24 p-5 rounded-2xl bg-gradient-to-br from-[#F6F5F2] border border-slate-200/80 space-y-2.5 transition-colors ${tint}`}
    >
      <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
      {children}
    </div>
  )
}

export function TermsSection() {
  return (
    <PolicyCard id="terms" tint="to-teal-50/30 hover:border-teal-300/60" title="1. Terms & Conditions (Section 79 Intermediary)">
      <p>
        <strong>Platform Role:</strong> Seva Mein operates strictly as an online digital intermediary under Section 79 of the Information Technology Act,
        2000. We provide discovery, KYC onboarding, and accountability tools connecting independent Task Posters and Service Providers.
      </p>
      <p>
        <strong>No Employment or Agency:</strong> Users are independent peers—not employees, agents, contractors, or delivery staff of Seva Mein. Each user is
        solely responsible for lawful conduct, personal safety, and tax compliance.
      </p>
      <p>
        <strong>Jurisdiction:</strong> All disputes are governed by Indian law with exclusive jurisdiction of competent courts in{' '}
        <strong>Mangaluru, Karnataka</strong>.
      </p>
    </PolicyCard>
  )
}

export function PrivacySection() {
  return (
    <PolicyCard id="privacy" tint="to-amber-50/30 hover:border-amber-300/60" title="2. Privacy Policy (DPDP Act 2023 Compliant)">
      <p>
        <strong>Consented KYC &amp; Zero Raw Aadhaar Storage:</strong> Identity verification uses authorized DigiLocker / KYC APIs with your explicit consent.
        Seva Mein stores masked verification status and reference tokens—never raw Aadhaar numbers.
      </p>
      <p>
        <strong>Location Privacy:</strong> Public listings show only approximate neighborhood areas (e.g., Bejai, Surathkal) and radius. GPS coordinates are
        logged only during active safety/consent events or SOS triggers.
      </p>
      <p>
        <strong>Data Rights:</strong> Users may request data correction or account deletion via the Grievance Officer, subject to statutory fraud-prevention
        retention logs.
      </p>
    </PolicyCard>
  )
}

export function TrustSection() {
  return (
    <PolicyCard id="trust" tint="to-emerald-50/30 hover:border-emerald-300/60" title="3. 30-Point Trust Score & Uncapped Total Points">
      <p>
        <strong>Trust Score (0–30 Hard Cap):</strong> Every KYC-verified user starts at 30/30. Rule breaches deduct 5 points. Below 10 points, matching
        priority drops to the lowest tier and recovery points earn at <strong>50% value</strong> until restored to 10+.
      </p>
      <p>
        <strong>Escalation:</strong> First drop to 0 triggers a <strong>30-day suspension</strong>. A second drop to 0 (or any severe illegal/harassment
        violation) triggers an irreversible <strong>permanent ban</strong> tied to KYC identity.
      </p>
      <p>
        <strong>Total Points (Uncapped):</strong> Earned via completed tasks (+5) and verified peer reviews (+10 for 5★), unlocking badges (New Member,
        Verified Regular, Trusted Pro, Elite Pillar).
      </p>
    </PolicyCard>
  )
}

export function AffiliateSection() {
  return (
    <PolicyCard id="affiliate" tint="to-orange-50/30 hover:border-orange-300/60" title="4. Limited-Time 10% One-Time Affiliate Policy">
      <p>
        <strong>How It Works:</strong> Registered users receive a unique referral link. When a new user signs up via your link, completes DigiLocker KYC, and
        finishes their <strong>first paid task</strong>, you earn a <strong>10% affiliate reward once</strong>.
      </p>
      <p>
        <strong>Transfer Condition:</strong> Affiliate earnings are transferred only after task completion, OTP verification, and dispute clearance.
        Self-referrals or duplicate accounts void rewards and deduct Trust Points.
      </p>
    </PolicyCard>
  )
}

export function PolicyPage({ kicker, title, subtitle, children, aside }) {
  return (
    <section className="app-view space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.75rem] border border-slate-200/80 p-6 sm:p-8 shadow-lg shadow-slate-200/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F5257]">{kicker}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">{title}</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{subtitle}</p>
          </div>
          {aside}
        </div>
        {children}
      </div>
    </section>
  )
}
