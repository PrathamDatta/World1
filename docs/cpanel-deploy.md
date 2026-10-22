# Deploying to cPanel (static files)

The site is exported as plain HTML/CSS/JS, so it needs no Node.js on the server. Upload the generated files to `public_html`.

## 1. Create the upload zip (no local tools needed)
1. On GitHub: **Actions → "Build cPanel zip" → Run workflow**.
2. Enter your live address in **site_url**, exactly as visitors will type it, e.g. `https://www.yourdomain.com` (no trailing slash). It is baked into canonical links, the sitemap and share previews, so it must be right.
3. When the run finishes, open it and download the artifact **adinet-cpanel-site** (a zip).

Or build locally: `NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com npm run build:static` and zip the contents of `out/`.

## 2. Upload
1. cPanel → **File Manager** → open `public_html`. **Keep the existing `.htaccess`.**
2. Optional: move any old site files into a folder named `old-site` first.
3. **Upload** the zip into `public_html`, then select it and click **Extract**. The files (`index.html`, `_next/`, `about/`, ...) must sit directly in `public_html`, not inside another folder.
4. Delete the zip.

## 3. Add the `.htaccess` lines
Right-click `.htaccess` → **Edit**, then paste the contents of `docs/cpanel-htaccess-additions.txt` **below** the existing lines and save.

## 4. Check
Open the site and visit `/about/`, `/contact/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and a made-up address to see the 404 page. Then use "Cookie settings" in the footer once.

## Updating later
Re-run the workflow, upload the new zip, **Extract with "overwrite"**. Old `_next/` files are harmless but you can delete the old `_next` folder first for a clean swap.

## Notes
- The contact form opens the visitor's email app (`mailto:`) because there is no server code. Real submissions need a form service or a small PHP script.
- Pages are served as `/about/` (with a trailing slash); `/about` redirects there automatically.
