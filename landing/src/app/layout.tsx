import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk, Unbounded } from "next/font/google";
import { faq } from "./faq";
import { keywords, site } from "@/lib/site";
import "./globals.css";

const display = Unbounded({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-unbounded", display: "swap" });
const sans = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-schibsted", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

const title = `${site.name}: ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  keywords,
  applicationName: site.name,
  category: "Billing software",
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    ...(site.twitter && { site: site.twitter, creator: site.twitter }),
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: [{ url: site.logo, type: "image/svg+xml" }, { url: "/logo.png", type: "image/png" }], apple: "/logo.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f4f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1114" },
  ],
};

/** Structured data: who we are, what the software is, and the FAQ shown on the page. */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    sameAs: [site.githubUrl],
    email: site.contactEmail,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    description: site.description,
    url: site.url,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Billing software",
    operatingSystem: "Linux, Docker, Web",
    license: `https://spdx.org/licenses/${site.license}.html`,
    codeRepository: site.githubUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Self-hosted, open source" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
