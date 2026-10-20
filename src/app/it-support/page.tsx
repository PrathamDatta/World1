import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "IT Support Services",
  description: "Onsite and remote IT support, managed services, corporate email and hosting, available on monthly, six-month and one-year agreements.",
};

const cols = [
  {
    title: "IT services",
    items: ["Computer maintenance & repair", "Onsite and remote support", "Managed services, outsourcing, FM", "Corporate email", "Corporate email security", "Web hosting", "Email hosting", "Staffing service"],
  },
  {
    title: "Features",
    items: ["One business day priority support", "Available on monthly, six-month and one-year terms", "Available across all our messaging platforms", "Unlimited product support", "Priority product support during normal business hours", "Available by telephone or email", "Better manage your IT operating expenses"],
  },
  {
    title: "Skill set",
    items: ["Flexible, knowledgeable and friendly support", "Helpdesk capability", "Voice, data and desktop coverage", "Moves, additions and changes", "Diagnosis, repair and programming", "Rapid fault response and fix", "Relocation consultancy and planning", "Network performance monitoring"],
  },
];

export default function ItSupport() {
  return (
    <>
      <PageHero title="IT Support Services" intro="Simplifying technology for your business, with onsite and online support on agreements that fit your needs." />
      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            {cols.map((c) => (
              <div className="panel" key={c.title}>
                <h2 style={{ fontSize: "1.3rem" }}>{c.title}</h2>
                <ul className="checklist">{c.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--mist" style={{ paddingTop: 56 }}>
        <div className="wrap split">
          <div>
            <h2>We take the hassle away</h2>
          </div>
          <div>
            <p>
              Investing in new technology and infrastructure can range from simple software upgrades to entire new
              computer systems. Choosing what to buy is often the simple part. Installing it and making sure it works
              properly can cause a series of delays and additional costs, especially when new purchases have to work
              alongside your existing technology.
            </p>
            <p>
              You can consult us at any stage: from pre-purchase advice to straightforward installation, and on to
              complex integration projects.
            </p>
            <p>
              AdINET offers monthly, six-month and one-year support agreements to meet your business needs. We are
              committed to delivering the best support experience with a single objective in mind: your satisfaction.
            </p>
          </div>
        </div>
      </section>
      <CtaBand title="Choose a support agreement" text="Tell us about your environment and we will suggest a monthly, six-month or one-year plan." />
    </>
  );
}
