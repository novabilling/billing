import { apiFetch } from "./client";

export type MoneyType = "collection" | "payout" | "transfer";
export type MoneyStatus =
  | "requires_approval"
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "stuck"
  | "canceled";

export type Party =
  | { type: "mobile_money"; msisdn: string; network?: string; name?: string }
  | { type: "bank"; accountNumber: string; accountName: string; bankCode?: string; bankName?: string; transferType?: string }
  | { type: "paypal"; email: string; name?: string }
  | { type: "yo_account"; accountNumber: string; email: string; name?: string }
  | { type: "hosted"; email: string; name?: string };

export interface MoneyIntent {
  id: string;
  type: MoneyType;
  status: MoneyStatus;
  amount: string;
  currency: string;
  provider: string | null;
  rail: string;
  party: Party | null;
  description: string | null;
  reference: string | null;
  providerReference: string | null;
  providerTransactionId: string | null;
  providerStatus: string | null;
  paymentUrl: string | null;
  failureReason: string | null;
  fee: string | null;
  customerId: string | null;
  walletId: string | null;
  toWalletId: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface MoneySettings {
  collections: boolean;
  transfers: boolean;
  payouts: boolean;
  payoutApprovalThreshold: Record<string, string>;
  payoutDailyLimit: Record<string, string>;
}

export interface ProviderCapabilities {
  provider: string;
  capabilities: { collect: string[]; payout: string[]; balance: boolean; verifyPayee: boolean };
}

const path: Record<MoneyType, string> = { collection: "collections", payout: "payouts", transfer: "transfers" };

/** Each create call carries an Idempotency-Key so a double-click or retry never moves money twice. */
function idempotent(body: unknown): RequestInit {
  const key = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  return { method: "POST", body: JSON.stringify(body), headers: { "Idempotency-Key": key } };
}

export const moneyApi = {
  capabilities: () =>
    apiFetch<{ settings: MoneySettings; providers: ProviderCapabilities[] }>("/money/capabilities"),
  updateSettings: (patch: Partial<MoneySettings>) =>
    apiFetch<MoneySettings>("/money/settings", { method: "PATCH", body: JSON.stringify(patch) }),
  list: (type: MoneyType, params: { status?: string; page?: number } = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => [k, String(v)]),
    ).toString();
    return apiFetch<{ data: MoneyIntent[]; meta: { total: number; page: number; totalPages: number } }>(
      `/${path[type]}${q ? `?${q}` : ""}`,
    );
  },
  createCollection: (body: Record<string, unknown>) => apiFetch<MoneyIntent>("/collections", idempotent(body)),
  createPayout: (body: Record<string, unknown>) => apiFetch<MoneyIntent>("/payouts", idempotent(body)),
  createTransfer: (body: Record<string, unknown>) => apiFetch<MoneyIntent>("/transfers", idempotent(body)),
  approve: (id: string) => apiFetch<MoneyIntent>(`/payouts/${id}/approve`, { method: "POST" }),
  cancel: (type: MoneyType, id: string) => apiFetch<MoneyIntent>(`/${path[type]}/${id}/cancel`, { method: "POST" }),
  refresh: (type: MoneyType, id: string) => apiFetch<MoneyIntent>(`/${path[type]}/${id}/refresh`, { method: "POST" }),
  verifyPayee: (provider: string, payee: Party) =>
    apiFetch<{ valid: boolean; name?: string }>(`/money/providers/${provider}/verify-payee`, {
      method: "POST",
      body: JSON.stringify({ payee }),
    }),
  balance: (provider: string) =>
    apiFetch<{ provider: string; balances: Record<string, string> }>(`/money/providers/${provider}/balance`),
};

export const statusLabels: Record<MoneyStatus, string> = {
  requires_approval: "Needs approval",
  pending: "Pending",
  processing: "Processing",
  succeeded: "Succeeded",
  failed: "Failed",
  stuck: "Needs review",
  canceled: "Canceled",
};

export const railLabels: Record<string, string> = {
  mobile_money: "Mobile money",
  bank: "Bank account",
  paypal: "PayPal",
  yo_account: "Yo account",
  hosted: "Checkout link",
  wallet: "Wallet",
};

export function describeParty(party: Party | null): string {
  if (!party) return "—";
  switch (party.type) {
    case "mobile_money":
      return `${party.name ? `${party.name} · ` : ""}+${party.msisdn.replace(/^\+/, "")}`;
    case "bank":
      return `${party.accountName} · ${party.bankName ?? party.bankCode ?? "bank"} ${party.accountNumber}`;
    case "paypal":
    case "hosted":
      return party.email;
    case "yo_account":
      return `Yo ${party.accountNumber}`;
  }
}
