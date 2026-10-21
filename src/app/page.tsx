import type { Metadata } from "next";
import Link from "next/link";
import PageSchema from "@/components/PageSchema";
import { pageMetadata } from "@/lib/seo";
import HostingCompare from "@/components/HostingCompare";
import SolutionSelector from "@/components/SolutionSelector";
import Split from "@/components/Split";
import SkyCanvas from "@/components/sky/SkyCanvas";
import CloudLayers from "@/components/CloudLayers";
import CloudExplainer from "@/components/CloudExplainer";
import { company } from "@/data/site";

const reasons = [
  { t: "Total solutions under one roof", p: "Domains, hosting, email, security, support and custom development are handled by one team, so you do not have to coordinate several vendors." },
  { t: "Flexible support agreements", p: "Monthly, six-month and one-year support agreements, with onsite and online IT support." },
  { t: "Quality through to the very end", p: "A quality policy followed by our whole team, and a professional approach to executing every project until it is delivered." },
  { t: "Fully managed domains", p: "Our managed domain service sends telephone and email reminders so a domain never lapses into redemption." },
];

export const metadata: Metadata = pageMetadata("home");

export default function Home() {
  return (
    <>
      <PageSchema page="home" />
      <div className="world">
        <SkyCanvas />

        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap hero__grid">
            <div className="hero__copy">
              <p className="eyebrow enter" style={{ ["--i" as string]: 1 }}>{company.tagline} · {company.name}</p>
              <Split as="h1" id="hero-title" mode="load" className="hero-title" text="YOUR BUSINESS.|BEYOND LIMITS." delay={450} step={110} />
              <p className="lede enter" style={{ ["--i" as string]: 9 }}>
                Cloud infrastructure, hosting, business email, domains, security and technology for your business.
              </p>
              <div className="btn-row enter" style={{ ["--i" as string]: 11 }}>
                <a href="#services" className="btn btn--primary">Explore our services <span className="btn__arrow" aria-hidden="true">→</span></a>
                <Link href="/contact" className="btn btn--outline">Talk to our team</Link>
              </div>
            </div>
          </div>
          <div className="wrap hero__foot enter" style={{ ["--i" as string]: 13 }}>
            <span>Monthly, six-month and one-year support agreements</span>
            <span aria-hidden="true">↓ Scroll</span>
          </div>
        </section>

        <section className="zone" id="services" aria-labelledby="services-title">
          <div className="wrap">
            <div className="zone__head">
              <p className="eyebrow">Our services</p>
              <Split as="h2" id="services-title" text="SEVEN LAYERS.|ONE CONNECTED CLOUD." className="display" step={80} />
              <p className="lede">
                Each service is a layer of cloud, and each builds on the one beneath it, from cloud infrastructure at the
                foundation to the support that looks after it all. Select a layer to explore it. The illustrations are conceptual, not
                diagrams of our infrastructure.
              </p>
            </div>
            <CloudLayers />
          </div>
        </section>

        <section className="zone zone--explain" id="cloud-explained" aria-labelledby="explain-title">
          <div className="wrap">
            <div className="zone__head">
              <p className="eyebrow">Cloud hosting</p>
              <Split as="h2" id="explain-title" text="CLOUD INFRASTRUCTURE.|MADE UNDERSTANDABLE." className="display" step={70} />
              <p className="lede">Flexible, secure and high-performance cloud infrastructure for your business.</p>
              <p><Link href="/cloud" className="btn btn--primary">Explore cloud hosting <span className="btn__arrow" aria-hidden="true">→</span></Link></p>
            </div>
            <CloudExplainer />
            <div className="explain__compare section--navy">
              <div>
                <h3>One server, or a pool of resources</h3>
                <p>
                  Rather than being hosted on one physical server, your website is hosted on a virtual partition that
                  draws on shared resources. Public cloud, private cloud and SAP S/4 HANA are all available.
                </p>
              </div>
              <HostingCompare />
            </div>
          </div>
        </section>

        <section className="zone" aria-labelledby="goal-title">
          <div className="wrap">
            <div className="zone__head">
              <p className="eyebrow">Business solutions</p>
              <Split as="h2" id="goal-title" text="What do you need|to get *done?*" className="display" step={80} />
            </div>
            <div className="zone__panel">
              <SolutionSelector />
            </div>
          </div>
        </section>

        <section className="zone" aria-labelledby="why-title">
          <div className="wrap">
            <div className="zone__head">
              <p className="eyebrow">Why AdINET</p>
              <Split as="h2" id="why-title" text="Why businesses|*choose* us" className="display" step={80} />
            </div>
            <div className="why zone__panel">
              <ul className="reasons">
                {reasons.map((r) => (
                  <li key={r.t}>
                    <h3>{r.t}</h3>
                    <p>{r.p}</p>
                  </li>
                ))}
              </ul>
              <figure className="quote">
                <blockquote>
                  “AdINET provides us cost effective and reliable intranet services, also providing the domain related
                  services. We have been obtaining services from AdINET for more than 10 years and we found that the
                  company is very much reliable and honest in their service.”
                </blockquote>
                <figcaption>
                  <cite>Roni Das</cite>
                  <small>Customer testimonial</small>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="zone zone--contact" aria-labelledby="contact-title">
          <div className="wrap contact-calm">
            <div>
              <p className="eyebrow">Start a conversation</p>
              <Split as="h2" id="contact-title" text="Let’s build on|*solid* ground" className="display" step={80} />
              <p className="lede">
                Tell us what you need and we will recommend the right service, from a single mailbox to a full hosting and support set-up.
              </p>
              <div className="btn-row">
                <Link href="/contact" className="btn btn--primary">Contact us <span className="btn__arrow" aria-hidden="true">→</span></Link>
                <a href={company.phoneHref} className="btn btn--outline">Call {company.phone}</a>
              </div>
            </div>
            <ul className="contact-details contact-calm__details">
              <li><span>Company</span>{company.name}</li>
              <li><span>Location</span>{company.location}</li>
              <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><span>Phone</span><a href={company.phoneHref}>{company.phone}</a></li>
              <li><span>WhatsApp</span><a href={company.whatsappHref} target="_blank" rel="noopener noreferrer">{company.whatsapp}</a></li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
