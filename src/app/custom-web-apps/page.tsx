import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import OrgDiagram from "@/components/OrgDiagram";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Custom Web Application Development",
  description: "Custom web application and portal development by AdINET's in-house team, from requirement analysis and prototype through to hosting and implementation.",
};

const core = ["MVC framework / Core", "Web / database integration", "HTML5, JavaScript, jQuery and AngularJS", "MS SQL and MySQL", "Turnkey portal development"];
const solution = ["Visualization", "Web-based application development", "Client-server application development", "Network application development on TCP/IP", "E-business solutions", "Portal maintenance"];

export default function CustomWebApps() {
  return (
    <>
      <PageHero
        layer={5}
        title="Custom Web Application Development"
        intro="AdINET’s in-house team can execute a project from initial requirement analysis, application study and prototype through to home page design, hosting, e-business planning, design and implementation."
      />
      <section className="section section--navy" aria-labelledby="stages-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">How a project runs</p>
            <h2 id="stages-title">From requirements to implementation</h2>
          </div>
          <ol className="stages" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {["Initial requirement analysis", "Application study", "Application prototype", "Home page design and hosting", "E-business planning", "Design and implementation"].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <div className="stack">
            <div className="panel">
              <h2 style={{ fontSize: "1.3rem" }}>Custom web-based applications: our core development</h2>
              <ul className="checklist">{core.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="panel">
              <h2 style={{ fontSize: "1.3rem" }}>A complete turnkey portal solution</h2>
              <ul className="checklist">{solution.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
          <div className="panel panel--white">
            <p className="eyebrow">Our team</p>
            <h2 style={{ fontSize: "1.5rem" }}>Built around the client</h2>
            <p>
              The AdINET team comprises best-of-breed professionals with in-depth knowledge in their respective areas.
              Each project is organised around you, the client.
            </p>
            <OrgDiagram />
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 40 }}>
          <p className="lede">
            We also build e-commerce and e-learning solutions, and provide SEO, API integration and custom REST API
            development.
          </p>
        </div>
      </section>
      <CtaBand title="Tell us about your application" text="Share your requirements and we will discuss scope, approach and next steps." />
    </>
  );
}
