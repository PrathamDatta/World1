import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import Accordion from "@/components/Accordion";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Corporate Web Hosting Packages",
  description: "Corporate web hosting with redundant DNS, unmetered bandwidth, daily backup, a powerful email server and network and server-layer firewall security.",
};

const groups = [
  { title: "Server resources", items: ["Redundant DNS servers", "Unmetered bandwidth", "24/7/365 server monitoring", "99.5% uptime", "Daily backup", "Perl, PHP and .NET with 3.5 Framework (Windows plan only)", "MySQL support and MS SQL 2008 support (Windows plan only)", "500 MB space per MS SQL database", "Full-featured control panel access for self-help"] },
  { title: "Powerful email server", items: ["Linux-based mail server", "Multiple email IDs", "POP3 and IMAP support", "Webmail", "User account management"] },
  { title: "Security features", items: ["Network and server-layer firewall security", "Anti-spam and anti-virus filtering"] },
];
const terms = [
  "Minimum contract and payment term is one year.",
  "100% advance payment with the service order.",
  "Plans can be upgraded at any point in time by paying the difference amount.",
  "Plans cannot be downgraded during the contract period.",
];

export default function WebHosting() {
  return (
    <>
      <PageHero
        layer={1}
        title="Corporate Web Hosting Packages"
        intro="High on space and low on price, without compromising on quality. Not convinced yet? Take advantage of our 30-day money-back offer, with no questions asked on cancellation."
      />
      <section className="section">
        <div className="wrap split split--wide-left">
          <div className="stack">
            {groups.map((g) => (
              <div className="panel" key={g.title}>
                <h2 style={{ fontSize: "1.3rem" }}>{g.title}</h2>
                <ul className="checklist">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <aside className="panel panel--white" aria-labelledby="terms-title">
            <h2 id="terms-title" style={{ fontSize: "1.3rem" }}>Terms</h2>
            <ul className="checklist">{terms.map((t) => <li key={t}>{t}</li>)}</ul>
            <p><strong>Configuration set-up time:</strong> 24 to 48 hours from the date of advance payment.</p>
            <p className="note">
              Ask us for our Terms of Service, Acceptable Usage Policy and Data Backup Policy via the{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </aside>
        </div>
      </section>
      <section className="section section--mist" aria-labelledby="faq-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title">Before you book</h2>
          </div>
          <Accordion
            items={[
              { q: "How long is the contract?", a: <p>The minimum contract and payment term is one year, with 100% advance payment with the service order.</p> },
              { q: "Can I change plans?", a: <p>Plans can be upgraded at any point by paying the difference amount. Plans cannot be downgraded during the contract period.</p> },
              { q: "How quickly is my hosting set up?", a: <p>Configuration is completed within 24 to 48 hours from the date of advance payment.</p> },
              { q: "What if it is not right for me?", a: <p>We offer a 30-day money-back guarantee, with no questions asked on cancellation.</p> },
              { q: "Which features are Windows-plan only?", a: <p>Perl, PHP and .NET with the 3.5 Framework, and MySQL and MS SQL 2008 support (with 500 MB space per MS SQL database), are available on the Windows plan only.</p> },
            ]}
          />
        </div>
      </section>
      <CtaBand title="Book your hosting space" text="Tell us your requirements and whether you need a Linux or Windows plan." />
    </>
  );
}
