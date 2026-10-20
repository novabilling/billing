import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";
import { brand } from "@/lib/brand";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: `${brand.name} - Admin Dashboard`,
  description: brand.tagline,
  icons: { icon: brand.logo, apple: "/logo.png" },
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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
