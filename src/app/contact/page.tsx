import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { company } from "@/data/site";

export const metadata: Metadata = pageMetadata("contact");

export default function Contact() {
  return (
    <>
      <PageHero title="Contact us" intro="Tell us what you need and our team will get back to you." />
      <PageSchema page="contact" />
      <section className="section">
        <div className="wrap split split--wide-left">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
          <aside>
            <h2 style={{ fontSize: "1.4rem" }}>{company.name}</h2>
            <ul className="contact-details">
              <li><span>Location</span>{company.location}</li>
              <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><span>Phone</span><a href={company.phoneHref}>{company.phone}</a></li>
              <li><span>WhatsApp</span><a href={company.whatsappHref} target="_blank" rel="noopener noreferrer">{company.whatsapp}</a></li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
