import { apiFetch } from "./client";

export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  currency: string;
  balance: string;
}

export interface LedgerEntry {
  id: string;
  reference: string;
  type: string;
  description: string;
  sourceType: string;
  sourceId: string;
  effectiveAt: string;
  lines: { id: string; amount: string; currency: string; account: { code: string; name: string; type: string } }[];
}

export interface LedgerCheck {
  name: string;
  ok: boolean;
  informational?: boolean;
  details: Record<string, unknown>[];
}

export const ledgerApi = {
  accounts: () => apiFetch<LedgerAccount[]>("/ledger/accounts"),
  entries: (page = 1) =>
    apiFetch<{ data: LedgerEntry[]; meta: { total: number; page: number; totalPages: number } }>(`/ledger/entries?page=${page}&limit=25`),
  health: () => apiFetch<{ balanced: boolean; checkedAt: string; checks: LedgerCheck[] }>("/ledger/health"),
  sync: () => apiFetch<{ error?: string; projection?: { posted: number; failed: number } }>("/ledger/sync", { method: "POST" }),
};
