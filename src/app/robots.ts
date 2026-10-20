import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return { rules: { userAgent: "*", allow: "/" }, ...(base ? { sitemap: `${base}/sitemap.xml` } : {}) };
}
