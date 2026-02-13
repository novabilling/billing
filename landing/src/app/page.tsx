import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CreditCard,
  FileText,
  BarChart3,
  Webhook,
  CalendarClock,
  Check,
  ExternalLink,
  Github,
  Globe,
  Shield,
  Zap,
  Code2,
  Users,
  Layers,
  TrendingUp,
  Lock,
  RefreshCw,
  Smartphone,
  Wallet,
  CircleDollarSign,
  Activity,
  Gauge,
  Receipt,
  Tag,
  Star,
} from "lucide-react";
import Header from "@/components/header";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:4002";
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:4003";
const API_REF_URL =
  process.env.NEXT_PUBLIC_API_REF_URL || "http://localhost:4000/api/reference";
const GITHUB_URL = "https://github.com/novabilling/novabilling";

/* ================================================================
   HERO
   ================================================================ */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(109,40,217,.12), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 -z-10 h-[600px] w-[600px] opacity-20"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(236,72,153,.15), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-xs font-medium text-[var(--muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Open source &middot; 40+ currencies &middot; 6 payment providers
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              Open-source billing{" "}
              <span className="text-gradient">for the rest of us.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[var(--muted)] max-w-xl">
              Subscriptions, usage-based metering, invoicing, and prepaid
              wallets. Connect Stripe, Paystack, Flutterwave, DPO, PayU, or
              PesaPal &mdash; bill customers anywhere with one API.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-[var(--primary-light)] hover:shadow-purple-500/30 hover:gap-3"
              >
                <Github className="h-4 w-4" />
                Star on GitHub{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={DOCS_URL}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[var(--card-hover)]"
              >
                Get Started <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Social proof hint */}
            <div className="mt-10 flex items-center gap-6 text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--accent-green)]" />
                AGPL-3.0 licensed
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[var(--accent-blue)]" />
                AES-256 encryption
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[var(--primary)]" />
                40+ currencies
              </div>
            </div>
          </div>

          {/* Code window */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--accent-pink)]/10 blur-xl" />
            <div className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 glow-card">
              <div className="flex items-center gap-1.5 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-[var(--muted)]">
                  billing.ts
                </span>
              </div>
              <pre className="overflow-x-auto rounded-b-lg bg-[var(--code-bg)] p-5 text-[13px] leading-6 text-gray-300">
                <code>{`import { NovaBillingClient } from "novabilling";

const nova = new NovaBillingClient({
  token: process.env.NOVA_API_KEY,
});

// Track usage events for metered billing
await nova.events.create({
  subscriptionId: "sub_abc",
  code: "api_requests",
  properties: { endpoint: "/v1/users" },
});

// Create a customer with prepaid wallet
const customer = await nova.customers.create({
  externalId: "user_123",
  email: "amina@kampaltech.ug",
  currency: "UGX",
});

await nova.wallets.create({
  customerId: customer.id,
  currency: "UGX",
  grantedCredits: 50000,
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PROVIDER LOGOS / TRUST BAR
   ================================================================ */
function ProviderBar() {
  const providers = [
    { name: "Stripe", desc: "Global cards & wallets" },
    { name: "Paystack", desc: "Nigeria, Ghana & more" },
    { name: "Flutterwave", desc: "Pan-African payments" },
    { name: "DPO Group", desc: "Southern & East Africa" },
    { name: "PayU", desc: "South Africa & global" },
    { name: "PesaPal", desc: "East African payments" },
  ];

  return (
    <section className="border-t border-b border-[var(--border)] bg-[var(--card)]/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
          One API. Six payment providers. Infinite reach.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {providers.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-5 transition-colors hover:border-[var(--primary)]/30"
            >
              <CreditCard className="h-6 w-6 text-[var(--primary)]" />
              <span className="text-sm font-semibold">{p.name}</span>
              <span className="text-xs text-[var(--muted)] text-center">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   VALUE PROPOSITION -- WHY NOVABILLING
   ================================================================ */
function WhyNova() {
  const reasons = [
    {
      icon: Globe,
      title: "Borderless by default",
      description:
        "Support 40+ currencies across Africa, Europe, and beyond. Automatic currency matching routes payments to the right provider.",
      color: "var(--primary)",
    },
    {
      icon: Github,
      title: "Open source, self-hostable",
      description:
        "AGPL-3.0 licensed. Deploy on your own infrastructure with Docker. No vendor lock-in, no per-transaction fees from us.",
      color: "var(--accent-blue)",
    },
    {
      icon: Zap,
      title: "Ship in minutes, not months",
      description:
        "Type-safe SDKs for TypeScript and Python. Create customers, plans, subscriptions, and track usage with a few lines of code.",
      color: "var(--accent-orange)",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            Why NovaBilling
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            The billing platform{" "}
            <span className="text-gradient">Africa deserves</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Inspired by Stripe&apos;s developer experience and Lago&apos;s flexibility
            &mdash; open source and purpose-built for businesses that operate across borders.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 transition-all hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                style={{
                  backgroundColor: `color-mix(in srgb, ${r.color} 12%, transparent)`,
                  color: r.color,
                }}
              >
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FEATURES -- DEEP DIVE
   ================================================================ */
const features = [
  {
    icon: CalendarClock,
    title: "Smart Subscriptions",
    description:
      "Free trials, upgrades, downgrades, pausing, and automated renewals. Proration handled automatically with credit notes.",
  },
  {
    icon: Activity,
    title: "Usage-Based Billing",
    description:
      "Track events with 6 aggregation types (COUNT, SUM, MAX, UNIQUE_COUNT, LATEST, WEIGHTED_SUM). Bill on actual usage, not estimates.",
  },
  {
    icon: Gauge,
    title: "5 Charge Models",
    description:
      "Standard, graduated, volume, package, and percentage pricing. Mix flat fees with usage charges on any plan.",
  },
  {
    icon: Wallet,
    title: "Prepaid Wallets",
    description:
      "Customer credit wallets with purchased and granted credits. Auto-deducted from invoices. Expiration support built in.",
  },
  {
    icon: Receipt,
    title: "Taxes & Overrides",
    description:
      "Hierarchical tax rules (org > customer > plan > charge). Per-customer plan overrides for custom pricing.",
  },
  {
    icon: CreditCard,
    title: "6 Payment Providers",
    description:
      "Stripe, Paystack, Flutterwave, DPO Group, PayU, and PesaPal. Encrypted credentials with automatic routing.",
  },
  {
    icon: FileText,
    title: "Invoices & Checkout",
    description:
      "Auto-generated PDF invoices. Hosted checkout URLs. Email delivery on every billing event. Grace periods for draft invoices.",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description:
      "MRR breakdown, net revenue, churn cohorts, LTV metrics, and payment success rates. Filter by date, currency, and provider.",
  },
  {
    icon: Webhook,
    title: "Webhooks & Events",
    description:
      "Signature-verified webhooks for every billing event. Automatic retries with exponential backoff. Full event history.",
  },
  {
    icon: RefreshCw,
    title: "Smart Dunning",
    description:
      "Failed payments trigger automatic retries. Configurable retry schedules with email notifications at each stage.",
  },
  {
    icon: Building2,
    title: "Multi-Tenant Isolation",
    description:
      "Every tenant gets a dedicated database. No data leaks, no noisy neighbors. Provision tenants with a single API call.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "AES-256 credential encryption, JWT + API key dual auth, rate limiting, and per-tenant SMTP configuration.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="border-t border-[var(--border)] py-24 bg-[var(--card)]/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to bill globally
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Subscriptions, usage metering, prepaid wallets, taxes, and more
            &mdash; all in one open-source platform.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FOR TEAMS -- WHO IS IT FOR
   ================================================================ */
function ForTeams() {
  const teams = [
    {
      icon: Code2,
      role: "Developers",
      headline: "Ship billing without the headaches",
      points: [
        "Type-safe TypeScript & Python SDKs",
        "OpenAPI spec with Scalar interactive docs",
        "Usage event ingestion with idempotency",
        "Self-host with Docker in 5 minutes",
      ],
    },
    {
      icon: TrendingUp,
      role: "Business Leaders",
      headline: "Scale revenue across borders",
      points: [
        "Accept payments in 40+ currencies",
        "6 payment providers across Africa & globally",
        "MRR, churn, LTV, and net revenue analytics",
        "Open source -- no per-transaction platform fees",
      ],
    },
    {
      icon: Users,
      role: "Product Teams",
      headline: "Launch pricing changes in minutes",
      points: [
        "Usage-based, flat-rate, and hybrid pricing",
        "Prepaid wallets and promotional credits",
        "Trial periods, coupons, and plan overrides",
        "5 charge models for any pricing strategy",
      ],
    },
    {
      icon: Shield,
      role: "Security & Compliance",
      headline: "Enterprise-grade from day one",
      points: [
        "AES-256 encrypted provider credentials",
        "Isolated tenant databases (no data co-mingling)",
        "AGPL-3.0 -- full source code audit",
        "Per-tenant SMTP and webhook configuration",
      ],
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            Built for your team
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            NovaBilling works for everyone
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Whether you&apos;re writing code or watching dashboards, NovaBilling
            gives your team the tools to move fast.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {teams.map((t) => (
            <div
              key={t.role}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 transition-all hover:border-[var(--primary)]/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <t.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                    {t.role}
                  </p>
                  <h3 className="font-semibold">{t.headline}</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {t.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-[var(--muted)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-green)]" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CODE EXAMPLES -- DEVELOPER EXPERIENCE
   ================================================================ */
function DeveloperExperience() {
  return (
    <section className="border-t border-[var(--border)] py-24 bg-[var(--card)]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
              Developer Experience
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From zero to billing in 5 minutes
            </h2>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Self-host with Docker or use our SDKs generated from the OpenAPI
              spec. Full type safety, autocomplete, and comprehensive error
              handling.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                {
                  label: "Deploy with Docker",
                  detail: "docker compose up -d -- that's it",
                },
                {
                  label: "Connect a payment provider",
                  detail: "Stripe, Paystack, Flutterwave, DPO, PayU, or PesaPal",
                },
                {
                  label: "Create plans & track usage",
                  detail:
                    "Multi-currency pricing with 5 charge models and event metering",
                },
                {
                  label: "Start billing",
                  detail:
                    "Subscriptions, invoices, wallets, and dunning -- all automated",
                },
              ].map((step, i) => (
                <li key={step.label} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-xs text-[var(--muted)]">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={DOCS_URL}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-light)]"
              >
                Read the quickstart{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={API_REF_URL}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
              >
                API Reference <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {/* Docker quick start */}
            <div className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 glow-card">
              <div className="flex items-center gap-1.5 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-[var(--muted)]">
                  terminal
                </span>
              </div>
              <pre className="overflow-x-auto rounded-b-lg bg-[var(--code-bg)] p-5 text-[13px] leading-6 text-gray-300">
                <code>{`# Clone and run
git clone https://github.com/novabilling/novabilling
cd novabilling
docker compose up -d

# API is live at http://localhost:4000
# Dashboard at http://localhost:4002
# Docs at http://localhost:4003`}</code>
              </pre>
            </div>

            {/* Usage-based billing example */}
            <div className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 glow-card">
              <div className="flex items-center gap-1.5 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-[var(--muted)]">
                  usage-billing.ts
                </span>
              </div>
              <pre className="overflow-x-auto rounded-b-lg bg-[var(--code-bg)] p-5 text-[13px] leading-6 text-gray-300">
                <code>{`// Define a usage metric
await nova.billableMetrics.create({
  name: "API Requests",
  code: "api_requests",
  aggregationType: "COUNT",
});

// Attach a graduated charge to a plan
await nova.charges.create({
  planId: plan.id,
  billableMetricId: metric.id,
  chargeModel: "GRADUATED",
  graduatedRanges: [
    { fromValue: 0, toValue: 1000, perUnitAmount: 0 },
    { fromValue: 1001, toValue: null, perUnitAmount: 0.002 },
  ],
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CURRENCIES -- GLOBAL REACH
   ================================================================ */
function GlobalReach() {
  const currencies = [
    // African
    { code: "NGN", name: "Nigerian Naira", region: "West Africa" },
    { code: "KES", name: "Kenyan Shilling", region: "East Africa" },
    { code: "UGX", name: "Ugandan Shilling", region: "East Africa" },
    { code: "GHS", name: "Ghanaian Cedi", region: "West Africa" },
    { code: "ZAR", name: "South African Rand", region: "Southern Africa" },
    { code: "TZS", name: "Tanzanian Shilling", region: "East Africa" },
    { code: "RWF", name: "Rwandan Franc", region: "East Africa" },
    { code: "EGP", name: "Egyptian Pound", region: "North Africa" },
    { code: "ETB", name: "Ethiopian Birr", region: "East Africa" },
    { code: "XOF", name: "CFA Franc (BCEAO)", region: "West Africa" },
    { code: "XAF", name: "CFA Franc (BEAC)", region: "Central Africa" },
    { code: "MAD", name: "Moroccan Dirham", region: "North Africa" },
    { code: "DZD", name: "Algerian Dinar", region: "North Africa" },
    { code: "ZMW", name: "Zambian Kwacha", region: "Southern Africa" },
    { code: "BWP", name: "Botswana Pula", region: "Southern Africa" },
    { code: "MUR", name: "Mauritian Rupee", region: "Indian Ocean" },
    { code: "NAD", name: "Namibian Dollar", region: "Southern Africa" },
    { code: "MZN", name: "Mozambican Metical", region: "Southern Africa" },
    { code: "AOA", name: "Angolan Kwanza", region: "Central Africa" },
    { code: "TND", name: "Tunisian Dinar", region: "North Africa" },
    { code: "SOS", name: "Somali Shilling", region: "East Africa" },
    { code: "GMD", name: "Gambian Dalasi", region: "West Africa" },
    { code: "MWK", name: "Malawian Kwacha", region: "Southern Africa" },
    { code: "LRD", name: "Liberian Dollar", region: "West Africa" },
    { code: "SLL", name: "Sierra Leonean Leone", region: "West Africa" },
    { code: "CVE", name: "Cape Verdean Escudo", region: "West Africa" },
    { code: "SCR", name: "Seychellois Rupee", region: "Indian Ocean" },
    { code: "SZL", name: "Swazi Lilangeni", region: "Southern Africa" },
    // Global
    { code: "USD", name: "US Dollar", region: "International" },
    { code: "EUR", name: "Euro", region: "International" },
    { code: "GBP", name: "British Pound", region: "International" },
    { code: "CAD", name: "Canadian Dollar", region: "International" },
    { code: "AUD", name: "Australian Dollar", region: "International" },
    { code: "JPY", name: "Japanese Yen", region: "International" },
    { code: "CNY", name: "Chinese Yuan", region: "International" },
    { code: "INR", name: "Indian Rupee", region: "International" },
    { code: "BRL", name: "Brazilian Real", region: "International" },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            Global Reach
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {currencies.length} currencies. One integration.
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            The widest African currency coverage of any open-source billing
            platform. Bill customers in their local currency with automatic
            provider routing.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {currencies.map((c) => (
            <div
              key={c.code}
              className="group relative rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm transition-all hover:border-[var(--primary)]/40 hover:shadow-sm"
            >
              <span className="font-mono font-semibold">{c.code}</span>
              <span className="ml-2 text-[var(--muted)]">{c.name}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "40+", label: "Countries supported" },
            { value: "6", label: "Payment providers" },
            { value: `${currencies.length}`, label: "Currencies" },
            { value: "5", label: "Charge models" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-gradient sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   HOW IT WORKS
   ================================================================ */
function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Github,
      title: "Clone & deploy",
      description:
        "One command to spin up the full stack with Docker. API, dashboard, docs, and worker processes -- all included.",
    },
    {
      step: "02",
      icon: CreditCard,
      title: "Connect providers",
      description:
        "Add Stripe, Paystack, Flutterwave, DPO, PayU, or PesaPal credentials. Encrypted with AES-256 at rest.",
    },
    {
      step: "03",
      icon: CircleDollarSign,
      title: "Define pricing",
      description:
        "Create plans with multi-currency prices, usage charges, and prepaid wallets. 5 charge models for any strategy.",
    },
    {
      step: "04",
      icon: Wallet,
      title: "Start billing",
      description:
        "Subscriptions, invoices, payments, and dunning -- all automated. Track everything in the dashboard.",
    },
  ];

  return (
    <section className="border-t border-[var(--border)] py-24 bg-[var(--card)]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Four steps to global billing
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-[var(--border)] lg:block" />
              )}
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <s.icon className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                  Step {s.step}
                </span>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PRICING
   ================================================================ */
const tiers = [
  {
    name: "Community",
    price: "Free",
    period: "",
    description: "Self-host the full platform. No limits, no strings attached.",
    features: [
      "All features included",
      "Unlimited tenants & customers",
      "All 6 payment providers",
      "Usage-based billing & wallets",
      "Full dashboard & analytics",
      "Community support on GitHub",
    ],
    cta: "Deploy Now",
    ctaHref: GITHUB_URL,
    highlighted: true,
  },
  {
    name: "Cloud",
    price: "$49",
    period: "/mo",
    description: "We host and manage everything. You focus on your product.",
    features: [
      "Everything in Community",
      "Managed infrastructure",
      "Automatic updates & backups",
      "Priority email support",
      "99.9% uptime SLA",
      "Custom domain for dashboard",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale, multi-entity billing operations.",
    features: [
      "Everything in Cloud",
      "Dedicated database cluster",
      "Custom SLA & uptime guarantee",
      "SSO / SAML integration",
      "On-premise deployment support",
      "Dedicated account manager",
    ],
    cta: "Contact Us",
    ctaHref: "mailto:hello@novabilling.co",
    highlighted: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Free to self-host. Forever.
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            The full platform is open source and free to deploy. Need managed
            hosting? We&apos;ve got you covered.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                tier.highlighted
                  ? "border-[var(--primary)] shadow-xl shadow-purple-500/10 scale-[1.02]"
                  : "border-[var(--border)] hover:border-[var(--primary)]/30"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[var(--primary)] px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-500/25">
                    Most Popular
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-[var(--muted)]">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {tier.description}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-green)]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={tier.ctaHref}
                target={tier.ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={tier.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`mt-8 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-light)] hover:shadow-md"
                    : "border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   COMPARISON
   ================================================================ */
