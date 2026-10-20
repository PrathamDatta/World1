import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Contact AdINET Infosystems in Bengaluru for domains, hosting, email, IT support and web development enquiries.",
};

export default async function Contact({ searchParams }: { searchParams: Promise<{ domain?: string | string[] }> }) {
  const { domain } = await searchParams;
  const defaultDomain = (Array.isArray(domain) ? domain[0] : domain)?.slice(0, 253) ?? "";
  return (
    <>
      <PageHero title="Contact us" intro="Tell us what you need and our team will get back to you." />
      <section className="section">
        <div className="wrap split split--wide-left">
          <ContactForm defaultDomain={defaultDomain} />
          <aside>
            <h2 style={{ fontSize: "1.4rem" }}>{company.name}</h2>
            <ul className="contact-details">
              <li><span>Location</span>{company.location}</li>
              <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><span>Phone</span><a href={company.phoneHref}>{company.phone}</a></li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
