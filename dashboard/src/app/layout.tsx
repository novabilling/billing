import type { Metadata } from "next";
// Fonts ship with the app (Fontsource) so builds never fetch from Google Fonts.
import "@fontsource-variable/unbounded";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "../styles/globals.css";
import { Providers } from "./providers";
import { brand } from "@/lib/brand";

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
    <html lang="en" suppressHydrationWarning>
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
