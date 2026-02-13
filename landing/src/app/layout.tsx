import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaBilling - Open-Source Billing Infrastructure for the Rest of Us",
  description:
    "Open-source billing platform with subscriptions, usage-based metering, prepaid wallets, and 40+ currencies. Self-host with Docker. Stripe, Paystack, Flutterwave, DPO, PayU, PesaPal.",
  keywords: [
    "open source billing",
    "usage based billing",
    "subscription billing",
    "africa payments",
    "stripe",
    "flutterwave",
    "paystack",
    "dpo",
    "pesapal",
    "invoicing",
    "saas billing",
    "self hosted",
    "lago alternative",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
