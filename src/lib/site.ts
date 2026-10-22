/**
 * Canonical site origin. Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL (set this once a custom domain is live)
 *  2. VERCEL_PROJECT_PRODUCTION_URL (provided automatically by Vercel at build time)
 * Returns undefined when neither is known (e.g. a plain local build); canonical URLs, sitemap and absolute JSON-LD URLs are then omitted rather than guessed.
 */
export function siteUrl(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return undefined;
}

/** Preview/staging deployments must never be indexed. Anything that is not an explicit Vercel preview/development build counts as production. */
export function isIndexable(): boolean {
  const env = process.env.VERCEL_ENV;
  return !env || env === "production";
}

/** Absolute URL for a path. The root is written without a trailing slash, matching the canonical URL Next.js emits for it. */
/** Static export on Apache serves pages at /about/ (trailing slash); Vercel/Next serve /about. Canonical URLs must match what is served. */
const trailingSlash = process.env.STATIC_EXPORT === "1";

/** Absolute URL of a page. */
export const pageUrl = (path: string) => {
  const origin = siteUrl();
  if (path === "/") return origin ? `${origin}${trailingSlash ? "/" : ""}` : "/";
  return `${origin ?? ""}${path}${trailingSlash ? "/" : ""}`;
};

/** Absolute URL of a file/asset (never gets a trailing slash). */
export const abs = (path: string) => (path === "/" ? (siteUrl() ?? "/") : `${siteUrl() ?? ""}${path}`);
