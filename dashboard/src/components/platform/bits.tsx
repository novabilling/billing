"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import {
  flagLabels,
  stageLabels,
  type AccessMode,
  type CurrencyMap,
  type TenantBillingState,
  type HealthFlag,
  type LedgerSummary,
  type TenantStage,
} from "@/lib/api/platform";

const accessLabels: Record<AccessMode, string> = { FULL: "Full access", READ_ONLY: "Read-only", SUSPENDED: "Suspended" };

export function AccessBadge({ mode }: { mode: AccessMode }) {
  if (mode === "FULL") return null;
  return <Badge variant={mode === "SUSPENDED" ? "error" : "warning"}>{accessLabels[mode]}</Badge>;
}

const billingLabels: Record<string, string> = { trialing: "Trial", active: "Paid", past_due: "Past due", canceled: "Canceled" };

export function BillingBadge({ billing }: { billing: TenantBillingState | null }) {
  if (!billing) return null;
  const variant = billing.status === "past_due" || billing.status === "canceled" ? "warning" : "outline";
  return <Badge variant={variant}>{billingLabels[billing.status] ?? billing.status}</Badge>;
}

export function StageBadge({ stage }: { stage: TenantStage }) {
  const variant = stage === "active" ? "success" : stage === "registered" ? "outline" : "default";
  return <Badge variant={variant}>{stageLabels[stage]}</Badge>;
}

const criticalFlags: HealthFlag[] = ["ledger_unbalanced", "high_error_rate", "deactivated"];

export function FlagBadges({ flags }: { flags: HealthFlag[] }) {
  if (flags.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((flag) => (
        <Badge key={flag} variant={criticalFlags.includes(flag) ? "error" : "warning"}>
          {flagLabels[flag]}
        </Badge>
      ))}
    </div>
  );
}

export function LedgerBadge({ ledger }: { ledger: LedgerSummary | null }) {
  if (!ledger) return <Badge variant="outline">Not synced</Badge>;
  if (ledger.lastError?.includes("schema:sync-tenants")) return <Badge variant="warning">Tables missing</Badge>;
  if (!ledger.balanced) return <Badge variant="error">Out of balance</Badge>;
  if (ledger.warnings > 0) return <Badge variant="warning">Balanced · {ledger.warnings} warning</Badge>;
  return <Badge variant="success">Balanced</Badge>;
}

/** Renders {"UGX": "1250000.0000", "USD": "12.5"} as stacked formatted amounts. */
export function CurrencyAmounts({ amounts, className }: { amounts: CurrencyMap | null | undefined; className?: string }) {
  const entries = Object.entries(amounts ?? {}).filter(([, v]) => Number(v) !== 0);
  if (entries.length === 0) return <span className={cn("text-muted-foreground", className)}>—</span>;
  return (
    <div className={cn("flex flex-col tabular-nums", className)}>
      {entries.map(([currency, value]) => (
        <span key={currency}>{formatCurrency(Number(value), currency, { showSymbol: false })}</span>
      ))}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "good" | "warn" | "bad";
}) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div
        className={cn(
          "mt-2 text-2xl font-bold tabular-nums",
          tone === "good" && "text-green-600",
          tone === "warn" && "text-amber-600",
          tone === "bad" && "text-red-600",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export const percent = (ratio: number) => `${(ratio * 100).toFixed(ratio > 0 && ratio < 0.01 ? 2 : 1)}%`;
export const compact = (n: number) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

/** API usage is bucketed by hour, so "last API call" is only precise to the hour. */
export function lastCallLabel(lastApiCall: string | null, relative: (d: string) => string): string {
  if (!lastApiCall) return "Never";
  return Date.now() - new Date(lastApiCall).getTime() < 60 * 60 * 1000 ? "Within the last hour" : relative(lastApiCall);
}

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
