import { site } from "@/lib/site";

/** Shown on the page and published as FAQPage structured data; keep answers plain text. */
export const faq = [
  {
    question: `Is ${site.name} free and open source?`,
    answer: `Yes. ${site.name} is released under the AGPL-3.0 licence. You can self-host it with Docker at no cost, or use the hosted cloud if you would rather not run servers.`,
  },
  {
    question: "Can I bill customers with mobile money?",
    answer:
      "Yes. Collect and pay out with MTN MoMo and Airtel Money directly, or through Yo! Payments, Flutterwave, Eversend and other providers, alongside cards, bank transfers and PayPal.",
  },
  {
    question: "Does it support usage-based and subscription billing?",
    answer:
      "Both. Define plans with flat, tiered, package or per-unit pricing, meter usage events, apply coupons and add-ons, and invoice automatically on any billing interval.",
  },
  {
    question: "Do you hold my money?",
    answer: `No. Payments go to your own provider accounts or your own crypto wallet. ${site.name} sends instructions and records what happened in a double-entry ledger; it never holds funds.`,
  },
  {
    question: "Can I accept crypto?",
    answer:
      "Yes. Receive USDT on TRON, Ethereum or BNB Chain and Bitcoin straight to your own wallet with no processor, or use NOWPayments, Eversend or Binance Pay.",
  },
  {
    question: "Can my team use it with different permissions?",
    answer:
      "Yes. Invite teammates as owner, admin, finance, developer or viewer, and manage several organisations from one login.",
  },
  {
    question: "Which currencies are supported?",
    answer: "Over 40 currencies, including UGX, KES, NGN, GHS, TZS, RWF, ZAR, USD, EUR and GBP, with correct decimal handling for each.",
  },
];
