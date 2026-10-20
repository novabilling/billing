import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk, Unbounded } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";
import { brand } from "@/lib/brand";

const sans = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-schibsted" });
const display = Unbounded({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-unbounded" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: { default: `${brand.name} Dashboard`, template: `%s · ${brand.name}` },
  description: brand.tagline,
  applicationName: brand.name,
  icons: { icon: brand.logo, apple: "/logo.png" },
  // The dashboard is an app behind a sign-in; search engines should list the landing page and docs instead.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      {brand.primaryColor && (
        <head>
          <style>{`:root, .dark { --primary: ${brand.primaryColor}; --ring: ${brand.primaryColor}; }`}</style>
        </head>
      )}
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
