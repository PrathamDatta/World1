/**
 * Single source of truth for every public page: metadata, structured data, sitemap, llms.txt,
 * the visible "at a glance" summaries and related-service links all read from here so that the
 * company's facts cannot drift apart between surfaces. All copy is drawn from the existing AdINET website.
 */
export type Fact = { term: string; detail: string };
export type PageKey =
  | "home" | "about" | "domains" | "itSupport" | "cloud" | "webHosting"
  | "email" | "websiteDesign" | "customWebApps" | "security" | "contact";

export type PageDef = {
  path: string;
  /** <title> before the site template suffix (home uses an absolute title) */
  title: string;
  description: string;
  /** short name for breadcrumbs, related links and llms.txt */
  name: string;
  /** one-line description used where this page is linked from another page */
  blurb: string;
  schemaType?: "WebPage" | "AboutPage" | "ContactPage";
  service?: { name: string; serviceType: string; description: string; areaServed?: string[] };
  glance?: { lead: string; facts: Fact[] };
  related?: PageKey[];
};

export const pages: Record<PageKey, PageDef> = {
  home: {
    path: "/",
    title: "AdINET Infosystems | Cloud, Hosting, Email & IT Support, Bengaluru",
    description:
      "AdINET Infosystems is a Bengaluru IT services provider offering cloud and web hosting, business email, domain registration, IT support and custom web applications.",
    name: "Home",
    blurb: "Overview of AdINET Infosystems and its services.",
  },
  about: {
    path: "/about",
    title: "About Us: Bengaluru IT Services & Web Solutions",
    description:
      "About AdINET Infosystems, a Bengaluru IT services company with an in-house team for hosting, email, domains, IT support and custom web application development.",
    name: "About",
    blurb: "Who AdINET is, how its project teams work and where it serves customers.",
    schemaType: "AboutPage",
    glance: {
      lead:
        "AdINET Infosystems is an IT services company based in Bengaluru, India. It provides cloud and web hosting, business email, domain registration, IT support, website design and custom web application development, delivered by an in-house team.",
      facts: [
        { term: "Based in", detail: "Bengaluru, India" },
        { term: "Services", detail: "Cloud hosting, web hosting, business email, domains, IT support, website design, custom web applications, security add-ons" },
        { term: "Domain customers", detail: "AdINET offers its domain registration service to customers in Bengaluru, Chennai, Hyderabad, Kerala (Cochin), Mumbai and other parts of India, and to international customers in the USA, the Gulf region, Singapore and the UAE (Dubai)" },
        { term: "Contact", detail: "sales@adinet.in · +91 9986003120 (also on WhatsApp)" },
      ],
    },
    related: ["itSupport", "cloud", "customWebApps"],
  },
  domains: {
    path: "/domains",
    title: "Managed Domain Name Registration",
    description:
      "Managed domain name registration from AdINET with telephone and email renewal reminders from 60 days before expiry, plus optional DNS, privacy and theft protection.",
    name: "Domains",
    blurb: "Managed domain registration with renewal reminders so a domain never lapses.",
    service: {
      name: "Managed domain name registration",
      serviceType: "Domain name registration",
      description:
        "Registration of internet domain names with a managed renewal service: telephone and email reminders starting 60 days before expiry, plus optional DNS service, privacy protection and domain theft protection.",
      areaServed: ["India", "United States", "Singapore", "United Arab Emirates"],
    },
    glance: {
      lead:
        "AdINET’s managed domain registration service registers your domain and then looks after renewal. It sends telephone and email reminders starting 60 days before expiry, so the domain does not slip into the costly redemption stage.",
      facts: [
        { term: "Extensions", detail: ".com, .net, .org, .info, .biz, .co.uk, .co.in, .in, .name, .uk, .tv and .mobi" },
        { term: "Fee", detail: "₹300 per domain registration for the managed service, in addition to the domain registration fee (prices subject to change)" },
        { term: "Optional extras", detail: "DNS service, privacy protection and domain theft protection" },
        { term: "Support", detail: "Unlimited technical support and an easy-to-use control panel" },
      ],
    },
    related: ["webHosting", "email", "security"],
  },
  itSupport: {
    path: "/it-support",
    title: "IT Support Services: Onsite & Remote Agreements",
    description:
      "Onsite and remote IT support from AdINET on monthly, six-month or one-year agreements: computer repair, managed services, corporate email, hosting and network monitoring.",
    name: "IT Support",
    blurb: "Onsite and remote IT support on monthly, six-month or one-year agreements.",
    service: {
      name: "IT support services",
      serviceType: "IT support",
      description:
        "Onsite and remote IT support, computer maintenance and repair, managed services, outsourcing, corporate email and email security, web and email hosting and staffing, under monthly, six-month or one-year support agreements.",
    },
    glance: {
      lead:
        "AdINET provides onsite and remote IT support for businesses, covering computer maintenance and repair, managed services, corporate email and hosting, under monthly, six-month or one-year support agreements.",
      facts: [
        { term: "Agreement terms", detail: "Monthly, six-month and one-year" },
        { term: "Response", detail: "One business day priority support, with rapid fault response and fix" },
        { term: "Coverage", detail: "Voice, data and desktop, moves, additions and changes, network performance monitoring" },
        { term: "How to reach us", detail: "By telephone or email" },
      ],
    },
    related: ["cloud", "email", "customWebApps"],
  },
  cloud: {
    path: "/cloud",
    title: "Cloud Hosting: Public, Private & SAP S/4 HANA",
    description:
      "AdINET cloud hosting runs your website on a virtual partition drawing on shared resources. Choose public cloud, private cloud or SAP S/4 HANA cloud hosting.",
    name: "Cloud hosting",
    blurb: "Public cloud, private cloud and SAP S/4 HANA hosting on shared, flexible resources.",
    service: {
      name: "Cloud hosting",
      serviceType: "Cloud hosting",
      description:
        "Public cloud, private cloud and SAP S/4 HANA cloud hosting, where a website runs on a virtual partition that draws its resources from a shared pool rather than from one physical server.",
    },
    glance: {
      lead:
        "AdINET’s cloud hosting runs your website on a virtual partition that draws its resources from a shared pool, instead of on one single physical server. You can choose public cloud, private cloud or SAP S/4 HANA cloud hosting.",
      facts: [
        { term: "What it is", detail: "Hosting on a virtual partition with shared, flexible resources" },
        { term: "Options", detail: "Public cloud, private cloud and SAP S/4 HANA" },
        { term: "Private cloud", detail: "Combines the security and performance of a private cloud with the cost-effectiveness of a public cloud" },
        { term: "SAP S/4 HANA", detail: "Build, deploy, host, manage and monitor your HANA environment with SAP HANA experts" },
      ],
    },
    related: ["webHosting", "email", "itSupport"],
  },
  webHosting: {
    path: "/web-hosting",
    title: "Corporate Web Hosting Packages",
    description:
      "Corporate web hosting from AdINET: redundant DNS, unmetered bandwidth, 24/7/365 monitoring, daily backup, mail server and firewall security. 30-day money-back offer.",
    name: "Web hosting",
    blurb: "Corporate hosting packages with daily backup, monitoring and a full control panel.",
    service: {
      name: "Corporate web hosting",
      serviceType: "Web hosting",
      description:
        "Corporate web hosting packages with redundant DNS servers, unmetered bandwidth, 24/7/365 server monitoring, daily backup, a Linux-based mail server and network and server-layer firewall security.",
    },
    glance: {
      lead:
        "AdINET’s corporate web hosting packages include redundant DNS servers, unmetered bandwidth, 24/7/365 server monitoring, daily backup, a Linux-based mail server and firewall security, on a one-year term with a 30-day money-back offer.",
      facts: [
        { term: "Included", detail: "Redundant DNS, unmetered bandwidth, server monitoring, daily backup, control panel, anti-spam and anti-virus filtering" },
        { term: "Contract", detail: "Minimum one year, with 100% advance payment" },
        { term: "Set-up time", detail: "24 to 48 hours from the date of advance payment" },
        { term: "Changing plans", detail: "Upgrade at any time by paying the difference; plans cannot be downgraded during the contract" },
      ],
    },
    related: ["domains", "email", "security"],
  },
  email: {
    path: "/email",
    title: "Business Email Hosting: IceWarp, OX & MDaemon",
    description:
      "Professional business email from AdINET on IceWarp, OX or MDaemon, as public cloud, private cloud or software. IceWarp from ₹200 and OX at ₹300 per mailbox per year.",
    name: "Business email",
    blurb: "Business email on IceWarp, OX or MDaemon, as cloud or software.",
    service: {
      name: "Business cloud email hosting",
      serviceType: "Email hosting",
      description:
        "Business email hosting on IceWarp, OX or MDaemon, available as public cloud, private cloud or software, so a company can use professional addresses on its own domain.",
    },
    glance: {
      lead:
        "AdINET provides business email on three platforms, IceWarp, OX and MDaemon, so your company can use professional addresses on its own domain, such as sales@yourcompany.com, and create as many group mailing lists as it needs.",
      facts: [
        { term: "IceWarp", detail: "Public cloud, private cloud and software; 500 MB up to 30 GB storage; from ₹200 per mailbox per year" },
        { term: "OX", detail: "Public cloud; 5 GB storage; ₹300 per mailbox per year" },
        { term: "MDaemon", detail: "Email server software that installs in minutes and needs minimal administration" },
        { term: "Terms", detail: "Prices and specifications are subject to change without prior notice; taxes extra" },
      ],
    },
    related: ["domains", "webHosting", "itSupport"],
  },
  websiteDesign: {
    path: "/website-design",
    title: "Website Design & Website Builders",
    description:
      "Build a website without coding using the ResellerClub website builder, create an app-like mobile site with Impress.ly, or have AdINET design and develop one for you.",
    name: "Website design",
    blurb: "Website builders for do-it-yourself sites, or custom design by AdINET.",
    service: {
      name: "Website design",
      serviceType: "Website design",
      description:
        "Website design through the ResellerClub website builder (no coding or design skills required) and the Impress.ly mobile website builder, alongside custom web design and development by AdINET.",
    },
    glance: {
      lead:
        "You can create a website yourself with the ResellerClub website builder, which needs no coding or design skills, or build an app-like mobile website with Impress.ly. For anything built to your own requirements, AdINET’s team designs and develops it.",
      facts: [
        { term: "ResellerClub builder", detail: "Create a website instantly and choose from ready-made themes" },
        { term: "Impress.ly builder", detail: "An app-like mobile website, using social media content or starting from scratch" },
        { term: "Custom work", detail: "Custom design and development of web and mobile sites and applications" },
      ],
    },
    related: ["domains", "webHosting", "customWebApps"],
  },
  customWebApps: {
    path: "/custom-web-apps",
    title: "Custom Web Application Development",
    description:
      "AdINET’s in-house team builds custom web applications and portals, from requirement analysis and prototype to hosting, including e-commerce, e-learning and REST APIs.",
    name: "Custom web applications",
    blurb: "Custom web applications and portals, built by AdINET’s in-house team.",
    service: {
      name: "Custom web application development",
      serviceType: "Web application development",
      description:
        "Custom web-based applications and turnkey portal development, including requirement analysis, application study, prototype, hosting, e-business planning and implementation, plus e-commerce, e-learning, SEO, API integration and custom REST API development.",
    },
    glance: {
      lead:
        "AdINET’s in-house team builds custom web applications and portals, taking a project from initial requirement analysis and prototype through hosting, e-business planning and implementation.",
      facts: [
        { term: "Technologies", detail: "MVC Framework / Core, HTML5, JavaScript, jQuery, AngularJS, MS SQL and MySQL" },
        { term: "Delivery", detail: "Turnkey portal development, client-server and web-based applications, portal maintenance" },
        { term: "Also built", detail: "E-commerce and e-learning solutions, SEO, API integration and custom REST API development" },
      ],
    },
    related: ["websiteDesign", "webHosting", "itSupport"],
  },
  security: {
    path: "/security",
    title: "SSL Certificates, Website Security & Backup",
    description:
      "Security add-ons from AdINET: Comodo SSL certificates, SiteLock website security against hackers and malware, and CodeGuard cloud website backup.",
    name: "Security & addons",
    blurb: "SSL certificates, website security and cloud website backup.",
    service: {
      name: "Security and backup add-ons",
      serviceType: "Website security",
      description:
        "Comodo SSL certificates, SiteLock website security against hackers, viruses and malware, and CodeGuard cloud website backup.",
    },
    glance: {
      lead:
        "AdINET offers three add-ons to protect a website: Comodo SSL certificates, SiteLock website security and CodeGuard cloud website backup.",
      facts: [
        { term: "SSL certificate (Comodo)", detail: "Protects personal data including passwords, credit cards and identity information" },
        { term: "Website security (SiteLock)", detail: "Protects a website from hackers, viruses and malware" },
        { term: "Website backup (CodeGuard)", detail: "Cloud backup that lets you recover website data instantly" },
      ],
    },
    related: ["webHosting", "domains", "itSupport"],
  },
  contact: {
    path: "/contact",
    title: "Contact Sales: Email, Phone & WhatsApp",
    description:
      "Contact AdINET Infosystems in Bengaluru for hosting, email, domains, IT support and web development: sales@adinet.in, +91 9986003120, or WhatsApp.",
    name: "Contact",
    blurb: "Email, phone and WhatsApp details for AdINET sales.",
    schemaType: "ContactPage",
  },
};

export const pageList = Object.values(pages);
export const servicePages = (Object.keys(pages) as PageKey[]).filter((k) => pages[k].service);
