import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import AtAGlance from "@/components/AtAGlance";
import RelatedServices from "@/components/RelatedServices";
import FaqSection from "@/components/FaqSection";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import PartnerLogo from "@/components/PartnerLogo";
import type { PartnerKey } from "@/data/partners";

export const metadata: Metadata = pageMetadata("security");

const items = [
  { logo: "comodo" as PartnerKey, vendor: "Comodo SSL", name: "SSL Certificate", text: "Our certificates protect your personal data, including passwords, credit cards and identity information." },
  { logo: "sitelock" as PartnerKey, vendor: "SiteLock", name: "Website Security", text: "Over 5,000 websites get attacked every day. Get SiteLock and secure your website from hackers, viruses and malware." },
  { logo: "codeguard" as PartnerKey, vendor: "CodeGuard", name: "Website Backup", text: "Secure your website in just a few minutes. CodeGuard’s cloud backup lets you recover your website data instantly." },
];

export default function Security() {
  return (
    <>
      <PageHero layer={4} title="SSL, Security & Backup Addons" intro="Protect your website, your visitors’ data and your content with these add-on services." />
      <PageSchema page="security" />
      <AtAGlance page="security" />
      <section className="section">
        <div className="wrap grid-3">
          {items.map((i) => (
            <article className="product" key={i.name}>
              <div className="product__body">
                <PartnerLogo name={i.logo} />
                <h2 className="product__name" style={{ fontSize: "1.35rem" }}>{i.name}</h2>
                <p>{i.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <FaqSection page="security" tone="paper" />
      <RelatedServices page="security" />
      <CtaBand title="Add protection to your site" text="Ask us which security and backup add-ons suit your website." />
    </>
  );
}
