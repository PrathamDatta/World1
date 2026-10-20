import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import DomainSearch from "@/components/DomainSearch";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Managed Domain Name Registration",
  description: "Fully managed domain name registration with advance telephone and email renewal reminders, optional DNS, privacy and domain theft protection.",
};

const features = [
  "Premium services at affordable rates",
  "Fully managed by our dedicated staff",
  "Telephone and email reminders starting 60 days before renewal",
  "Unlimited technical support",
  "Optional DNS service and privacy protection",
  "Optional domain theft protection",
  "Easy-to-use control panel",
];
const tlds = [".com", ".net", ".org", ".info", ".biz", ".co.uk", ".co.in", ".in", ".name", ".uk", ".tv", ".mobi"];

export default function Domains() {
  return (
    <>
      <PageHero
        title="Domain Name Registration"
        intro="Select your internet domain name and we will take care of the rest, with a fully managed service by our expert team."
      />
      <section className="section">
        <div className="wrap">
          <div className="panel panel--white">
            <h2 style={{ fontSize: "1.4rem" }}>Check a domain name</h2>
            <DomainSearch />
            <p className="note" style={{ marginTop: 14, marginBottom: 0 }}>For example: google.com</p>
          </div>
        </div>
      </section>
      <section className="section section--mist" style={{ paddingTop: 56 }}>
        <div className="wrap split">
          <div className="stack">
            <div>
              <h2>Features</h2>
              <ul className="checklist">{features.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
            <div>
              <h2>Available extensions</h2>
              <ul className="tags">{tlds.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
          <div className="stack">
            <div>
              <h2>Never lose a domain to a missed renewal</h2>
              <p>
                Restoring a domain that has gone into redemption, or losing a valuable domain because an email reminder
                was missed, can be costly. AdINET’s managed domain registration service makes this much easier to
                prevent, at very modest rates.
              </p>
            </div>
            <div>
              <h2>What is the managed service?</h2>
              <p>
                It is an AdINET initiative that helps customers renew their domains on time and avoid the
                redemption/restoration cycle. Subscribers receive telephone calls and email reminders ahead of renewal,
                including calls at 30 days and 15 days before expiry.
              </p>
              <p>
                The service costs ₹300 per domain name registration, in addition to the domain registration fee.
              </p>
              <p className="note">Prices and features are subject to change without prior notice.</p>
            </div>
            <div>
              <h2>Our customers</h2>
              <p>
                We offer domain registration (.com, .in and more) to customers in Bengaluru, Chennai, Hyderabad,
                Kerala (Cochin), Mumbai and other locations in India, and to international customers in the USA, the
                Gulf region, Singapore and the UAE (Dubai).
              </p>
            </div>
          </div>
        </div>
      </section>
      <CtaBand title="Register or transfer a domain" text="Tell us the name you want and we will confirm availability and next steps." />
    </>
  );
}
