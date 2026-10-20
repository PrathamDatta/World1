import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import HostingCompare from "@/components/HostingCompare";
import PageHero from "@/components/PageHero";
import PartnerLogo from "@/components/PartnerLogo";
import Tabs from "@/components/Tabs";

export const metadata: Metadata = {
  title: "Cloud Hosting Services",
  description: "Public cloud, private cloud and SAP S/4 HANA cloud hosting from AdINET Infosystems, Bengaluru.",
};

const options = [
  {
    id: "public",
    name: "Public Cloud",
    text: "In a world of endless possibilities, we understand every computing need, each automation move and every technology update. Every business is unique in its own way, and so must be its cloud solution. We have engineered an intelligent cloud computing architecture for your business.",
  },
  {
    id: "private",
    name: "Private Cloud",
    text: "A private cloud that is scalable, secure, high-compute and flexible. With eNlight’s Private Cloud Solution, you combine the security and performance of a private cloud with the scalability and cost-effectiveness of a public cloud.",
  },
  {
    id: "sap",
    name: "SAP HANA",
    text: "Make the move to SAP S/4 HANA on the eNlight cloud. Unleash the capabilities of your enterprise SAP S/4 HANA as you collaborate with SAP HANA experts who do everything else. Build, deploy, host, manage and monitor your HANA environment with expertise.",
  },
];

export default function Cloud() {
  return (
    <>
      <PageHero
        layer={0}
        title="Cloud Hosting Services"
        intro="Choose a cloud that flexes like elastic. Rather than being hosted on one single instance of a physical server, your website is hosted on a virtual partition that draws on shared resources."
      />
      <section className="section" aria-labelledby="opts-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Choose a cloud</p>
            <h2 id="opts-title">Three ways to run in the cloud</h2>
          </div>
          <Tabs
            label="Cloud options"
            tabs={options.map((o) => ({
              id: o.id,
              label: o.name,
              content: (
                <div className="panel" style={{ maxWidth: 820 }}>
                  {o.id === "sap" && <PartnerLogo name="saphana" />}
                  <h3 style={{ fontSize: "1.6rem" }}>{o.name}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "1.08rem" }}>{o.text}</p>
                  <Link href="/contact" className="btn btn--primary">Ask about {o.name}</Link>
                </div>
              ),
            }))}
          />
        </div>
      </section>
      <section className="section section--navy" aria-labelledby="how-title">
        <div className="wrap split">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 id="how-title">Why a virtual partition?</h2>
            <p className="lede">Switch between the two models to see the difference.</p>
          </div>
          <HostingCompare />
        </div>
      </section>
      <CtaBand title="Find the right cloud for your workload" text="Describe what you need to run and our team will recommend public, private or SAP HANA hosting." />
    </>
  );
}
