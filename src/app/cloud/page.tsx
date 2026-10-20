import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import PartnerLogo from "@/components/PartnerLogo";

export const metadata: Metadata = {
  title: "Cloud Hosting Services",
  description: "Public cloud, private cloud and SAP S/4 HANA cloud hosting from AdINET Infosystems, Bengaluru.",
};

const options = [
  {
    name: "Public Cloud",
    kind: "Shared, elastic infrastructure",
    text: "In a world of endless possibilities, we understand every computing need, each automation move and every technology update. Every business is unique in its own way, and so must be its cloud solution. We have engineered an intelligent cloud computing architecture for your business.",
  },
  {
    name: "Private Cloud",
    kind: "Dedicated, secure environment",
    text: "A private cloud that is scalable, secure, high-compute and flexible. With eNlight’s Private Cloud Solution, you combine the security and performance of a private cloud with the scalability and cost-effectiveness of a public cloud.",
  },
  {
    name: "SAP HANA",
    kind: "Enterprise workloads",
    text: "Make the move to SAP S/4 HANA on the eNlight cloud. Unleash the capabilities of your enterprise SAP S/4 HANA as you collaborate with SAP HANA experts who do everything else. Build, deploy, host, manage and monitor your HANA environment with expertise.",
  },
];

export default function Cloud() {
  return (
    <>
      <PageHero
        title="Cloud Hosting Services"
        intro="Choose a cloud that flexes like elastic. Rather than being hosted on one single instance of a physical server, your website is hosted on a virtual partition that draws on shared resources."
      />
      <section className="section">
        <div className="wrap">
          <div className="index-list">
            {options.map((o, i) => (
              <div className="index-row" key={o.name} style={{ cursor: "default" }}>
                <span className="num">0{i + 1}</span>
                <div>
                  <h3>{o.name}</h3>
                  {o.name === "SAP HANA" && <PartnerLogo name="saphana" />}
                  <p className="eyebrow" style={{ margin: "6px 0 0" }}>{o.kind}</p>
                </div>
                <p>{o.text}</p>
                <span />
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Find the right cloud for your workload" text="Describe what you need to run and our team will recommend public, private or SAP HANA hosting." />
    </>
  );
}
