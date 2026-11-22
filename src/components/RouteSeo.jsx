import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteSeo, SITE_URL } from '../data/seo.js'

// Updates the tags already declared in index.html (instead of adding duplicates).
function setMeta(selector, value) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(selector.startsWith('link') ? 'href' : 'content', value)
}

function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description, path, noindex } = getRouteSeo(pathname)
    const url = SITE_URL + (path === '/' ? '/' : path)

    document.title = title
    setMeta('meta[name="description"]', description)
    setMeta('meta[name="robots"]', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    setMeta('link[rel="canonical"]', url)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', url)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
  }, [pathname])

  return null
}

export default RouteSeo
