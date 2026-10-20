import { apiFetch } from "./client";

export type TenantStage = "registered" | "provider_connected" | "first_payment" | "active";

export type HealthFlag =
  | "stalled_setup"
  | "inactive_14d"
  | "high_error_rate"
  | "payment_failures"
  | "ledger_unbalanced"
  | "ledger_not_provisioned"
  | "money_stuck"
  | "deactivated";

export type CurrencyMap = Record<string, string>;

export interface PlatformOverview {
  tenants: { total: number; deactivated: number; new30d: number; active7d: number; active30d: number };
  api24h: { requests: number; errors: number; serverErrors: number; errorRate: number; avgMs: number };
  funnel: { registered: number; providerConnected: number; firstPayment: number; active30d: number };
  money30d: {
    paymentVolume: CurrencyMap;
    mrr: CurrencyMap;
    paymentsSucceeded: number;
    paymentsFailed: number;
    customers: number;
    activeSubscriptions: number;
  };
  moneyMovement30d: {
    collections: number;
    collectionsFailed: number;
    collectionVolume: CurrencyMap;
    payouts: number;
    payoutsFailed: number;
    payoutVolume: CurrencyMap;
    transfers: number;
    stuck: number;
    awaitingApproval: number;
    commission: CurrencyMap;
  };
  providers: { provider: string; tenants: number; succeeded: number; failed: number }[];
  features: { feature: string; tenants: number }[];
  ledger: { tracked: number; balanced: number; unbalanced: number; withWarnings: number; notProvisioned: number };
  daily: { day: string; requests: number; errors: number; activeTenants: number }[];
  clients7d: { client: string; requests: number }[];
  metricsAsOf: string | null;
}

export interface LedgerSummary {
  balanced: boolean;
  warnings: number;
  lastError: string | null;
  lastCheckAt: string | null;
}

export type AccessMode = "FULL" | "READ_ONLY" | "SUSPENDED";

export interface TenantAccess {
  mode: AccessMode;
  reason: string | null;
  url: string | null;
}

export interface TenantBillingState {
  status: string;
  planId: string | null;
  trialEndsAt: string | null;
}

export interface PlatformTenantRow {
  id: string;
  name: string;
  slug: string;
  email: string;
  isActive: boolean;
  isPlatformOperator: boolean;
  accessMode: AccessMode;
  accessReason: string | null;
  billing: TenantBillingState | null;
  createdAt: string;
  lastLoginAt: string | null;
  lastApiCall: string | null;
  stage: TenantStage;
  flags: HealthFlag[];
  requests7d: number;
  errors7d: number;
  customers: number;
  activeSubscriptions: number;
  paymentVolume30d: CurrencyMap;
  paymentsFailed30d: number;
  providers: string[];
  features: string[];
  ledger: LedgerSummary | null;
  money: MoneySettings;
  moneyMovement30d: MoneyMovementStats | null;
}

export interface MoneySettings {
  collections: boolean;
  transfers: boolean;
  payouts: boolean;
  payoutApprovalThreshold: Record<string, string>;
  payoutDailyLimit: Record<string, string>;
  commission: Partial<Record<"collection" | "payout" | "transfer", CommissionRule>>;
}

export type { CommissionRule } from "./money";
import type { CommissionRule } from "./money";

export interface MoneyMovementStats {
  collections: { count: number; failed: number; volume: CurrencyMap };
  payouts: { count: number; failed: number; volume: CurrencyMap };
  transfers: { count: number };
  stuck: number;
  awaitingApproval: number;
  commission?: CurrencyMap;
}

export interface LedgerCheck {
  name: string;
  ok: boolean;
  informational?: boolean;
  details: Record<string, unknown>[];
}

