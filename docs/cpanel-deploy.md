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

## The contact form
The form posts to `contact.php` (included in the zip). It validates again on the server, then emails the enquiry to **sales@adinet.in** using the server's own mail. The visitor's address is set as Reply-To, so replying to the email answers them directly.

- **From address:** `noreply@<your domain>`. The mailbox does not have to exist. If messages land in spam, create a real mailbox such as `sales@yourdomain.com` and use it as the sender (see below). Also check **cPanel → Email Deliverability** shows SPF and DKIM as valid for your domain.
- **Change the recipient or sender** without editing `contact.php` (updates would overwrite it): create `contact-config.php` in `public_html` next to it:
  ```php
  <?php return ['to' => 'sales@adinet.in', 'from' => 'sales@yourdomain.com'];
  ```
  This file is never part of the zip, so updates keep it.
- **Spam protection:** hidden trap field, a 2-second minimum fill time, at most 5 enquiries per visitor per 15 minutes, link limit, same-site check, input cleaning against email-header injection.
- **Safety net:** if the server cannot send an email, the enquiry is saved to `adinet-contact-outbox.log` in your home folder (above `public_html`, not reachable from the web) and the visitor is shown the phone, email and WhatsApp alternatives. Check that file now and then; delete entries once handled.
- **Test it** after uploading: send an enquiry from the Contact page, then check the sales mailbox (and its spam folder).
- If PHP is switched off or the file is missing, the form shows the same alternatives instead of failing silently.

## Notes
- Pages are served as `/about/` (with a trailing slash); `/about` redirects there automatically.
