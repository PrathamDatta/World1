export const company = {
  name: "ADINET INFOSYSTEMS",
  shortName: "ADINET",
  location: "Bengaluru",
  email: "sales@adinet.in",
  phone: "+91 9986003120",
  phoneHref: "tel:+919986003120",
  whatsapp: "+91 99860 03120",
  whatsappHref: "https://wa.me/919986003120",
  tagline: "Your preferred IT partner",
} as const;

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; items: NavLink[] };
export type NavEntry = NavLink | NavGroup;

export const isGroup = (e: NavEntry): e is NavGroup => "items" in e;

export const nav: NavEntry[] = [
  {
    label: "Cloud & Hosting",
    items: [
      { label: "Cloud Hosting", href: "/cloud", description: "Public, private and SAP HANA cloud" },
      { label: "Web Hosting", href: "/web-hosting", description: "Corporate hosting packages" },
      { label: "Business Email", href: "/email", description: "IceWarp, OX and MDaemon" },
      { label: "Domains", href: "/domains", description: "Managed domain registration" },
    ],
  },
  {
    label: "Build",
    items: [
      { label: "Website Design", href: "/website-design", description: "Website and mobile site builders" },
      { label: "Custom Web Apps", href: "/custom-web-apps", description: "Portals and web applications" },
    ],
  },
  { label: "IT Support", href: "/it-support" },
  { label: "Security & Addons", href: "/security" },
  { label: "About", href: "/about" },
];

export const footerServices: NavLink[] = [
  { label: "Domains", href: "/domains" },
  { label: "IT Support", href: "/it-support" },
  { label: "Cloud Hosting", href: "/cloud" },
  { label: "Web Hosting", href: "/web-hosting" },
  { label: "Business Email", href: "/email" },
  { label: "Website Design", href: "/website-design" },
  { label: "Custom Web Apps", href: "/custom-web-apps" },
  { label: "Security & Addons", href: "/security" },
];
