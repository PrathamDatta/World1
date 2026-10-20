import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import PartnerLogo from "@/components/PartnerLogo";
import type { PartnerKey } from "@/data/partners";

export const metadata: Metadata = {
  title: "Business Cloud Email Hosting",
  description: "Professional business email with IceWarp, OX and MDaemon, from AdINET Infosystems. Public cloud, private cloud and software options.",
};

const products = [
  {
    logo: "icewarp" as PartnerKey,
    name: "IceWarp",
    kind: "Email & collaboration",
    text: "The ultimate all-in-one email and collaboration platform. Best-in-class secure email, calendar, documents and chat for teams.",
    specs: [["Deployment", "Public cloud, private cloud and software"], ["Storage", "500 MB up to 30 GB"], ["Price", "From ₹200 per mailbox per year"]],
  },
  {
    logo: "ox" as PartnerKey,
    name: "OX",
    kind: "Business email",
    text: "Simple, powerful email for small businesses. Give your business a professional makeover with custom email addresses.",
    specs: [["Deployment", "Public cloud"], ["Storage", "5 GB"], ["Price", "₹300 per mailbox per year"]],
  },
  {
    logo: "mdaemon" as PartnerKey,
    name: "MDaemon",
    kind: "Email server",
    text: "An email server that provides full functionality and control, installs in minutes and needs minimal support and administration. A proven email platform for businesses.",
    specs: [["Deployment", "Software"]],
  },
];

export default function Email() {
  return (
    <>
      <PageHero
        layer={3}
        title="Business Cloud Email Hosting"
        intro="Build customer trust with professional email addresses. Create as many group mailing lists as your company needs, like sales@yourcompany.com."
      />
      <section className="section">
        <div className="wrap grid-3">
          {products.map((p) => (
            <article className="product" key={p.name}>
              <div className="product__body">
                <PartnerLogo name={p.logo} />
                <h2 className="product__name">{p.name}</h2>
                <p className="product__kind">{p.kind}</p>
                <p>{p.text}</p>
              </div>
              <ul className="product__spec">
                {p.specs.map(([k, v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="wrap" style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: "1.5rem" }}>Compare at a glance</h2>
          <div className="compare">
            <table>
              <thead>
                <tr><th scope="col"><span className="sr-only">Feature</span></th>{products.map((p) => <th scope="col" key={p.name}>{p.name}</th>)}</tr>
              </thead>
              <tbody>
                {["Deployment", "Storage", "Price"].map((row) => (
                  <tr key={row}>
                    <th scope="row">{row}</th>
                    {products.map((p) => <td key={p.name}>{p.specs.find(([k]) => k === row)?.[1] ?? "Ask our team"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: "1.2rem" }}>Terms & conditions</h2>
          <ul className="checklist">
            <li>Prices and specifications are subject to change without prior notice.</li>
            <li>Taxes extra.</li>
          </ul>
        </div>
      </section>
      <CtaBand title="Move to professional email" text="Tell us how many mailboxes you need and we will recommend the right platform." />
    </>
  );
}
