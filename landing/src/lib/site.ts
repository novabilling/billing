/**
 * Everything brand- and deployment-specific on the landing page. Renaming
 * the product is a change of NEXT_PUBLIC_BRAND_* values, not of copy.
 */
const env = (key: string, fallback: string) => process.env[key] || fallback;

export const site = {
  name: env("NEXT_PUBLIC_BRAND_NAME", "PimaBill"),
  /** Shown in the header as two tones: name split at this index (0 = one tone). */
  nameSplit: Number(env("NEXT_PUBLIC_BRAND_NAME_SPLIT", "4")),
  tagline: env("NEXT_PUBLIC_BRAND_TAGLINE", "Open-source billing and money movement for Africa and beyond"),
  description: env(
    "NEXT_PUBLIC_BRAND_DESCRIPTION",
    "Open-source subscription and usage billing with mobile money, cards, bank payouts and crypto. MTN MoMo, Airtel Money, Flutterwave, Paystack, Stripe and more. Self-host or use the cloud.",
  ),
  url: env("NEXT_PUBLIC_SITE_URL", "https://pimabill.com").replace(/\/$/, ""),
  githubUrl: env("NEXT_PUBLIC_GITHUB_URL", "https://github.com/novabilling/billing"),
  dashboardUrl: env("NEXT_PUBLIC_DASHBOARD_URL", "http://localhost:4002"),
  docsUrl: env("NEXT_PUBLIC_DOCS_URL", "http://localhost:4003"),
  apiRefUrl: env("NEXT_PUBLIC_API_REF_URL", "http://localhost:4000/api/reference"),
  contactEmail: env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@pimabill.com"),
  twitter: env("NEXT_PUBLIC_TWITTER_HANDLE", ""),
  logo: env("NEXT_PUBLIC_BRAND_LOGO", "/logo.png"),
  license: "AGPL-3.0",
};

export const keywords = [
  "open source billing",
  "subscription billing API",
  "usage-based billing",
  "mobile money billing API",
  "MTN MoMo API integration",
  "Airtel Money API",
  "recurring payments Africa",
  "Flutterwave subscriptions",
  "Paystack subscriptions",
  "billing for SaaS in Africa",
  "self-hosted billing",
  "payouts API Uganda",
  "crypto payments USDT TRC20",
  "Lago alternative",
  "Chargebee alternative",
];
