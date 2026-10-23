import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'
import { graphFor } from './seo/schema.js'
import { SITE, PILLARS, INDUSTRIES, CASES, POST, FAQ } from './data/content.js'

export const ROUTES = [
  '/',
  '/about',
  '/services',
  '/industries',
  ...INDUSTRIES.map((i) => `/industries/${i.slug}`),
  '/case-studies',
  ...CASES.map((c) => `/case-studies/${c.slug}`),
  '/insights',
  `/insights/${POST.slug}`,
  '/careers',
  '/contact',
]

/** Render one route to HTML + its head metadata. Used only by scripts/prerender.mjs at build time. */
export function render(url, site) {
  globalThis.__seo = null
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
  const meta = globalThis.__seo || { title: '', description: '' }
  return { html, meta, jsonld: url.startsWith('/__404') ? null : graphFor(site, url, meta) }
}

/** Plain-text summary for AI assistants (https://llmstxt.org). Facts only, all sourced from caliberassurance.com. */
export function llmsTxt(site) {
  const L = (path, label, note) => `- [${label}](${site}${path})${note ? `: ${note}` : ''}`
  return `# ${SITE.name}

> Caliber Assurance Services is an ISO 13485 / ISO 9001 certified design consulting firm in Bengaluru, India. It provides Design & Engineering, Verification & Validation / Assurance, and Consulting services, with a focus on regulatory compliance for medical devices, life sciences (pharma), and aerospace & defence (avionics, defence, automotive).

## Key facts
${FAQ.map((f) => `- ${f.q} ${f.a}`).join('\n')}

## Pages
${L('/about', 'Company', 'overview, why Caliber, leadership, FAQ')}
${L('/services', 'Services', PILLARS.map((p) => p.title).join('; '))}
${INDUSTRIES.map((i) => L(`/industries/${i.slug}`, i.name, i.lede)).join('\n')}
${CASES.map((c) => L(`/case-studies/${c.slug}`, c.title, c.summary)).join('\n')}
${L(`/insights/${POST.slug}`, POST.title, `${POST.dateLabel}, ${POST.author}`)}
${L('/careers', 'Careers')}
${L('/contact', 'Contact', 'address, phone, email, working hours')}

## Contact
- Address: ${SITE.address.join(', ')}
- Phone: ${SITE.phones.map((p) => p.label).join(' / ')}
- Email: ${SITE.emails[0]}
- Hours: ${SITE.hours.map((h) => h.join(' ')).join('; ')}
`
}
