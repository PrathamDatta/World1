import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import ServiceMap from "@/components/ServiceMap";
import SolutionSelector from "@/components/SolutionSelector";

const services = [
  { n: "01", title: "Web & Cloud", href: "/cloud", text: "Web hosting, domain name registration and cloud servers." },
  { n: "02", title: "Email & Email Security", href: "/email", text: "Anti-spam service, corporate email and email security." },
  { n: "03", title: "IT Support", href: "/it-support", text: "Simplifying technology for the world, anytime, anywhere." },
  { n: "04", title: "Web & Mobile", href: "/website-design", text: "Custom design and development of web and mobile sites and applications." },
  { n: "05", title: "E-commerce & E-learning", href: "/custom-web-apps", text: "Custom e-commerce and e-learning solutions." },
  { n: "06", title: "SEO & API", href: "/custom-web-apps", text: "Cutting-edge SEO, API integration and custom REST API development." },
];

const reasons = [
  { t: "Total solutions under one roof", p: "Domains, hosting, email, security, support and custom development are handled by one team, so you do not have to coordinate several vendors." },
  { t: "Flexible support agreements", p: "Monthly, six-month and one-year support agreements, with onsite and online IT support." },
  { t: "Quality through to the very end", p: "A quality policy followed by our whole team, and a professional approach to executing every project until it is delivered." },
  { t: "Fully managed domains", p: "Our managed domain service sends telephone and email reminders so a domain never lapses into redemption." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <p className="eyebrow enter" style={{ ["--i" as string]: 0 }}>AdINET Infosystems · Bengaluru</p>
            <h1 className="enter" style={{ ["--i" as string]: 1 }}>Your preferred <em>IT partner.</em></h1>
            <p className="lede enter" style={{ ["--i" as string]: 2 }}>
              A young and dynamic organisation offering total and cost-effective IT solutions: cloud and web hosting,
              business email, domains, IT support and custom web applications.
            </p>
            <div className="btn-row enter" style={{ ["--i" as string]: 3 }}>
              <Link href="/contact" className="btn btn--primary">Talk to our team</Link>
              <Link href="/cloud" className="btn btn--light">Explore cloud hosting</Link>
            </div>
          </div>
          <div className="enter" style={{ ["--i" as string]: 3 }}>
            <ServiceMap />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="goal-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Start with your goal</p>
            <h2 id="goal-title">What do you need to get done?</h2>
            <p className="lede">Pick a goal and we will point you to the services that cover it.</p>
          </div>
          <SolutionSelector />
        </div>
      </section>

      <section className="section section--navy" aria-labelledby="services-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">What we do</p>
            <h2 id="services-title">Everything your business needs online, in one place</h2>
            <p className="lede">From the domain name to the server, the mailbox and the people who keep it running.</p>
          </div>
          <div className="index-list">
            {services.map((s) => (
              <Link href={s.href} className="index-row" key={s.n}>
                <span className="num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="go">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cloud-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Cloud hosting</p>
            <h2 id="cloud-title">A cloud that flexes with your business</h2>
            <p className="lede">
              Rather than being hosted on a single physical server, your website is hosted on a virtual partition that
              draws on shared resources.
            </p>
          </div>
          <div className="grid-3">
            {[
              ["Public Cloud", "Every business is unique, and so must be its cloud solution. An intelligent cloud computing architecture designed around your business."],
              ["Private Cloud", "Scalable, secure, high-compute and flexible, combining the security and performance of a private cloud with the cost-effectiveness of a public one."],
              ["SAP HANA", "Move to SAP S/4 HANA in the cloud, and build, deploy, host, manage and monitor your HANA environment with expert help."],
            ].map(([t, p]) => (
              <div className="tile panel" key={t}>
                <h3>{t}</h3>
                <p style={{ color: "var(--muted)", margin: 0 }}>{p}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 36 }}>
            <Link href="/cloud" className="btn btn--ghost">See cloud options</Link>
          </p>
        </div>
      </section>

      <section className="section section--mist" aria-labelledby="why-title">
        <div className="wrap split split--wide-left">
          <div>
            <p className="eyebrow">Why AdINET</p>
            <h2 id="why-title">Why businesses choose us</h2>
            <ul className="reasons" style={{ marginTop: 36 }}>
              {reasons.map((r) => (
                <li key={r.t}>
                  <h3>{r.t}</h3>
                  <p>{r.p}</p>
                </li>
              ))}
            </ul>
          </div>
          <figure className="quote" style={{ margin: 0, alignSelf: "center" }}>
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
      </section>

      <CtaBand />
    </>
  );
}
