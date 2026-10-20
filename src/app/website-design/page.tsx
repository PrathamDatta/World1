import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import PartnerLogo from "@/components/PartnerLogo";

export const metadata: Metadata = {
  title: "Website Design",
  description: "Build a website without coding using ResellerClub Website Builder, or an app-like mobile website with Impress.ly. Custom design available from AdINET.",
};

function Wire({ mobile }: { mobile?: boolean }) {
  return mobile ? (
    <svg viewBox="0 0 120 200" width="110" style={{ margin: "0 auto" }} role="img" aria-label="Mobile website wireframe">
      <rect x="4" y="4" width="112" height="192" rx="14" fill="#fff" stroke="#131b31" strokeWidth="3" />
      <rect x="16" y="24" width="88" height="46" rx="4" fill="#131b31" />
      <rect x="16" y="82" width="88" height="8" rx="3" fill="#d9d5c9" />
      <rect x="16" y="98" width="62" height="8" rx="3" fill="#d9d5c9" />
      <rect x="16" y="120" width="40" height="40" rx="4" fill="#7d97ff" />
      <rect x="64" y="120" width="40" height="40" rx="4" fill="#ff5a4e" />
    </svg>
  ) : (
    <svg viewBox="0 0 200 140" width="190" style={{ margin: "0 auto" }} role="img" aria-label="Website wireframe">
      <rect x="4" y="4" width="192" height="132" rx="8" fill="#fff" stroke="#131b31" strokeWidth="3" />
      <rect x="4" y="4" width="192" height="20" rx="8" fill="#131b31" />
      <rect x="16" y="36" width="168" height="40" rx="4" fill="#7d97ff" opacity=".85" />
      <rect x="16" y="88" width="50" height="34" rx="4" fill="#d9d5c9" />
      <rect x="75" y="88" width="50" height="34" rx="4" fill="#d9d5c9" />
      <rect x="134" y="88" width="50" height="34" rx="4" fill="#d9d5c9" />
    </svg>
  );
}

export default function WebsiteDesign() {
  return (
    <>
      <PageHero
        layer={5}
        title="Website Design"
        intro="A website can cater to many organisational and individual needs, from reflecting the face of your organisation, to communicating your corporate identity, selling a product or negotiating with shareholders."
      />
      <section className="section">
        <div className="wrap grid-2">
          <article className="panel" style={{ textAlign: "center" }}>
            <Wire />
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}><PartnerLogo name="resellerclub" /></div>
            <h2>Website Builder</h2>
            <p>Create your own website instantly, with no coding or design skills required. Choose from ready-made themes.</p>
          </article>
          <article className="panel" style={{ textAlign: "center" }}>
            <Wire mobile />
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}><PartnerLogo name="impressly" /></div>
            <h2>Mobile Website Builder</h2>
            <p>Quickly create an app-like website. Use social media content or start from scratch to set up your site.</p>
          </article>
        </div>
        <div className="wrap" style={{ marginTop: 40 }}>
          <p className="lede">
            Need something built to your own requirements? See our{" "}
            <Link className="text-link" href="/custom-web-apps">custom web application development</Link>.
          </p>
        </div>
      </section>
      <CtaBand title="Get your website started" text="Tell us what the site needs to do and we will point you to the right builder or a custom design." />
    </>
  );
}
