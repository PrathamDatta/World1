import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PageEffects from "@/components/PageEffects";
import Cursor from "@/components/Cursor";
import { company } from "@/data/site";

const geist = localFont({ src: "../fonts/geist.woff2", variable: "--f-sans", weight: "100 900", display: "swap", fallback: ["system-ui", "Segoe UI", "sans-serif"] });
const geistMono = localFont({ src: "../fonts/geist-mono.woff2", variable: "--f-mono", weight: "100 900", display: "swap", preload: false, fallback: ["ui-monospace", "Menlo", "monospace"] });
const serif = localFont({ src: "../fonts/instrument-serif-italic.woff2", variable: "--f-serif", weight: "400", style: "italic", display: "swap", fallback: ["Georgia", "serif"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: `${company.name} | Cloud, Hosting, Email & IT Support in ${company.location}`, template: `%s | ${company.name}` },
  description: `${company.name} offers cloud hosting, web hosting, business email, domains, IT support and custom web applications from ${company.location}.`,
  openGraph: { type: "website", siteName: company.name, locale: "en_IN" },
};

export const viewport: Viewport = { themeColor: "#0b0c0d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <PageEffects />
        <Cursor />
      </body>
    </html>
  );
}
