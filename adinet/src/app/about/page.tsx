import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import OrgDiagram from "@/components/OrgDiagram";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About us",
  description: "AdINET Infosystems is a Bengaluru IT services company offering total and cost-effective IT solutions, backed by a team of experienced professionals.",
};

export default function About() {
  return (
    <>
      <PageHero
        title="About AdINET Infosystems"
        intro="A young and dynamic Bengaluru organisation offering total and cost-effective IT solutions."
      />
      <section className="section">
        <div className="wrap split">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2>Total and cost-effective web solutions</h2>
            <p>
              AdINET, Bengaluru, provides total and cost-effective web solutions. One of our greatest strengths lies in
              the quality policy followed by us, as well as the professional approach we take towards executing every
              project through to the very end.
            </p>
            <p>
              The AdINET team comprises the best-of-breed professionals, who have excelled with in-depth knowledge in
              their respective areas. Our in-house design team can carry a project from initial requirement analysis,
              application study and prototype through to home page design, hosting, e-business planning, design and
              implementation.
            </p>
          </div>
          <div className="panel">
            <h3>How a project team works</h3>
            <p>Every project is organised around the client, supported by a director, a project advisor, a creative team and a programming team.</p>
            <OrgDiagram />
          </div>
        </div>
      </section>
      <section className="section section--mist">
        <div className="wrap split">
          <div>
            <p className="eyebrow">Where we work</p>
            <h2>Customers across India and overseas</h2>
          </div>
          <p className="lede">
            We serve customers in Bengaluru, Chennai, Hyderabad, Kerala (Cochin), Mumbai and other locations in India,
            as well as international customers in the USA, the Gulf region, Singapore and the UAE (Dubai).
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
