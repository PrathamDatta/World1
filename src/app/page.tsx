import type { Metadata } from "next";
import Link from "next/link";
import PageSchema from "@/components/PageSchema";
import { pageMetadata } from "@/lib/seo";
import CtaBand from "@/components/CtaBand";
import HostingCompare from "@/components/HostingCompare";
import Marquee from "@/components/Marquee";
import SolutionSelector from "@/components/SolutionSelector";
import Split from "@/components/Split";
import FocusZone from "@/components/stage/FocusZone";
import Stage from "@/components/stage/Stage";
import StackIndex from "@/components/stage/StackIndex";
import { layers } from "@/data/layers";
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
      <Stage>
        <FocusZone index={-1} className="hero" labelledBy="hero-title">
          <div className="wrap hero__grid">
            <div className="hero__copy">
              <p className="eyebrow enter" style={{ ["--i" as string]: 0 }}>{company.name} · {company.location}</p>
              <Split as="h1" id="hero-title" mode="load" className="hero-title" text="Your preferred IT *partner.*" delay={0} />
              <p className="lede enter" style={{ ["--i" as string]: 5 }}>
                A young and dynamic organisation offering total and cost-effective IT solutions: cloud and web hosting,
                business email, domains, IT support and custom web applications.
              </p>
              <div className="btn-row enter" style={{ ["--i" as string]: 6 }}>
                <Link href="/contact" className="btn btn--primary" data-cursor="Go">Talk to our team</Link>
                <a href="#stack" className="btn btn--light">See how it stacks up</a>
              </div>
            </div>
            <div className="hero__index enter" style={{ ["--i" as string]: 4 }}>
              <StackIndex />
            </div>
          </div>
          <div className="wrap hero__foot enter" style={{ ["--i" as string]: 7 }}>
            <span>Monthly, six-month and one-year support agreements</span>
            <span aria-hidden="true">↓ Scroll</span>
          </div>
        </FocusZone>

        <Marquee items={layers.map((l) => l.title)} />

        <FocusZone index={-1} className="story-intro" id="stack" labelledBy="stack-title">
          <div className="wrap">
            <p className="eyebrow">The stack</p>
            <Split as="h2" id="stack-title" text="Seven layers. *One* team." className="display" />
            <p className="lede">
              Everything we offer builds on the layer beneath it, from cloud infrastructure at the foundation to the
              support that looks after it all. Scroll to climb the stack. This is a conceptual map of our services, not a diagram of
              our infrastructure.
            </p>
          </div>
        </FocusZone>

        {layers.map((l) => (
          <FocusZone key={l.id} index={l.index} className="step" labelledBy={`step-${l.id}`}>
            <div className="wrap">
              <article className="step__card">
                <p className="step__no" aria-hidden="true">{String(l.index + 1).padStart(2, "0")}</p>
                <p className="step__tag">{l.tag}</p>
                <h3 id={`step-${l.id}`}>{l.title}</h3>
                <p>{l.text}</p>
                <p className="step__links">
                  {l.links.map((k) => (
                    <Link key={k.href} href={k.href} className="arrow-link" data-cursor="Open">
                      {k.label} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </p>
              </article>
            </div>
          </FocusZone>
        ))}
      </Stage>

      <section className="section sheet" aria-labelledby="goal-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Start with your goal</p>
            <Split as="h2" id="goal-title" text="What do you need to get *done?*" className="display" />
          </div>
          <SolutionSelector />
        </div>
      </section>

      <section className="section section--navy cloud-band" aria-labelledby="cloud-title">
        <span className="bgword" aria-hidden="true" data-parallax>CLOUD</span>
        <div className="wrap split">
          <div>
            <p className="eyebrow">Cloud hosting</p>
            <Split as="h2" id="cloud-title" text="A cloud that *flexes* with your business" className="display" />
            <p className="lede">
              Rather than being hosted on one physical server, your website is hosted on a virtual partition that
              draws on shared resources. Public cloud, private cloud and SAP S/4 HANA are all available.
            </p>
            <p><Link href="/cloud" className="btn btn--light" data-cursor="Open">See cloud options</Link></p>
          </div>
          <HostingCompare />
        </div>
      </section>

      <section className="section section--paper" aria-labelledby="why-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Why ADINET</p>
            <Split as="h2" id="why-title" text="Why businesses *choose* us" className="display" />
          </div>
          <div className="why">
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
                “ADINET provides us cost effective and reliable intranet services, also providing the domain related
                services. We have been obtaining services from ADINET for more than 10 years and we found that the
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

      <CtaBand />
    </>
  );
}
