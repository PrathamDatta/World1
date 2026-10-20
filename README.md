# AdINET Infosystems website

Next.js 16 (App Router) + TypeScript. Content is based on the existing adinet website screenshots.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint && npm run typecheck && npm run build   # static site in ./out
```

## Hosting on GitHub Pages
The site is a static export (`output: "export"`). `.github/workflows/pages.yml` builds and deploys it on every push to `main`.
1. Merge to `main`, then in the repo go to Settings → Pages → Source: **GitHub Actions**.
2. Project site (`https://<user>.github.io/<repo>/`): nothing else to do; the workflow sets `NEXT_PUBLIC_BASE_PATH=/<repo>`.
3. Custom domain: add it under Settings → Pages and remove the `NEXT_PUBLIC_BASE_PATH` line in the workflow.
Because Pages is static, the forms still use `mailto:` (see below).

## Configuration
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.example.in`): enables absolute metadata, `sitemap.xml` and the robots sitemap line. Not set by default because the production domain is not confirmed.

## Open items (need client input)
- Contact and domain forms prepare a `mailto:` to sales@adinet.in; no server-side submission exists. To receive enquiries directly, add an API route / form service (e.g. SMTP or a transactional email API) with credentials in server-side env vars.
- Domain availability lookup needs a registrar API (e.g. ResellerClub); the form currently routes the name to the sales team.
- Legal pages (Terms of Service, Usage policy, Data backup policy), "We are hiring" and "Meet the team" had no content in the screenshots and are not linked.
- Partner logos (IceWarp, OX, MDaemon, ResellerClub, Impress.ly, Comodo, SiteLock, CodeGuard, SAP HANA) are cropped from the old site's screenshots and are low resolution. Replace the files in `public/partners/` with official SVG/PNG assets from the partners (keep file names, or update `src/data/partners.ts`).
- Confirm: the Roni Das testimonial, "99.5% uptime", prices, the SiteLock statistic and the eNlight references were carried over from the existing site.
