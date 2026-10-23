import { SITE, PILLARS, INDUSTRIES, CASES, POST, TEAM, FAQ } from '../data/content.js'

const id = (site, frag) => `${site}/#${frag}`

export function organization(site) {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': id(site, 'organization'),
    name: SITE.name,
    alternateName: 'Caliber',
    url: site,
    logo: `${site}/images/caliber-logo.png`,
    image: `${site}/og.png`,
    description:
      'ISO 13485 / ISO 9001 certified design consulting firm in Bengaluru offering Design & Engineering, Verification & Validation / Assurance and Consulting services for medical devices, life sciences, and aerospace & defence.',
    slogan: 'Moving excellence',
    telephone: '+91-80-25283196',
    email: SITE.emails[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '# 3499, 14th Main Road, HAL II Stage, Indiranagar',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560008',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '20:00' },
    ],
    founder: { '@type': 'Person', name: TEAM[0].name, jobTitle: TEAM[0].role, sameAs: [TEAM[0].linkedin] },
    knowsAbout: ['Medical device engineering', 'Regulatory compliance', 'ISO 13485', 'IEC 62304', 'ISO 14971', 'IEC 60601-1', 'GxP', 'Avionics', 'System safety', 'Verification and validation'],
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Caliber services',
      itemListElement: PILLARS.map((p) => ({
        '@type': 'OfferCatalog',
        name: p.title,
        itemListElement: p.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name } })),
      })),
    },
  }
}

const website = (site) => ({ '@type': 'WebSite', '@id': id(site, 'website'), url: site, name: SITE.name, publisher: { '@id': id(site, 'organization') }, inLanguage: 'en' })

const crumb = (site, path, names) => {
  const parts = path.split('/').filter(Boolean)
  const items = [{ name: 'Home', url: site + '/' }]
  let acc = ''
  parts.forEach((seg, i) => {
    acc += '/' + seg
    items.push({ name: names[i] || seg, url: site + acc })
  })
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  }
}

/** Build the JSON-LD graph for one route. `meta` is { title, description } recorded by <Seo>. */
export function graphFor(site, path, meta) {
  const g = [organization(site), website(site)]
  const url = site + (path === '/' ? '/' : path)
  const page = (type, extra = {}) => ({ '@type': type, '@id': `${url}#webpage`, url, name: meta.title, description: meta.description, isPartOf: { '@id': id(site, 'website') }, about: { '@id': id(site, 'organization') }, inLanguage: 'en', ...extra })

  if (path === '/') g.push(page('WebPage'))
  else if (path === '/about') {
    g.push(page('AboutPage'), crumb(site, path, ['Company']))
    g.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })
  } else if (path === '/contact') g.push(page('ContactPage'), crumb(site, path, ['Contact']))
  else if (path.startsWith('/industries/')) {
    const ind = INDUSTRIES.find((i) => path.endsWith(i.slug))
    g.push(page('WebPage'), crumb(site, path, ['Industries', ind?.name]))
    if (ind)
      g.push({
        '@type': 'Service',
        '@id': `${url}#service`,
        name: `${ind.name} engineering and regulatory services`,
        serviceType: ind.servicesTitle,
        provider: { '@id': id(site, 'organization') },
        description: ind.lede,
        url,
        hasOfferCatalog: { '@type': 'OfferCatalog', name: ind.servicesTitle, itemListElement: ind.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s } })) },
      })
  } else if (path.startsWith('/case-studies/')) {
    const c = CASES.find((x) => path.endsWith(x.slug))
    g.push(page('WebPage'), crumb(site, path, ['Case studies', c?.title]))
    if (c) g.push({ '@type': 'Article', '@id': `${url}#article`, headline: c.title, description: c.summary, mainEntityOfPage: { '@id': `${url}#webpage` }, author: { '@id': id(site, 'organization') }, publisher: { '@id': id(site, 'organization') }, about: c.kicker, image: `${site}/og.png`, inLanguage: 'en' })
  } else if (path.startsWith('/insights/')) {
    g.push(page('WebPage'), crumb(site, path, ['Insights', POST.title]))
    g.push({ '@type': 'BlogPosting', '@id': `${url}#article`, headline: POST.title, description: POST.body[0], datePublished: POST.date, author: { '@type': 'Person', name: POST.author }, publisher: { '@id': id(site, 'organization') }, mainEntityOfPage: { '@id': `${url}#webpage` }, image: `${site}/og.png`, inLanguage: 'en' })
  } else {
    const name = { '/services': 'Services', '/industries': 'Industries', '/case-studies': 'Case studies', '/insights': 'Insights', '/careers': 'Careers' }[path]
    g.push(page(path === '/services' ? 'CollectionPage' : 'WebPage'), crumb(site, path, [name]))
  }
  return { '@context': 'https://schema.org', '@graph': g }
}
