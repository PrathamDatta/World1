import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Security & Addons",
  description: "SSL certificates, website security and website backup add-ons from AdINET Infosystems.",
};

const items = [
  { vendor: "Comodo SSL", name: "SSL Certificate", text: "Our certificates protect your personal data, including passwords, credit cards and identity information." },
  { vendor: "SiteLock", name: "Website Security", text: "Over 5,000 websites get attacked every day. Get SiteLock and secure your website from hackers, viruses and malware." },
  { vendor: "CodeGuard", name: "Website Backup", text: "Secure your website in just a few minutes. CodeGuard’s cloud backup lets you recover your website data instantly." },
];

export default function Security() {
  return (
    <>
      <PageHero title="Security & Addons" intro="Protect your website, your visitors’ data and your content with these add-on services." />
      <section className="section">
        <div className="wrap grid-3">
          {items.map((i) => (
            <article className="product" key={i.name}>
              <div className="product__body">
                <p className="product__kind">{i.vendor}</p>
                <h2 className="product__name" style={{ fontSize: "1.35rem" }}>{i.name}</h2>
                <p>{i.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand title="Add protection to your site" text="Ask us which security and backup add-ons suit your website." />
    </>
  );
}
