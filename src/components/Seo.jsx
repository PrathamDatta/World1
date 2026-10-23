import { useEffect } from 'react'

const BASE = 'Caliber Assurance Services'

/** Minimal per-route metadata (title, description, canonical). */
export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Globally compliant engineering`
    let m = document.querySelector('meta[name="description"]')
    if (!m) {
      m = document.createElement('meta')
      m.name = 'description'
      document.head.appendChild(m)
    }
    if (description) m.content = description
    let c = document.querySelector('link[rel="canonical"]')
    if (!c) {
      c = document.createElement('link')
      c.rel = 'canonical'
      document.head.appendChild(c)
    }
    c.href = window.location.origin + window.location.pathname
  }, [title, description])
  return null
}
