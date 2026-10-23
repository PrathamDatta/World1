# Caliber Assurance Services — website

React 18 + Vite 5 + React Router 6 + GSAP (ScrollTrigger). No other animation/3D libraries; all diagrams are hand-built SVG, plus one small canvas.

```
npm install
npm run dev       # local dev
npm run build     # client build + SSR build + static pre-render of every route → dist/
npm run preview   # serve the build
```

## Structure
- `src/data/content.js` — **all site copy**, taken from https://caliberassurance.com (crawled 2026-10-23). Edit content here.
- `src/viz/` — Hero scene, Lifecycle (scroll-scrubbed), industry scenes, case-study visuals.
- `src/components/Ecosystem.jsx` — service ↔ industry relationship map.
- `src/pages/` — one file per route. Routes: `/`, `/about`, `/services`, `/industries[/:slug]`, `/case-studies[/:slug]`, `/insights[/:slug]`, `/careers`, `/contact`.

## Before deploying
1. **Build output**: `npm run build` must run on the host (Vercel does this automatically); the result is fully static.
2. **Contact form** has no backend (none is documented). It composes a `mailto:` to operations@caliberassurance.com and says so on the page. Replace with a real endpoint (Formspree, a serverless function, etc.) when available.
3. **Canonical host**: set the `SITE_URL` environment variable at build time (default `https://caliberassurance.com`). It feeds canonical URLs, Open Graph URLs, JSON-LD, `sitemap.xml`, `robots.txt` and `llms.txt`. Use the real production domain.
4. **Static hosting**: `vercel.json` enables `cleanUrls` and sets `trailingSlash: false`; each route is emitted as `dist/<route>/index.html`, and `dist/404.html` is served with a real 404 status. No catch-all rewrite is used (it would turn bad URLs into soft-404s).

## SEO / GEO (search engines and AI assistants)
- **Pre-rendering** (`scripts/prerender.mjs`): every route ships as real HTML (content, one `<h1>`, title, description, canonical, Open Graph / Twitter tags) and React hydrates it. Crawlers and AI assistants that do not run JavaScript see the full site.
- **Structured data (JSON-LD)**: `Organization`/`ProfessionalService` (address, hours, founder, service catalogue), `WebSite`, `BreadcrumbList`, `Service` (industry pages), `Article` (case studies), `BlogPosting` (insight), `AboutPage` + `FAQPage`, `ContactPage`. Built in `src/seo/schema.js` from `src/data/content.js`.
- **Answer-ready content**: the About page has a visible FAQ whose answers only restate facts published on caliberassurance.com; the same text is in the FAQPage markup and in `llms.txt`.
- **`robots.txt`** explicitly allows major search and AI crawlers; **`sitemap.xml`** and **`llms.txt`** are generated at build.
- **Share image**: `public/og.png` (1200×630).
- Needs the owner: Google Search Console / Bing Webmaster verification, a Google Business Profile, third-party mentions and backlinks, and Core Web Vitals measurement on the production domain.

## Content intentionally omitted — needs owner confirmation
- **Testimonials** on the old homepage are unattributed (no name/company) — not reproduced.
- **Client logos** (Medtronic, Philips Healthcare, Siemens) appear on the old homepage with no statement of engagement — not reproduced.
- **Logo**: the original raster oval logo is used (`public/images/caliber-logo.png`); a transparent SVG would be sharper.
- **Photos**: only Jay Kamath has a real photo; other leaders are shown as monograms.
- Case Study 1 exists on the old site only as an image diagram; no challenge/outcome text is published, so none is invented.
- The old blog contains a single 2015 article; no other news exists.
- Service ↔ industry links on the ecosystem map are the closest documented match between Caliber's services table and its industry pages (each link shows its supporting page). Please review.
