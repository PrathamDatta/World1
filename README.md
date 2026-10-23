# Caliber Assurance Services — website

React 18 + Vite 5 + React Router 6 + GSAP (ScrollTrigger). No other animation/3D libraries; all diagrams are hand-built SVG, plus one small canvas.

```
npm install
npm run dev       # local dev
npm run build     # production build → dist/
npm run preview   # serve the build
```

## Structure
- `src/data/content.js` — **all site copy**, taken from https://caliberassurance.com (crawled 2026-10-23). Edit content here.
- `src/viz/` — Hero scene, Lifecycle (scroll-scrubbed), industry scenes, case-study visuals.
- `src/components/Ecosystem.jsx` — service ↔ industry relationship map.
- `src/pages/` — one file per route. Routes: `/`, `/about`, `/services`, `/industries[/:slug]`, `/case-studies[/:slug]`, `/insights[/:slug]`, `/careers`, `/contact`.

## Before deploying
1. **SPA fallback**: the host must serve `index.html` for unknown paths. `public/_redirects` covers Netlify/Cloudflare Pages; other hosts need an equivalent rewrite.
2. **Contact form** has no backend (none is documented). It composes a `mailto:` to operations@caliberassurance.com and says so on the page. Replace with a real endpoint (Formspree, a serverless function, etc.) when available.
3. **SEO**: titles/descriptions/canonical are set client-side per route. For crawlers that do not run JS, add prerendering and a `sitemap.xml` / `robots.txt`.
4. **Social/OG image** not created.

## Content intentionally omitted — needs owner confirmation
- **Testimonials** on the old homepage are unattributed (no name/company) — not reproduced.
- **Client logos** (Medtronic, Philips Healthcare, Siemens) appear on the old homepage with no statement of engagement — not reproduced.
- **Original oval logo** (raster, white background) not used; the header uses a typographic wordmark echoing it (yellow dot). Supply an SVG/transparent logo to swap in.
- **Photos**: only Jay Kamath has a real photo; other leaders are shown as monograms.
- Case Study 1 exists on the old site only as an image diagram; no challenge/outcome text is published, so none is invented.
- The old blog contains a single 2015 article; no other news exists.
- Service ↔ industry links on the ecosystem map are the closest documented match between Caliber's services table and its industry pages (each link shows its supporting page). Please review.
