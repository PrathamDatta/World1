import Link from "next/link";
import CloudIllustration from "@/components/CloudIllustration";
import CtaBand from "@/components/CtaBand";

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
  { t: "Quality through to the very end", p: "Our approach is a quality policy followed by us and by professional execution of every project until it is delivered." },
  { t: "Fully managed domains", p: "Our managed domain service sends telephone and email reminders so a domain never lapses into redemption." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <p className="eyebrow">AdINET Infosystems · Bengaluru</p>
            <h1>Your preferred IT partner.</h1>
            <p className="lede">
              A young and dynamic organisation offering total and cost-effective IT solutions: cloud and web hosting,
              business email, domains, IT support and custom web applications.
            </p>
            <div className="btn-row">
              <Link href="/contact" className="btn btn--primary">Talk to our team</Link>
              <Link href="/cloud" className="btn btn--light">Explore cloud hosting</Link>
            </div>
          </div>
          <CloudIllustration />
        </div>
      </section>

      <section className="section" aria-labelledby="services-title">
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

      <section className="section section--navy" aria-labelledby="cloud-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Cloud hosting</p>
            <h2 id="cloud-title">A cloud that flexes with your business</h2>
            <p className="lede">
              Rather than being hosted on a single physical server, your website is hosted on a virtual partition that
              draws on shared resources.
            </p>
          </div>
          <div className="cols-3">
            <div className="col-block">
              <h3>Public Cloud</h3>
              <p>Every business is unique, and so must be its cloud solution. An intelligent cloud computing architecture designed around your business.</p>
            </div>
            <div className="col-block">
              <h3>Private Cloud</h3>
              <p>Scalable, secure, high-compute and flexible, combining the security and performance of a private cloud with the cost-effectiveness of a public one.</p>
            </div>
            <div className="col-block">
              <h3>SAP HANA</h3>
              <p>Move to SAP S/4 HANA in the cloud, and build, deploy, host, manage and monitor your HANA environment with expert help.</p>
            </div>
          </div>
          <p style={{ marginTop: 36 }}>
            <Link href="/cloud" className="btn btn--light">See cloud options</Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="wrap split split--wide-left">
          <div>
            <p className="eyebrow">Why AdINET</p>
            <h2 id="why-title">Why businesses choose us</h2>
            <ul className="reasons" style={{ marginTop: 32 }}>
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
