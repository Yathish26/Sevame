// Static lists for the UI. Live users, tasks and tickets come from the API (src/lib/api.js).
// Keep CATEGORIES and the area values in sync with habackend/sevamein/data/constants.js.

export const CATEGORIES = [
  { name: 'Quick jobs', emoji: '⚡', tint: 'from-amber-50 to-amber-100', hint: 'Short 1–3 hr campus or city tasks' },
  { name: 'Local services', emoji: '🛠️', tint: 'from-teal-50 to-teal-100', hint: 'Tech setup, event help, tutoring' },
  { name: 'Deliveries & collections', emoji: '📦', tint: 'from-sky-50 to-sky-100', hint: 'Lawful notes, printouts, parcels' },
  { name: 'Urgent tasks', emoji: '🚨', tint: 'from-rose-50 to-rose-100', hint: 'Same-day queues or immediate help' },
  { name: 'Lost & found', emoji: '🔍', tint: 'from-indigo-50 to-indigo-100', hint: 'ID cards, keys, campus belongings' },
  { name: 'Reward requests', emoji: '🏆', tint: 'from-emerald-50 to-emerald-100', hint: 'Bounty for sourcing or special help' },
]

export const HOME_AREAS = ['All', 'Surathkal', 'Bejai', 'Kadri', 'Kottara', 'Hampankatta']

export const BROWSE_AREAS = [
  { value: 'All', label: 'All Mangaluru' },
  { value: 'Surathkal', label: 'Surathkal (NITK)' },
  { value: 'Bejai', label: 'Bejai' },
  { value: 'Kadri', label: 'Kadri' },
  { value: 'Kottara', label: 'Kottara' },
  { value: 'Hampankatta', label: 'Hampankatta' },
  { value: 'Deralakatte', label: 'Deralakatte / Yenepoya' },
]

export const POST_AREAS = [
  { value: 'Bejai', label: 'Bejai' },
  { value: 'Surathkal', label: 'Surathkal (NITK)' },
  { value: 'Kadri', label: 'Kadri' },
  { value: 'Kottara', label: 'Kottara' },
  { value: 'Hampankatta', label: 'Hampankatta' },
  { value: 'Deralakatte', label: 'Deralakatte / Yenepoya' },
  { value: 'St. Aloysius / Light House Hill', label: 'St. Aloysius / Light House Hill' },
]

export const TRUST_RULES = [
  ['Hard Cap at 30:', 'Every verified user starts at 30/30 and cannot exceed 30 points.'],
  ['-5 Deduction:', 'Verified complaints, no-shows, or minor rule breaches deduct 5 points.'],
  ['Below 10 Points (Low Trust):', 'Restricted to lowest matching priority and recovery points count at 50% value until back to 10+.'],
  ['Two-Strike Ban:', 'First 0/30 = 30-day suspension. Second 0/30 (or severe illegal breach) = permanent KYC-linked ban.'],
]
