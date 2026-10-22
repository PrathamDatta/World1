import type { MetadataRoute } from "next";
import { pageList } from "@/data/pages";
import { isIndexable, pageUrl, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Lists every public, indexable route once, at its canonical (no trailing slash) URL. lastModified is omitted on purpose: there is no reliable per-page edit date.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base || !isIndexable()) return [];
  return pageList.map((p) => ({ url: pageUrl(p.path) }));
}
