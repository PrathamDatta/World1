import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Production: everything public is crawlable by every crawler (no AI-crawler blocks). Preview/staging: fully disallowed.
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, ...(base ? { sitemap: `${base}/sitemap.xml` } : {}) };
}
