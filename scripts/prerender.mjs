// Build-time static rendering: writes real HTML (content, meta tags, JSON-LD) for every route so that
// crawlers and AI assistants that do not run JavaScript still see the full site. React then hydrates it.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const SITE = (process.env.SITE_URL || 'https://caliberassurance.com').replace(/\/$/, '')
const dist = path.resolve('dist')
const server = await import(pathToFileURL(path.resolve('dist-server/entry-server.js')).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const today = new Date().toISOString().slice(0, 10)

function page(url, { html, meta, jsonld }, { index = true } = {}) {
  const canonical = SITE + (url === '/' ? '/' : url)
  const head = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    index ? '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />' : '<meta name="robots" content="noindex" />',
    index && `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:site_name" content="Caliber Assurance Services" />`,
    `<meta property="og:type" content="${url.startsWith('/insights/') ? 'article' : 'website'}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${SITE}/og.png" />`,
    `<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${SITE}/og.png" />`,
    jsonld && `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
  return template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
}

const warnings = []
for (const url of server.ROUTES) {
  const r = server.render(url, SITE)
  if (r.meta.description.length > 165) warnings.push(`${url}: description ${r.meta.description.length} chars`)
  if (r.meta.title.length > 75) warnings.push(`${url}: title ${r.meta.title.length} chars`)
  const h1 = (r.html.match(/<h1[\s>]/g) || []).length
  if (h1 !== 1) warnings.push(`${url}: ${h1} <h1> elements`)
  const out = url === '/' ? path.join(dist, 'index.html') : path.join(dist, url, 'index.html')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, page(url, r))
}
// 404 page: static hosts serve /404.html with a real 404 status for unknown URLs.
fs.writeFileSync(path.join(dist, '404.html'), page('/__404', server.render('/__404', SITE), { index: false }))

fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${server.ROUTES.map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`,
)
// Explicitly welcome search and AI crawlers: the content is public marketing information.
const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nSitemap: ${SITE}/sitemap.xml\n`)
fs.writeFileSync(path.join(dist, 'llms.txt'), server.llmsTxt(SITE))

console.log(`prerendered ${server.ROUTES.length} routes + 404 for ${SITE}`)
if (warnings.length) console.warn('SEO warnings:\n  ' + warnings.join('\n  '))
