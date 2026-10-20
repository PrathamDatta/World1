export type Layer = {
  id: string;
  /** index 0 = foundation (bottom of the stack) */
  index: number;
  label: string;
  title: string;
  tag: string;
  text: string;
  links: { label: string; href: string }[];
};

/** The AdINET offering as a conceptual stack, foundation first. Copy is drawn from the existing AdINET site. */
export const layers: Layer[] = [
  {
    id: "cloud",
    index: 0,
    label: "Cloud",
    title: "Cloud hosting",
    tag: "Foundation",
    text: "Public cloud, private cloud and SAP S/4 HANA hosting. Rather than one physical server, your site runs on a virtual partition that draws on shared resources.",
    links: [{ label: "Cloud hosting", href: "/cloud" }],
  },
  {
    id: "hosting",
    index: 1,
    label: "Web hosting",
    title: "Web hosting",
    tag: "Hosting",
    text: "Corporate hosting packages with redundant DNS servers, unmetered bandwidth, daily backup and 24/7/365 server monitoring.",
    links: [{ label: "Hosting packages", href: "/web-hosting" }],
  },
  {
    id: "domains",
    index: 2,
    label: "Domains",
    title: "Domains",
    tag: "Identity",
    text: "Fully managed domain registration with telephone and email renewal reminders, plus optional DNS, privacy and domain theft protection.",
    links: [{ label: "Domain registration", href: "/domains" }],
  },
  {
    id: "email",
    index: 3,
    label: "Email",
    title: "Business email",
    tag: "Communication",
    text: "Professional email on IceWarp, OX or MDaemon, as public cloud, private cloud or software, with as many group mailing lists as your company needs.",
    links: [{ label: "Business email", href: "/email" }],
  },
  {
    id: "security",
    index: 4,
    label: "Security",
    title: "Security & addons",
    tag: "Protection",
    text: "SSL certificates to protect passwords and card details, website security against hackers, viruses and malware, and cloud website backup you can recover instantly.",
    links: [{ label: "Security & addons", href: "/security" }],
  },
  {
    id: "apps",
    index: 5,
    label: "Web & apps",
    title: "Websites & web applications",
    tag: "Build",
    text: "Custom web applications and portals by our in-house team, from requirement analysis to implementation, or a website you build yourself with a website builder.",
    links: [
      { label: "Custom web apps", href: "/custom-web-apps" },
      { label: "Website design", href: "/website-design" },
    ],
  },
  {
    id: "support",
    index: 6,
    label: "IT support",
    title: "IT support",
    tag: "Care",
    text: "Onsite and remote IT support on monthly, six-month or one-year agreements, covering everything beneath it in the stack.",
    links: [{ label: "IT support services", href: "/it-support" }],
  },
];

export const layerByHref: Record<string, number> = {
  "/cloud": 0,
  "/web-hosting": 1,
  "/domains": 2,
  "/email": 3,
  "/security": 4,
  "/custom-web-apps": 5,
  "/website-design": 5,
  "/it-support": 6,
};
