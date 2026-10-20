import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { company } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: `${company.name} | Cloud, Hosting, Email & IT Support in ${company.location}`, template: `%s | ${company.name}` },
  description: `${company.name} offers cloud hosting, web hosting, business email, domains, IT support and custom web applications from ${company.location}.`,
  openGraph: { type: "website", siteName: company.name, locale: "en_IN" },
};

export const viewport: Viewport = { themeColor: "#090947", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
