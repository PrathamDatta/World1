import type { Metadata } from "next";
import { pages, type PageKey } from "@/data/pages";
import { company } from "@/data/site";
import { abs, siteUrl } from "./site";

/** Per-page metadata: unique title/description, plus canonical + Open Graph URL when the site origin is known. */
export function pageMetadata(key: PageKey): Metadata {
  const p = pages[key];
  const known = !!siteUrl();
  // The page-level openGraph object replaces the root one, so the share image is declared explicitly here.
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: `${company.name}: cloud hosting, business email, domains and IT support in ${company.location}` };
  const title = key === "home" ? { absolute: p.title } : p.title;
  const shareTitle = key === "home" ? p.title : `${p.title} | ${company.name}`;
  return {
    title,
    description: p.description,
    ...(known ? { alternates: { canonical: abs(p.path) } } : {}),
    openGraph: {
      type: "website",
      siteName: company.name,
      locale: "en_IN",
      title: shareTitle,
      description: p.description,
      ...(known ? { url: abs(p.path) } : {}),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description: p.description, images: [image.url] },
  };
}
