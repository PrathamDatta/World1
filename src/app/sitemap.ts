import type { MetadataRoute } from "next";

const routes = ["", "/about", "/domains", "/it-support", "/cloud", "/web-hosting", "/email", "/website-design", "/custom-web-apps", "/security", "/contact"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  return routes.map((r) => ({ url: `${base}${r}` }));
}
