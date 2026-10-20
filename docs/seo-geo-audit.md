# SEO and GEO audit: AdINET Infosystems website

Internal report. All facts on the site come from the existing AdINET website and the screenshots supplied by the company. Nothing here claims ranking, indexing or AI-answer inclusion has improved; those need real-world evidence (Search Console, query tests) that only exists after launch.

## 1. What was implemented

**Technical SEO**
- Single page registry (`src/data/pages.ts`) feeds titles, meta descriptions, canonical URLs, Open Graph/Twitter tags, JSON-LD, the sitemap, `llms.txt`, the visible summaries and the related-service links. The facts cannot drift between surfaces.
- Unique title and description on all 11 public pages (titles 25-75 characters, descriptions 70-170).
- Canonical URL and `og:url` on every page, in the form Next.js emits (no trailing slash; `/about/` redirects 308 to `/about`).
- `sitemap.xml` lists the 11 public routes once each, at their canonical URLs. `robots.txt` allows all crawlers and points at the sitemap.
- Preview/staging safety: when `VERCEL_ENV` is not `production`, every page gets `noindex, nofollow`, `robots.txt` disallows everything and the sitemap is empty.
- The site origin comes from `NEXT_PUBLIC_SITE_URL`, or automatically from Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. With neither, canonical URLs and the sitemap are omitted rather than guessed.
- Share image: generated 1200x630 Open Graph / Twitter image (`opengraph-image`, `twitter-image`), declared explicitly on every page (a page-level `openGraph` object replaces the root one, so inheriting it silently drops the image).
- Semantic structure: one `h1` per page, no skipped heading levels (verified by script), real `<a href>` navigation, descriptive link text.
- 404 page is `noindex`.

**On-page and content**
- Every service page opens with an "at a glance" block: a plain-language definition and a fact list (`AtAGlance`), before the interactive content.
- FAQ sections on eight service pages, driven by `src/data/faqs.ts`. The same data is rendered in the page and emitted as FAQPage JSON-LD, so they always match. Answers remain in the HTML while collapsed.
- "Related AdINET services" links on nine pages for descriptive internal linking.
- Footer states what the company is on every page.
- H1 on the security page changed from the vague "Security & Addons" to "SSL, Security & Backup Addons".

**Performance relevant to search**
- Fonts self-hosted and preloaded through `next/font/local` (Latin subset only). CLS 0 in every Lighthouse run.
- The 3D scene loads about 1s after load, off the critical path; core content is server-rendered HTML and does not depend on it.

## 2. Consistent identity

| Fact | Value | Used in |
|---|---|---|
| Name | AdINET Infosystems (short: AdINET) | titles, headings, footer, Organization JSON-LD, `llms.txt`, OG image |
| Location | Bengaluru, India | home title, footer, Organization address (locality + country only), `llms.txt` |
| Email / phone | sales@adinet.in, +91 9986003120 (also WhatsApp) | contact page, footer, Organization contactPoint, `llms.txt` |
| What it does | cloud and web hosting, business email, domains, IT support, website design, custom web applications, security add-ons | home description, about, footer, Organization `knowsAbout` |

All values originate in `src/data/site.ts` and `src/data/pages.ts`.

## 3. Structured data (JSON-LD)

Site-wide, once per page, from the root layout:
- `Organization` (name, alternateName, url, description, logo, email, telephone, `PostalAddress` with locality and country, `ContactPoint` for sales, `knowsAbout`)
- `WebSite` (publisher points to the Organization)

Per page, one graph:
- `WebPage` (`AboutPage` on /about, `ContactPage` on /contact, `FAQPage` merged into the page node where the page has FAQs)
- `BreadcrumbList` (Home > page) on every page except home
- `Service` on the eight service pages, `provider` pointing to the Organization. `areaServed` appears only on the domain service, where the source states the customer countries.

Stable `@id`s (`#organization`, `#website`, `<url>#webpage`, `#service`, `#breadcrumb`) link the entities; the verification script checks there are no duplicate or dangling ids and that FAQ questions and answers appear in the page HTML.

Deliberately not added: `LocalBusiness` (no street address or opening hours supplied), `Review`/`AggregateRating`, `Offer` prices (prices are "subject to change"), `Article` (no articles exist), `sameAs` (no verified social profiles), a `SearchAction` (the site has no search).

## 4. How pages are shaped for AI retrieval

- Each service page leads with a one-paragraph definition and a labelled fact list, then the detail. The content is in server-rendered HTML; none of it exists only inside the 3D scene, canvas or JavaScript.
- Questions are phrased as real customer questions, with direct answers drawn from the source site.
- Comparison data is in a real `<table>` (email platforms) and `<dl>` lists.
- Vendor and partner names (IceWarp, OX, MDaemon, ResellerClub, Impress.ly, Comodo, SiteLock, CodeGuard, SAP HANA) appear as text next to the logos.
- `/llms.txt` gives a plain-text company summary and page list, generated from the same registry. This is an emerging convention; no major search engine has documented that it uses it, so treat it as low-cost and unproven.
- No AI crawler is blocked. There are no per-bot rules in `robots.txt`.

## 5. Missing information that limits further optimisation

- **Production domain.** Not supplied. Canonicals and the sitemap switch on automatically on Vercel; set `NEXT_PUBLIC_SITE_URL` once a custom domain is live.
- **Street address, opening hours, years in business, team size.** Needed for `LocalBusiness` and for stronger entity signals.
- **Official social or business-directory profiles** (for `sameAs`, and for Google Business Profile).
- **Real case studies, named clients with permission, certifications and partner status.** None were supplied, so none are shown. The single testimonial (Roni Das) came from the old site and should be re-confirmed.
- **Per-product detail** (hosting plan names and prices, support agreement pricing) that would make service pages more complete.
- **A larger logo** (the supplied one is 74x61 px; Google's logo guidelines ask for at least 112x112).
- **Old-site URLs.** If the previous site had indexed URLs, the list is needed to add 301 redirects to the new routes.
- **Question data.** Real customer enquiries would let the FAQs target actual search intent rather than plausible questions.
