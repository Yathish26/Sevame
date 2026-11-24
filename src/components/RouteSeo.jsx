import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteSeo } from '../data/seo.js'
import { useApp } from '../context/app-context.js'

const JSON_LD_ID = 'site-structured-data'
const AREAS = ['Surathkal', 'Bejai', 'Kadri', 'Kottara', 'Hampankatta']

// Updates the tags already declared in index.html (instead of adding duplicates).
function setMeta(selector, value) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(selector.startsWith('link') ? 'href' : 'content', value)
}

// Google structured data, built from the backend settings (Admin → Panel).
function structuredData(siteUrl, email) {
  const org = `${siteUrl}/#organization`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': org,
        name: 'Seva Mein',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo.png`,
        email,
        areaServed: { '@type': 'City', name: 'Mangaluru' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email,
          areaServed: 'IN',
          availableLanguage: ['English', 'Kannada', 'Hindi'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: 'Seva Mein',
        inLanguage: 'en-IN',
        publisher: { '@id': org },
      },
      {
        '@type': 'Service',
        name: 'Peer-to-peer local task marketplace',
        serviceType: 'Local errands, tasks and part-time help',
        provider: { '@id': org },
        areaServed: [{ '@type': 'City', name: 'Mangaluru' }, ...AREAS.map((name) => ({ '@type': 'Place', name }))],
        url: `${siteUrl}/`,
      },
    ],
  }
}

// All site-specific SEO (canonical, Open Graph, Twitter, structured data) is applied here at runtime
// from the backend settings, so changing them in Admin → Panel needs no rebuild.
function RouteSeo() {
  const { pathname } = useLocation()
  const { site } = useApp()
  const { siteUrl, grievanceEmail } = site

  // Per-page tags.
  useEffect(() => {
    const { title, description, path, noindex } = getRouteSeo(pathname)
    const url = siteUrl + (path === '/' ? '/' : path)

    document.title = title
    setMeta('meta[name="description"]', description)
    setMeta('meta[name="robots"]', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    setMeta('link[rel="canonical"]', url)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', url)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
  }, [pathname, siteUrl])

  // Site-wide tags.
  useEffect(() => {
    setMeta('meta[property="og:image"]', `${siteUrl}/logo.png`)
    setMeta('meta[name="twitter:image"]', `${siteUrl}/logo.png`)

    let script = document.getElementById(JSON_LD_ID)
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = JSON_LD_ID
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData(siteUrl, grievanceEmail))
  }, [siteUrl, grievanceEmail])

  return null
}

export default RouteSeo
