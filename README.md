# ADINET INFOSYSTEMS website

Next.js 16 (App Router) + TypeScript. Content is based on the existing adinet website screenshots.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint && npm run typecheck && npm run build && npm start
```

## Deploying on Vercel
1. In Vercel, choose Add New → Project and import this GitHub repository (framework preset: Next.js, no extra settings).
2. Set the production branch to `main`; every push then deploys automatically and PRs get preview URLs.
3. Optional: add `NEXT_PUBLIC_SITE_URL` (your final domain) under Settings → Environment Variables, then add the domain under Settings → Domains.

## Creative system
- Concept: **The Stack**. ADINET's services layer on each other (cloud, hosting, domains, email, security, web & apps, IT support). A three.js scene renders that as seven plates; a sticky canvas stays behind the hero and the scroll story, and the camera climbs the stack as you scroll. It is a conceptual map, not a diagram of real infrastructure.
- 3D: `three` only (no React wrapper), lazy-loaded about 1s after load, paused when off-screen or the tab is hidden, pixel ratio capped, resources disposed on unmount. SVG poster/fallback when WebGL is unavailable. Software renderers and slow devices fall back to a static on-demand mode; `prefers-reduced-motion` gets static frames.
- Motion: CSS transitions + one IntersectionObserver + one rAF-throttled scroll loop. No animation library (GSAP was considered and left out: nothing here needs pinning/scrubbing).
- Type: Geist (display/body), Geist Mono (labels), Instrument Serif italic (accents), self-hosted via `next/font/local` in `src/fonts`.
- Interaction: cursor ring (desktop mouse only, native cursor stays), magnetic buttons, card spotlight, accessible tabs/accordions, hover/click/keyboard/touch dropdowns.

## SEO and GEO
Page metadata, canonical URLs, JSON-LD, the sitemap, `/llms.txt` and the visible summaries/FAQs all read from `src/data/pages.ts` and `src/data/faqs.ts`. See `docs/seo-geo-audit.md` for what was done and what information is still missing.
- Production origin: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.example.in`) once a custom domain is live. On Vercel the production URL is picked up automatically via `VERCEL_PROJECT_PRODUCTION_URL`. With neither, canonical URLs and the sitemap are omitted.
- Vercel preview deployments are automatically `noindex` with a disallow-all `robots.txt`.

## Cookie consent
`CookieBar` (bottom bar) stores the visitor's choice in one first-party cookie, `adinet_consent` (`accepted` or `rejected`, 180 days, `SameSite=Lax`, `Secure` on https). The footer's "Cookie settings" button reopens it. The site currently sets no analytics or marketing cookies; when any are added, gate them with `hasOptionalConsent()` from `src/lib/consent.ts`. Update the bar's wording if non-essential cookies are introduced, and have the company confirm any legal requirements for their audience.

## Configuration
- `NEXT_PUBLIC_SITE_URL`: see SEO and GEO above.

## Open items (need client input)
- Contact and domain forms prepare a `mailto:` to sales@adinet.in; no server-side submission exists. To receive enquiries directly, add an API route / form service (e.g. SMTP or a transactional email API) with credentials in server-side env vars.
- Domain availability lookup needs a registrar API (e.g. ResellerClub); the form currently routes the name to the sales team.
- Legal pages (Terms of Service, Usage policy, Data backup policy), "We are hiring" and "Meet the team" had no content in the screenshots and are not linked.
- Partner logos (IceWarp, OX, MDaemon, ResellerClub, Impress.ly, Comodo, SiteLock, CodeGuard, SAP HANA) are cropped from the old site's screenshots and are low resolution. Replace the files in `public/partners/` with official SVG/PNG assets from the partners (keep file names, or update `src/data/partners.ts`).
- Confirm: the Roni Das testimonial, "99.5% uptime", prices, the SiteLock statistic and the eNlight references were carried over from the existing site.
