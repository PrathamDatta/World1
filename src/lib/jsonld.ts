import { faqs } from "@/data/faqs";
import { pages, servicePages, type PageKey } from "@/data/pages";
import { company } from "@/data/site";
import { abs } from "./site";

const ORG = () => abs("/") + "#organization";
const SITE = () => abs("/") + "#website";

/** Site-wide entities. Emitted once, in the root layout; every page graph points back to them by @id. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG(),
        name: company.name,
        alternateName: company.shortName,
        url: abs("/"),
        description: pages.home.description,
        logo: { "@type": "ImageObject", url: abs("/brand/adinet-logo.png"), width: 74, height: 61 },
        email: company.email,
        telephone: company.phone,
        address: { "@type": "PostalAddress", addressLocality: company.location, addressCountry: "IN" },
        contactPoint: [
          { "@type": "ContactPoint", contactType: "sales", email: company.email, telephone: company.phone },
        ],
        knowsAbout: servicePages.map((k) => pages[k].service!.serviceType),
      },
      {
        "@type": "WebSite",
        "@id": SITE(),
        url: abs("/"),
        name: company.name,
        inLanguage: "en",
        publisher: { "@id": ORG() },
      },
    ],
  };
}

/** Page-level graph: WebPage (or FAQPage/AboutPage/ContactPage), breadcrumb and, where genuine, a Service. */
export function pageGraph(key: PageKey) {
  const p = pages[key];
  const url = abs(p.path);
  const faq = faqs[key];
  const types = [p.schemaType ?? "WebPage", ...(faq ? ["FAQPage"] : [])];
  const graph: Record<string, unknown>[] = [
    {
      "@type": types.length === 1 ? types[0] : types,
      "@id": `${url}#webpage`,
      url,
      name: p.title,
      description: p.description,
      inLanguage: "en",
      isPartOf: { "@id": SITE() },
      about: { "@id": p.service ? `${url}#service` : ORG() },
      ...(key !== "home" ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      ...(faq
        ? {
            mainEntity: faq.items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }
        : {}),
    },
  ];
  if (key !== "home") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: pages.home.name, item: abs("/") },
        { "@type": "ListItem", position: 2, name: p.name, item: url },
      ],
    });
  }
  if (p.service) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: p.service.name,
      serviceType: p.service.serviceType,
      description: p.service.description,
      url,
      provider: { "@id": ORG() },
      ...(p.service.areaServed
        ? { areaServed: p.service.areaServed.map((n) => ({ "@type": "Country", name: n })) }
        : {}),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