function Comparison() {
  const rows = [
    { feature: "Open source", nova: true, lago: true, stripe: false },
    { feature: "Self-hostable", nova: true, lago: true, stripe: false },
    { feature: "Usage-based billing", nova: true, lago: true, stripe: true },
    { feature: "Prepaid wallets", nova: true, lago: true, stripe: false },
    { feature: "African payment providers", nova: true, lago: false, stripe: false },
    { feature: "Multi-tenant isolation", nova: true, lago: false, stripe: false },
    { feature: "Graduated & volume pricing", nova: true, lago: true, stripe: true },
    { feature: "Smart dunning", nova: true, lago: true, stripe: true },
    { feature: "Free self-hosted tier", nova: true, lago: "Limited", stripe: false },
    { feature: "Premium self-hosted price", nova: "Free", lago: "$9,000/yr", stripe: "N/A" },
  ];

  return (
    <section className="border-t border-[var(--border)] py-24 bg-[var(--card)]/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            How we compare
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            NovaBilling vs. the alternatives
          </h2>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-3 pr-4 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--primary)]">NovaBilling</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--muted)]">Lago</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--muted)]">Stripe Billing</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-[var(--border)]/50">
                  <td className="py-3 pr-4 text-[var(--muted)]">{row.feature}</td>
                  {[row.nova, row.lago, row.stripe].map((val, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      {val === true ? (
                        <Check className="mx-auto h-4 w-4 text-[var(--accent-green)]" />
                      ) : val === false ? (
                        <span className="text-[var(--muted)]">&mdash;</span>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CTA -- FINAL CALL TO ACTION
   ================================================================ */
function FinalCTA() {
  return (
    <section className="border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ready to <span className="text-gradient">go borderless?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
          Deploy NovaBilling in minutes. Open source, self-hostable, and free
          forever. Join the community building the future of billing.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-[var(--primary-light)] hover:shadow-purple-500/30 hover:gap-3"
          >
            <Github className="h-4 w-4" />
            Star on GitHub{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={DOCS_URL}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-8 py-3.5 text-sm font-semibold transition-colors hover:bg-[var(--card-hover)]"
          >
            Read the Docs
          </a>
        </div>
        <p className="mt-6 text-xs text-[var(--muted)]">
          AGPL-3.0 licensed. All features included. No credit card required.
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                <Zap className="h-4 w-4" />
              </span>
              Nova<span className="text-[var(--primary)]">Billing</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">
              Open-source billing infrastructure for SaaS. Subscriptions, usage
              metering, invoicing, and wallets &mdash; with native support for
              African and global payment providers.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:text-[var(--fg)] hover:border-[var(--primary)]/30"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href={DASHBOARD_URL}
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href={API_REF_URL}
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Developers</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={DOCS_URL}
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href={`${DOCS_URL}/getting-started/quickstart`}
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Quickstart
                </a>
              </li>
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`${DOCS_URL}/sdks/typescript`}
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  TypeScript SDK
                </a>
              </li>
              <li>
                <a
                  href={`${DOCS_URL}/sdks/python`}
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Python SDK
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Community</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`${GITHUB_URL}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Report a Bug
                </a>
              </li>
              <li>
                <a
                  href={`${GITHUB_URL}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Discussions
                </a>
              </li>
              <li>
                <a
                  href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Contributing
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@novabilling.co"
                  className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} NovaBilling. Released under AGPL-3.0.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProviderBar />
        <WhyNova />
        <Features />
        <ForTeams />
        <DeveloperExperience />
        <GlobalReach />
        <HowItWorks />
        <Comparison />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
