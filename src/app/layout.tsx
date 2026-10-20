import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PageEffects from "@/components/PageEffects";
import Cursor from "@/components/Cursor";
import { company } from "@/data/site";
import { pages } from "@/data/pages";
import { siteGraph } from "@/lib/jsonld";
import { isIndexable, siteUrl } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

const geist = localFont({ src: "../fonts/geist.woff2", variable: "--f-sans", weight: "100 900", display: "swap", fallback: ["system-ui", "Segoe UI", "sans-serif"] });
const geistMono = localFont({ src: "../fonts/geist-mono.woff2", variable: "--f-mono", weight: "100 900", display: "swap", preload: false, fallback: ["ui-monospace", "Menlo", "monospace"] });
const serif = localFont({ src: "../fonts/instrument-serif-italic.woff2", variable: "--f-serif", weight: "400", style: "italic", display: "swap", fallback: ["Georgia", "serif"] });

const origin = siteUrl();

export const metadata: Metadata = {
  ...(origin ? { metadataBase: new URL(origin) } : {}),
  title: { default: pages.home.title, template: `%s | ${company.name}` },
  description: pages.home.description,
  applicationName: company.name,
  // Preview/staging deployments must never be indexed.
  ...(isIndexable() ? {} : { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = { themeColor: "#040d1c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <JsonLd data={siteGraph()} />
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
