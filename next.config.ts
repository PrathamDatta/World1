import type { NextConfig } from "next";

// Set STATIC_EXPORT=1 (npm run build:static) to emit plain HTML/CSS/JS into ./out for shared hosting such as cPanel.
// Normal builds (Vercel, npm run build) are unchanged.
const staticExport = process.env.STATIC_EXPORT === "1";

// A static build bakes absolute URLs (canonical, sitemap, share images) into the HTML, so it needs the real domain.
if (staticExport && !process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error(
    'Static export needs the live domain. Example: NEXT_PUBLIC_SITE_URL=https://www.example.com npm run build:static',
  );
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(staticExport ? { output: "export", trailingSlash: true, images: { unoptimized: true } } : {}),
};

export default nextConfig;
