"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PlatformGate } from "@/components/platform/platform-gate";
import { CurrencyAmounts, Stat, compact, percent, plural } from "@/components/platform/bits";
import { featureLabels, platformApi, type AccessMode, type PlatformTenantDetail } from "@/lib/api/platform";
import { formatDate, formatRelativeTime } from "@/lib/utils/date";

const checkLabels: Record<string, string> = {
  zero_sum_per_currency: "Debits equal credits in every currency",
  entries_balanced: "Every journal entry balances",
  cached_balances_match_lines: "Account balances match their lines",
  wallet_balances_match_ledger: "Wallet balances match the ledger",
};

export default function PlatformTenantPage() {
  return (
    <PlatformGate>
      <TenantDetail />
    </PlatformGate>
  );
}

function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PlatformTenantDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    platformApi
      .tenant(id)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load this tenant"));
  }, [id]);

  useEffect(load, [load]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await platformApi.refreshTenant(id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
      </Card>
    );
  }
  if (!data) return <div className="animate-shimmer h-96 rounded-lg" />;

  const { tenant, latest, ledger } = data;
  const requests30d = data.daily.reduce((n, d) => n + d.requests, 0);
  const errors30d = data.daily.reduce((n, d) => n + d.errors, 0);
  const providerStats = Object.entries(latest?.providerStats30d ?? {});

  return (
    <div className="space-y-6">
      <Link href="/platform/tenants" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Tenants
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            {!tenant.isActive && <Badge variant="error">Deactivated</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            {tenant.email} · {tenant.slug} · joined {formatDate(tenant.createdAt)}
            {tenant.country ? ` · ${tenant.country}` : ""}
          </p>
          <p className="text-xs text-muted-foreground font-mono mt-1">{tenant.id}</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing…" : "Refresh figures and ledger"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="API requests (30 days)"
          value={compact(requests30d)}
          hint={requests30d ? `${percent(errors30d / requests30d)} errors` : "No calls yet"}
        />
        <Stat
          label="Last dashboard login"
          value={<span className="text-lg">{tenant.lastLoginAt ? formatRelativeTime(tenant.lastLoginAt) : "Never"}</span>}
          hint={tenant.apiKeys.length ? plural(tenant.apiKeys.length, "named API key") : "Uses the account API key"}
        />
        <Stat
          label="Payment volume (30 days)"
          value={<CurrencyAmounts amounts={latest?.paymentVolume30d} className="text-xl" />}
          hint={latest ? `${latest.paymentsSucceeded30d} succeeded · ${latest.paymentsFailed30d} failed` : "Not built yet"}
        />
        <Stat
          label="Customers · subscriptions"
          value={latest ? `${compact(latest.customers)} · ${compact(latest.activeSubscriptions)}` : "—"}
          hint={latest?.firstPaymentAt ? `First payment ${formatDate(latest.firstPaymentAt)}` : "No payments yet"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Daily API requests, last 30 days</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            {data.daily.length === 0 ? (
              <p className="text-sm text-muted-foreground">This tenant has not called the API yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="day" tickFormatter={(d: string) => d.slice(5)} fontSize={12} />
                  <YAxis fontSize={12} width={40} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="requests" name="Requests" fill="var(--primary)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="errors" name="Errors" fill="#dc2626" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Providers" value={latest?.providersConfigured.join(", ") || "None connected"} />
            <Row label="Webhook endpoint" value={tenant.webhookConfigured ? "Configured" : "Not set"} />
            <Row
              label="Outbound webhooks (7d)"
              value={`${data.outboundWebhooks7d.delivered} delivered · ${data.outboundWebhooks7d.failed} failed`}
            />
            <Row label="Database" value={tenant.database?.isHealthy === false ? "Unhealthy" : "Healthy"} />
            <div>
              <p className="text-muted-foreground mb-1">Uses</p>
              <div className="flex flex-wrap gap-1">
                {(latest?.featuresUsed ?? []).length === 0 && <span>—</span>}
                {(latest?.featuresUsed ?? []).map((f) => (
                  <Badge key={f} variant="outline">
                    {featureLabels[f] ?? f}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Most used endpoints (7 days)</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {data.routes7d.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-muted-foreground">No calls in the last 7 days.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-4 py-2">Endpoint</th>
                    <th className="text-right font-medium px-4 py-2">Calls</th>
                    <th className="text-right font-medium px-4 py-2">Errors</th>
                    <th className="text-right font-medium px-4 py-2">Avg / max ms</th>
                  </tr>
                </thead>
                <tbody>
                  {data.routes7d.map((r) => (
                    <tr key={r.route} className="border-t">
                      <td className="px-4 py-2 font-mono text-xs">{r.route}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{compact(r.requests)}</td>
                      <td className={`px-4 py-2 text-right tabular-nums ${r.errors ? "text-red-600" : ""}`}>{r.errors}</td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {r.avgMs} / {r.maxMs}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clients (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.clients30d.length === 0 && <p className="text-muted-foreground">No calls yet.</p>}
            {data.clients30d.map((c) => (
              <div key={`${c.client}-${c.authMethod}`} className="flex justify-between gap-2">
                <span className="font-mono text-xs truncate">{c.client}</span>
                <span className="text-muted-foreground whitespace-nowrap">
                  {c.authMethod === "session" ? "dashboard" : "API key"} · {compact(c.requests)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <AccessControls tenantId={tenant.id} data={data} onChange={load} />
      <MoneyControls tenantId={tenant.id} data={data} onChange={load} />
      <CommissionEditor tenantId={tenant.id} rules={data.money.commission ?? {}} onSaved={load} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Providers (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {providerStats.length === 0 && <p className="text-muted-foreground">No payments in the last 30 days.</p>}
            {providerStats.map(([provider, s]) => {
              const total = s.succeeded + s.failed;
              return (
                <div key={provider} className="flex justify-between">
                  <span className="capitalize">{provider}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {s.succeeded} succeeded · {s.failed} failed{total ? ` · ${percent(s.succeeded / total)}` : ""}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ledger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {!ledger ? (
              <p className="text-muted-foreground">The ledger has not synced for this tenant yet.</p>
            ) : (
              <>
                <p className="text-muted-foreground">
                  {ledger.entriesPosted} entries posted
                  {ledger.lastSyncAt ? ` · last sync ${formatRelativeTime(ledger.lastSyncAt)}` : ""}
                  {ledger.failedPostings ? ` · ${ledger.failedPostings} failed in last run` : ""}
                </p>
                {ledger.lastError && <p className="text-amber-600">{ledger.lastError}</p>}
                {(ledger.checks ?? []).map((check) => (
                  <div key={check.name} className="flex items-start justify-between gap-3">
                    <span>{checkLabels[check.name] ?? check.name}</span>
                    <Badge variant={check.ok ? "success" : check.informational ? "warning" : "error"}>
                      {check.ok ? "OK" : plural(check.details.length, "issue")}
                    </Badge>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

const accessOptions: { mode: AccessMode; label: string; help: string }[] = [
  { mode: "FULL", label: "Full access", help: "Everything works." },
  { mode: "READ_ONLY", label: "Read-only", help: "Dashboard and API can read; nothing can be created or changed." },
  { mode: "SUSPENDED", label: "Suspended", help: "Nothing works until restored. They only see the reason." },
];

function AccessControls({ tenantId, data, onChange }: { tenantId: string; data: PlatformTenantDetail; onChange: () => void }) {
  const { access, billing, isPlatformOperator } = data.tenant;
  const [mode, setMode] = useState<AccessMode>(access.mode);
  const [reason, setReason] = useState(access.reason ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await platformApi.updateAccess(tenantId, { accessMode: mode, accessReason: mode === "FULL" ? null : reason.trim() || null });
      toast.success("Access updated");
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update access");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Access</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2 text-sm">
        {isPlatformOperator ? (
          <p className="text-muted-foreground">This is a platform operator organisation; its access cannot be limited.</p>
        ) : (
          <div className="space-y-3">
            {accessOptions.map((o) => (
              <label key={o.mode} className="flex items-start gap-3">
                <input type="radio" name="access" className="mt-1" checked={mode === o.mode} onChange={() => setMode(o.mode)} />
                <span>
                  <span className="font-medium">{o.label}</span>
                  <span className="block text-muted-foreground">{o.help}</span>
                </span>
              </label>
            ))}
            {mode !== "FULL" && (
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
                placeholder="Reason shown to the organisation"
                aria-label="Reason shown to the organisation"
              />
            )}
            <Button size="sm" onClick={save} disabled={saving || (mode === access.mode && (reason || null) === (access.reason || null))}>
              Save
            </Button>
          </div>
        )}
        <div className="space-y-3">
          <Row label="Billing" value={billing ? billing.status.replace("_", " ") : "—"} />
          <Row label="Plan" value={billing?.planName ?? billing?.planId ?? "—"} />
          <Row
            label="Limits"
            value={
              billing?.limits
                ? Object.entries(billing.limits)
                    .map(([k, v]) => (Array.isArray(v) ? `without ${v.join(", ").replace(/_/g, " ")}` : `${v} ${k.replace(/([A-Z])/g, " $1").toLowerCase()}`))
                    .join(" · ")
                : "None"
            }
          />
          <Row label="Trial ends" value={billing?.trialEndsAt ? formatDate(billing.trialEndsAt) : "—"} />
          {access.url && <Row label="Resolve link" value={<a className="underline" href={access.url}>Open</a>} />}
        </div>
      </CardContent>
    </Card>
  );
}

function MoneyControls({ tenantId, data, onChange }: { tenantId: string; data: PlatformTenantDetail; onChange: () => void }) {
  const [saving, setSaving] = useState(false);
  const money = data.money;
  const stats = data.latest?.moneyMovement30d ?? null;

  const update = async (patch: Partial<PlatformTenantDetail["money"]>) => {
    setSaving(true);
    try {
      await platformApi.updateMoney(tenantId, patch);
      toast.success("Saved");
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const limits = (map: Record<string, string>) =>
    Object.entries(map)
      .map(([c, v]) => `${Number(v).toLocaleString()} ${c}`)
      .join(", ") || "none";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Money movement</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2 text-sm">
        <div className="space-y-3">
          {(["collections", "transfers", "payouts"] as const).map((feature) => (
            <div key={feature} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium capitalize">{feature}</p>
                <p className="text-xs text-muted-foreground">
                  {feature === "payouts"
                    ? "Only operators can turn payouts on. Review the account and its limits first."
                    : "The tenant can also switch this in their own settings."}
                </p>
              </div>
              <Switch checked={money[feature]} disabled={saving} onCheckedChange={(v) => update({ [feature]: v })} />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Approval at or above: {limits(money.payoutApprovalThreshold)} · Daily limit: {limits(money.payoutDailyLimit)}
          </p>
        </div>
        <div className="space-y-2">
          {!stats ? (
            <p className="text-muted-foreground">No money movement in the last 30 days.</p>
          ) : (
            <>
              <Row
                label="Collections"
                value={
                  <span className="inline-flex flex-col items-end">
                    <span>{stats.collections.count} succeeded · {stats.collections.failed} failed</span>
                    <CurrencyAmounts amounts={stats.collections.volume} className="text-xs text-muted-foreground items-end" />
                  </span>
                }
              />
              <Row
                label="Payouts"
                value={
                  <span className="inline-flex flex-col items-end">
                    <span>{stats.payouts.count} succeeded · {stats.payouts.failed} failed</span>
                    <CurrencyAmounts amounts={stats.payouts.volume} className="text-xs text-muted-foreground items-end" />
                  </span>
                }
              />
              <Row label="Transfers" value={stats.transfers.count} />
              <Row
                label="Needs review"
                value={
                  <span className={stats.stuck ? "text-amber-600" : ""}>
                    {stats.stuck} stuck · {stats.awaitingApproval} awaiting approval
                  </span>
                }
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type Kind = "collection" | "payout" | "transfer";

/** One currency per rule in this editor; the API accepts several. */
function CommissionEditor({
  tenantId,
  rules,
  onSaved,
}: {
  tenantId: string;
  rules: PlatformTenantDetail["money"]["commission"];
  onSaved: () => void;
}) {
  const initial = (kind: Kind) => {
    const r = rules[kind];
    const currency = Object.keys({ ...r?.flat, ...r?.min, ...r?.max })[0] ?? "UGX";
    return {
      on: Boolean(r),
      rate: r?.rateBps ? String(r.rateBps / 100) : "",
      currency,
      flat: r?.flat?.[currency] ?? "",
      min: r?.min?.[currency] ?? "",
      max: r?.max?.[currency] ?? "",
      chargeTo: r?.chargeTo ?? "tenant",
    };
  };
  const [form, setForm] = useState({ collection: initial("collection"), payout: initial("payout"), transfer: initial("transfer") });
  const [saving, setSaving] = useState(false);
  const set = (kind: Kind, key: string, value: string | boolean) => setForm((f) => ({ ...f, [kind]: { ...f[kind], [key]: value } }));

  const save = async () => {
    const commission: Record<string, unknown> = {};
    for (const kind of ["collection", "payout", "transfer"] as const) {
      const f = form[kind];
      if (!f.on) continue;
      const c = f.currency.toUpperCase();
      commission[kind] = {
        ...(f.rate && { rateBps: Math.round(Number(f.rate) * 100) }),
        ...(f.flat && { flat: { [c]: f.flat } }),
        ...(f.min && { min: { [c]: f.min } }),
        ...(f.max && { max: { [c]: f.max } }),
        ...(kind === "collection" && f.chargeTo === "payer" && { chargeTo: "payer" }),
      };
    }
    setSaving(true);
    try {
      await platformApi.updateMoney(tenantId, { commission });
      toast.success("Commission saved");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save commission");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Platform commission</CardTitle>
        <p className="text-sm text-muted-foreground">
          Charged on settled movements and recorded in the tenant&apos;s ledger as owed to the platform. Off unless switched on here.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3 text-sm">
        {(["collection", "payout", "transfer"] as const).map((kind) => {
          const f = form[kind];
          return (
            <div key={kind} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium capitalize">{kind}s</p>
                <Switch checked={f.on} onCheckedChange={(v) => set(kind, "on", v)} />
              </div>
              {f.on && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Rate %" value={f.rate} onChange={(v) => set(kind, "rate", v)} placeholder="1.5" />
                  <Field label="Currency" value={f.currency} onChange={(v) => set(kind, "currency", v.toUpperCase())} placeholder="UGX" />
                  <Field label="Flat fee" value={f.flat} onChange={(v) => set(kind, "flat", v)} placeholder="0" />
                  <Field label="Minimum" value={f.min} onChange={(v) => set(kind, "min", v)} placeholder="none" />
                  <Field label="Maximum" value={f.max} onChange={(v) => set(kind, "max", v)} placeholder="none" />
                  {kind === "collection" && (
                    <label className="col-span-2 flex items-center gap-2 text-xs">
                      <input
                        id="commission-payer"
                        type="checkbox"
                        checked={f.chargeTo === "payer"}
                        onChange={(e) => set(kind, "chargeTo", e.target.checked ? "payer" : "tenant")}
                      />
                      Add it to what the payer pays
                    </label>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div className="lg:col-span-3">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save commission"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="space-y-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <input
        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
