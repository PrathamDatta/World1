import { useEffect } from 'react'

export const BASE = 'Caliber Assurance Services'
export const HOME_TITLE = 'Caliber Assurance | Medical Device & Avionics Engineering, Bengaluru'

export const fullTitle = (title) => (title ? `${title} | Caliber Assurance` : HOME_TITLE)

/**
 * Per-route metadata. On the server (pre-render) it records the values for the head injector;
 * in the browser it keeps title, description and canonical in sync during client-side navigation.
 */
export default function Seo({ title, description }) {
  const t = fullTitle(title)
  if (typeof window === 'undefined') globalThis.__seo = { title: t, description }

  useEffect(() => {
    document.title = t
    let m = document.querySelector('meta[name="description"]')
    if (!m) {
      m = document.createElement('meta')
      m.name = 'description'
      document.head.appendChild(m)
    }
    if (description) m.content = description
    let c = document.querySelector('link[rel="canonical"]')
    if (c) c.href = c.href.replace(/(https?:\/\/[^/]+).*/, '$1') + window.location.pathname.replace(/\/$/, '')
  }, [t, description])
  return null
}
