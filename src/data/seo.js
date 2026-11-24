// Per-route page titles/descriptions. The site URL comes from Admin → Panel (see RouteSeo.jsx).

const DEFAULT = {
  title: 'Seva Mein — Get Help Nearby in Mangaluru | Peer-to-Peer Tasks & Local Jobs',
  description:
    'Seva Mein connects you with KYC-verified locals and students in Mangaluru. Post a task, compare offers and get help nearby in minutes across Surathkal, Bejai, Kadri, Kottara & Hampankatta — or earn by helping your neighbours.',
}

// Per-route title/description. `noindex` keeps private, user-specific pages out of search results.
export const ROUTE_SEO = {
  '/': DEFAULT,
  '/browse': {
    title: 'Browse Local Tasks & Part-Time Jobs in Mangaluru | Seva Mein',
    description:
      'Find nearby tasks and quick part-time gigs in Mangaluru. Filter by area and category — Surathkal, Bejai, Kadri, Kottara, Hampankatta — and earn by helping people near you.',
  },
  '/post': {
    title: 'Post a Task — Hire Local Help in Mangaluru | Seva Mein',
    description:
      'Need help with errands, pickups, tutoring, repairs or more? Post a request on Seva Mein and get offers from verified locals and students across Mangaluru in minutes.',
  },
  '/support': {
    title: 'Help, Safety & Support | Seva Mein Mangaluru',
    description:
      'Get help with your Seva Mein account, tasks and payments. Raise a support ticket, use the SOS safety feature or contact our grievance officer.',
  },
  '/policies': {
    title: 'Terms, Privacy Policy & Trust Rules | Seva Mein',
    description:
      'Plain-English policies for Seva Mein: Section 79 IT Act intermediary terms, DPDP Act 2023 privacy policy, 30-point Trust Score rules and affiliate payout rules.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Seva Mein',
    description:
      'How Seva Mein collects, uses and protects your identity, location and account data under India’s Digital Personal Data Protection (DPDP) Act 2023.',
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | Seva Mein',
    description:
      'The rules for posting, accepting and completing tasks on Seva Mein in Mangaluru, including intermediary role, Trust Score and affiliate terms.',
  },
  '/login': {
    title: 'Sign in | Seva Mein',
    description: 'Sign in to Seva Mein to post requests, accept nearby tasks in Mangaluru and track your Trust Score.',
    noindex: true,
  },
  '/register': {
    title: 'Create your account | Seva Mein',
    description: 'Join Seva Mein free — get help nearby in Mangaluru or earn by helping your neighbours.',
    noindex: true,
  },
  '/admin': {
    title: 'Admin Dashboard | Seva Mein',
    description: 'Seva Mein admin dashboard.',
    noindex: true,
  },
  '/admin/login': {
    title: 'Admin Sign in | Seva Mein',
    description: 'Seva Mein admin sign in.',
    noindex: true,
  },
  '/profile': {
    title: 'My Profile | Seva Mein',
    description: 'Your Seva Mein profile, Trust Score, points and recent activity.',
    noindex: true,
  },
}

export function getRouteSeo(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const known = ROUTE_SEO[path]
  if (known) return { ...known, path }
  // Unknown routes render the Home page; don't let them be indexed as duplicates.
  return { ...DEFAULT, path: '/', noindex: true }
}
