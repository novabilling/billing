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
import { PlatformGate } from "@/components/platform/platform-gate";
import { CurrencyAmounts, Stat, compact, percent, plural } from "@/components/platform/bits";
import { featureLabels, platformApi, type PlatformTenantDetail } from "@/lib/api/platform";
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
