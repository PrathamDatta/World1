import Link from "next/link";
import { company, footerServices } from "@/data/site";
import CookieSettingsButton from "./CookieSettingsButton";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <h2>Services</h2>
          <ul>
            {footerServices.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/contact">Contact us</Link></li>
          </ul>
          <p className="footer-about">
            {company.name} is a {company.location}-based IT services provider: cloud and web hosting, business email,
            domains, IT support, website design and custom web applications.
          </p>
        </div>
        <div className="contact-card">
          <h2>{company.name}</h2>
          <ul>
            <li>{company.location}</li>
            <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li><a href={company.phoneHref}>{company.phone}</a></li>
            <li><a href={company.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp {company.whatsapp}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-mark" aria-hidden="true" data-parallax>ADINET</div>
      <div className="footer-bar">
        <div className="wrap footer-bar__inner">
          <span>© {new Date().getFullYear()} {company.name}, {company.location}</span>
          <span>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
            <CookieSettingsButton />
          </span>
        </div>
      </div>
    </footer>
  );
}
