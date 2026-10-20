import type { PageKey } from "./pages";

/** Questions and answers shown on the page AND emitted as FAQPage JSON-LD, so both always match. Answers are drawn from the existing AdINET website. */
export type Faq = { q: string; a: string };

export const faqs: Partial<Record<PageKey, { heading: string; items: Faq[] }>> = {
  domains: {
    heading: "Managed domains, answered",
    items: [
      { q: "What is the managed domain service?", a: "An AdINET initiative that helps customers renew domains on time and avoid the redemption/restoration cycle. It is a fully managed service handled by our dedicated staff." },
      { q: "When will I be reminded?", a: "Telephone and email reminders start 60 days before renewal, including calls at 30 days and 15 days before expiry." },
      { q: "What does it cost?", a: "₹300 per domain name registration, in addition to the domain registration fee. Prices and features are subject to change without prior notice." },
      { q: "Which extensions can I register?", a: "The extensions are .com, .net, .org, .info, .biz, .co.uk, .co.in, .in, .name, .uk, .tv and .mobi." },
      { q: "Can I check if a name is free right now?", a: "Not on this website yet. Enter the name on the page and send it to our team, and we will confirm availability and registration details." },
    ],
  },
  webHosting: {
    heading: "Before you book",
    items: [
      { q: "How long is the hosting contract?", a: "The minimum contract and payment term is one year, with 100% advance payment with the service order." },
      { q: "Can I change plans?", a: "Plans can be upgraded at any point by paying the difference amount. Plans cannot be downgraded during the contract period." },
      { q: "How quickly is my hosting set up?", a: "Configuration is completed within 24 to 48 hours from the date of advance payment." },
      { q: "What if it is not right for me?", a: "AdINET offers a 30-day money-back guarantee, with no questions asked on cancellation." },
      { q: "Which features are Windows-plan only?", a: "Perl, PHP and .NET with the 3.5 Framework, and MySQL and MS SQL 2008 support (with 500 MB space per MS SQL database), are available on the Windows plan only." },
    ],
  },
  itSupport: {
    heading: "About our support",
    items: [
      { q: "What support agreement terms are available?", a: "Monthly, six-month and one-year support agreements." },
      { q: "How fast does AdINET respond?", a: "Support includes one business day priority support, with rapid fault response and fix, and priority product support during normal business hours." },
      { q: "Is IT support onsite or remote?", a: "Both. AdINET provides onsite and remote support, available by telephone or email." },
      { q: "Can AdINET help before I buy technology?", a: "Yes. You can consult AdINET at any stage: from pre-purchase advice to straightforward installation, and on to complex integration projects." },
    ],
  },
  cloud: {
    heading: "Cloud hosting, answered",
    items: [
      { q: "What is cloud hosting?", a: "Instead of being hosted on one single instance of a physical server, your website is hosted on a virtual partition that draws its resources from a shared pool." },
      { q: "Which cloud options does AdINET offer?", a: "Public cloud, private cloud and SAP S/4 HANA cloud hosting." },
      { q: "What is the private cloud option?", a: "A private cloud that is scalable, secure, high-compute and flexible, combining the security and performance of a private cloud with the scalability and cost-effectiveness of a public cloud." },
      { q: "Can AdINET host SAP S/4 HANA?", a: "Yes. You can move to SAP S/4 HANA in the cloud and build, deploy, host, manage and monitor your HANA environment with SAP HANA experts." },
    ],
  },
  email: {
    heading: "Business email, answered",
    items: [
      { q: "Which email platforms does AdINET provide?", a: "IceWarp, OX and MDaemon. IceWarp is available as public cloud, private cloud and software, OX as public cloud, and MDaemon as software." },
      { q: "How much does business email cost?", a: "IceWarp starts from ₹200 per mailbox per year and OX is ₹300 per mailbox per year. Prices and specifications are subject to change without prior notice, and taxes are extra." },
      { q: "How much storage does each mailbox have?", a: "IceWarp offers 500 MB up to 30 GB of storage and OX offers 5 GB." },
      { q: "Can I use addresses on my own company domain?", a: "Yes. Professional email addresses such as sales@yourcompany.com build customer trust, and you can create as many group mailing lists as your company needs." },
    ],
  },
  security: {
    heading: "Security add-ons, answered",
    items: [
      { q: "What does an SSL certificate do?", a: "SSL certificates protect personal data on your website, including passwords, credit cards and identity information. AdINET provides Comodo SSL certificates." },
      { q: "What does SiteLock do?", a: "SiteLock secures a website from hackers, viruses and malware." },
      { q: "What is CodeGuard?", a: "CodeGuard is a cloud backup service for your website that lets you recover your website data instantly." },
    ],
  },
  customWebApps: {
    heading: "Custom development, answered",
    items: [
      { q: "What technologies does AdINET use for web applications?", a: "Core development includes MVC Framework / Core, web and database integration, HTML5, JavaScript, jQuery, AngularJS, MS SQL and MySQL." },
      { q: "What does a project involve?", a: "Projects run from initial requirement analysis, application study and application prototype, through home page design and hosting, e-business planning, and design and implementation." },
      { q: "Does AdINET build e-commerce and e-learning solutions?", a: "Yes. AdINET builds custom e-commerce and e-learning solutions, and also provides SEO, API integration and custom REST API development." },
    ],
  },
  websiteDesign: {
    heading: "Website design, answered",
    items: [
      { q: "Do I need coding skills to build a website?", a: "No. With the ResellerClub website builder you can create your own website instantly with no coding or design skills, choosing from ready-made themes." },
      { q: "What is the Impress.ly builder?", a: "A mobile website builder for quickly creating an app-like website, using social media content or starting from scratch." },
      { q: "Can AdINET design a website for me?", a: "Yes. AdINET offers custom design and development of web and mobile sites and applications." },
    ],
  },
};
