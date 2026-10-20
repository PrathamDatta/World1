export type MapNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  title: string;
  text: string;
  links: { label: string; href: string }[];
};

/** Hub-and-spoke map of the AdINET offering. Text is drawn from the existing AdINET site. */
export const hub: MapNode = {
  id: "support",
  label: "IT Support",
  x: 50,
  y: 50,
  title: "IT Support",
  text: "Onsite and remote IT support on monthly, six-month or one-year agreements, covering everything on this map.",
  links: [{ label: "IT support services", href: "/it-support" }],
};

export const mapNodes: MapNode[] = [
  {
    id: "domains",
    label: "Domains",
    x: 50,
    y: 12,
    title: "Domains",
    text: "Fully managed domain registration with telephone and email renewal reminders, plus optional DNS, privacy and domain theft protection.",
    links: [{ label: "Domain registration", href: "/domains" }],
  },
  {
    id: "hosting",
    label: "Web hosting",
    x: 83,
    y: 31,
    title: "Web hosting",
    text: "Corporate hosting packages with redundant DNS servers, unmetered bandwidth, daily backup and 24/7/365 server monitoring.",
    links: [{ label: "Hosting packages", href: "/web-hosting" }],
  },
  {
    id: "cloud",
    label: "Cloud",
    x: 83,
    y: 69,
    title: "Cloud hosting",
    text: "Public cloud, private cloud and SAP S/4 HANA hosting, running on a virtual partition that draws on shared resources.",
    links: [{ label: "Cloud hosting", href: "/cloud" }],
  },
  {
    id: "email",
    label: "Email",
    x: 50,
    y: 88,
    title: "Business email",
    text: "Professional email on IceWarp, OX or MDaemon, as public cloud, private cloud or software.",
    links: [{ label: "Business email", href: "/email" }],
  },
  {
    id: "security",
    label: "Security",
    x: 17,
    y: 69,
    title: "Security & addons",
    text: "SSL certificates, website security and cloud website backup.",
    links: [{ label: "Security & addons", href: "/security" }],
  },
  {
    id: "apps",
    label: "Web & apps",
    x: 17,
    y: 31,
    title: "Websites & web applications",
    text: "Custom web applications and portals built by our in-house team, or a website you build yourself with a website builder.",
    links: [
      { label: "Custom web apps", href: "/custom-web-apps" },
      { label: "Website design", href: "/website-design" },
    ],
  },
];

export const goals = [
  {
    id: "online",
    label: "Get online",
    intro: "Register a name, host the site and put something on it.",
    picks: [
      { title: "Domains", text: "Managed registration with renewal reminders so a domain never lapses.", href: "/domains" },
      { title: "Web hosting", text: "Corporate hosting packages with daily backup and a full control panel.", href: "/web-hosting" },
      { title: "Website design", text: "Use a website builder, or have us build to your requirements.", href: "/website-design" },
    ],
  },
  {
    id: "email",
    label: "Professional email",
    intro: "Addresses that carry your company name.",
    picks: [
      { title: "Business email", text: "IceWarp, OX or MDaemon, as cloud or software.", href: "/email" },
      { title: "Web hosting mail server", text: "A Linux-based mail server with POP3, IMAP and webmail comes with hosting.", href: "/web-hosting" },
      { title: "IT support", text: "Corporate email and email security are part of our support services.", href: "/it-support" },
    ],
  },
  {
    id: "workloads",
    label: "Run bigger workloads",
    intro: "Elastic infrastructure instead of a single server.",
    picks: [
      { title: "Public & private cloud", text: "Hosted on a virtual partition that draws on shared resources.", href: "/cloud" },
      { title: "SAP S/4 HANA", text: "Build, deploy, host, manage and monitor HANA with expert help.", href: "/cloud" },
      { title: "Managed services", text: "Outsourcing and managed services under a support agreement.", href: "/it-support" },
    ],
  },
  {
    id: "build",
    label: "Build an application",
    intro: "From requirements to a running portal.",
    picks: [
      { title: "Custom web apps", text: "Portals and web applications, from requirement analysis to implementation.", href: "/custom-web-apps" },
      { title: "E-commerce & e-learning", text: "Custom e-commerce and e-learning solutions.", href: "/custom-web-apps" },
      { title: "SEO & API work", text: "SEO, API integration and custom REST API development.", href: "/custom-web-apps" },
    ],
  },
  {
    id: "protect",
    label: "Keep it protected",
    intro: "Encryption, malware protection and recoverable backups.",
    picks: [
      { title: "SSL certificate", text: "Protect passwords, card details and identity information.", href: "/security" },
      { title: "Website security", text: "SiteLock protection against hackers, viruses and malware.", href: "/security" },
      { title: "Website backup", text: "CodeGuard cloud backup so you can recover site data instantly.", href: "/security" },
    ],
  },
];