export interface PlatformTenantDetail {
  tenant: {
    id: string;
    name: string;
    slug: string;
    email: string;
    isActive: boolean;
    isPlatformOperator: boolean;
    access: TenantAccess;
    billing: TenantBillingState | null;
    createdAt: string;
    lastLoginAt: string | null;
    webhookConfigured: boolean;
    country: string | null;
    database: { isHealthy: boolean; lastHealthCheck: string | null } | null;
    apiKeys: { name: string; lastUsed: string | null; createdAt: string; expiresAt: string | null }[];
  };
  latest: {
    date: string;
    customers: number;
    activeSubscriptions: number;
    invoicesIssued30d: number;
    paymentsSucceeded30d: number;
    paymentsFailed30d: number;
    paymentVolume30d: CurrencyMap | null;
    mrr: CurrencyMap | null;
    providerStats30d: Record<string, { succeeded: number; failed: number }> | null;
    providersConfigured: string[];
    featuresUsed: string[];
    firstPaymentAt: string | null;
    lastPaymentAt: string | null;
    moneyMovement30d: MoneyMovementStats | null;
    createdAt: string;
  } | null;
  history: { date: string; customers: number; activeSubscriptions: number; paymentsSucceeded30d: number; paymentsFailed30d: number }[];
  daily: { day: string; requests: number; errors: number; avgMs: number }[];
  routes7d: { route: string; requests: number; errors: number; avgMs: number; maxMs: number }[];
  clients30d: { client: string; authMethod: string; requests: number }[];
  outboundWebhooks7d: { delivered: number; failed: number };
  ledger: {
    balanced: boolean;
    warnings: number;
    entriesPosted: number;
    failedPostings: number;
    lastError: string | null;
    lastSyncAt: string | null;
    lastCheckAt: string | null;
    checks: LedgerCheck[] | null;
  } | null;
  money: MoneySettings;
}

export const platformApi = {
  me: () => apiFetch<{ isPlatformAdmin: boolean; access: TenantAccess }>("/admin/me"),
  overview: () => apiFetch<PlatformOverview>("/admin/overview"),
  tenants: (params: { search?: string; stage?: string; flag?: string; sort?: string } = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => Boolean(v)) as [string, string][],
    ).toString();
    return apiFetch<{ data: PlatformTenantRow[]; total: number }>(`/admin/tenants${query ? `?${query}` : ""}`);
  },
  tenant: (id: string) => apiFetch<PlatformTenantDetail>(`/admin/tenants/${id}`),
  refreshTenant: (id: string) =>
    apiFetch<{ refreshed: boolean }>(`/admin/tenants/${id}/refresh`, { method: "POST" }),
  refreshAll: () => apiFetch<{ started: boolean }>("/admin/metrics/refresh", { method: "POST" }),
  updateAccess: (id: string, patch: { accessMode: AccessMode; accessReason?: string | null }) =>
    apiFetch<unknown>(`/admin/tenants/${id}/access`, { method: "PATCH", body: JSON.stringify(patch) }),
  updateMoney: (id: string, patch: Partial<MoneySettings>) =>
    apiFetch<MoneySettings>(`/admin/tenants/${id}/money`, { method: "PATCH", body: JSON.stringify(patch) }),
};

export const stageLabels: Record<TenantStage, string> = {
  registered: "Registered",
  provider_connected: "Provider connected",
  first_payment: "First payment",
  active: "Active",
};

export const flagLabels: Record<HealthFlag, string> = {
  stalled_setup: "Stalled at setup",
  inactive_14d: "No API calls in 14 days",
  high_error_rate: "High error rate",
  payment_failures: "Payment failures",
  ledger_unbalanced: "Ledger out of balance",
  ledger_not_provisioned: "Ledger tables missing",
  money_stuck: "Payments need review",
  deactivated: "Deactivated",
};

export const featureLabels: Record<string, string> = {
  subscriptions: "Subscriptions",
  usage_metering: "Usage metering",
  wallets: "Wallets",
  coupons: "Coupons",
  add_ons: "Add-ons",
  credit_notes: "Credit notes",
  taxes: "Taxes",
  plan_overrides: "Plan overrides",
  saved_payment_methods: "Saved cards",
  webhooks: "Webhooks",
};
