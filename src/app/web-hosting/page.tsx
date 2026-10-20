import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import AtAGlance from "@/components/AtAGlance";
import RelatedServices from "@/components/RelatedServices";
import FaqSection from "@/components/FaqSection";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = pageMetadata("webHosting");

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
      <PageSchema page="webHosting" />
      <AtAGlance page="webHosting" />
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
      <FaqSection page="webHosting" tone="mist" />
      <RelatedServices page="webHosting" />
      <CtaBand title="Book your hosting space" text="Tell us your requirements and whether you need a Linux or Windows plan." />
    </>
  );
}
