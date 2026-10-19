"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, ArrowRight } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformGate } from "@/components/platform/platform-gate";
import {
  CurrencyAmounts,
  FlagBadges,
  LedgerBadge,
  Stat,
  StageBadge,
  compact,
  lastCallLabel,
  percent,
} from "@/components/platform/bits";
import {
  featureLabels,
  platformApi,
  type PlatformOverview,
  type PlatformTenantRow,
} from "@/lib/api/platform";
import { formatRelativeTime } from "@/lib/utils/date";
import { brand } from "@/lib/brand";

export default function PlatformOverviewPage() {
  return (
    <PlatformGate>
      <Overview />
    </PlatformGate>
  );
}

function Overview() {
  const [data, setData] = useState<PlatformOverview | null>(null);
  const [attention, setAttention] = useState<PlatformTenantRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [overview, tenants] = await Promise.all([
        platformApi.overview(),
        platformApi.tenants({ sort: "attention" }),
      ]);
      setData(overview);
      setAttention(tenants.data.filter((t) => t.flags.length > 0).slice(0, 8));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the platform overview");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await platformApi.refreshAll();
      // The rebuild runs in the background; give it a moment before re-reading.
      setTimeout(() => load().finally(() => setRefreshing(false)), 4000);
    } catch {
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

  const { tenants, api24h, funnel, money30d, ledger } = data;
  const funnelSteps = [
    { label: "Registered", value: funnel.registered },
    { label: "Provider connected", value: funnel.providerConnected },
    { label: "First payment", value: funnel.firstPayment },
    { label: "Active (30 days)", value: funnel.active30d },
  ];
  const maxFeature = Math.max(1, ...data.features.map((f) => f.tenants));
  const maxClient = Math.max(1, ...data.clients7d.map((c) => c.requests));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Platform</h1>
          <p className="text-sm text-muted-foreground">
            Who is using {brand.name} and how.{" "}
            {data.metricsAsOf ? `Tenant figures as of ${formatRelativeTime(data.metricsAsOf)}.` : "Tenant figures have not been built yet."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Rebuilding…" : "Rebuild tenant figures"}
          </Button>
          <Link href="/platform/tenants">
            <Button size="sm">
              All tenants <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Active tenants (30 days)"
          value={`${tenants.active30d} / ${tenants.total}`}
          hint={`${tenants.active7d} active this week · ${tenants.new30d} new this month`}
        />
        <Stat
          label="API requests (24 hours)"
          value={compact(api24h.requests)}
          hint={`${percent(api24h.errorRate)} errors · ${api24h.avgMs} ms average`}
          tone={api24h.serverErrors > 0 ? "warn" : undefined}
        />
        <Stat
          label="Payment volume (30 days)"
          value={<CurrencyAmounts amounts={money30d.paymentVolume} className="text-xl" />}
          hint={`${money30d.paymentsSucceeded} succeeded · ${money30d.paymentsFailed} failed`}
        />
        <Stat
          label="Ledgers in balance"
          value={`${ledger.balanced} / ${ledger.tracked}`}
          hint={
            ledger.unbalanced > 0
              ? `${ledger.unbalanced} out of balance`
              : ledger.notProvisioned > 0
                ? `${ledger.notProvisioned} need schema sync`
                : `${ledger.withWarnings} with wallet warnings`
          }
          tone={ledger.unbalanced > 0 ? "bad" : ledger.tracked > 0 ? "good" : undefined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">API traffic, last 14 days</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {data.daily.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tenant API calls recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.daily} margin={{ left: 0, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="day" tickFormatter={(d: string) => d.slice(5)} fontSize={12} />
                  <YAxis fontSize={12} width={40} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" name="Requests" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="errors" name="Errors" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onboarding funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnelSteps.map((step) => (
              <div key={step.label}>
                <div className="flex justify-between text-sm">
                  <span>{step.label}</span>
                  <span className="tabular-nums text-muted-foreground">{step.value}</span>
                </div>
                <div className="mt-1 h-2 rounded bg-muted">
                  <div
                    className="h-2 rounded bg-primary"
                    style={{ width: `${funnel.registered ? (step.value / funnel.registered) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Needs attention</CardTitle>
          <Link href="/platform/tenants?sort=attention" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {attention.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tenant has an open issue.</p>
          ) : (
            <div className="divide-y">
              {attention.map((t) => (
                <Link
                  key={t.id}
                  href={`/platform/tenants/${t.id}`}
                  className="flex flex-wrap items-center gap-3 py-3 hover:bg-accent/50 -mx-2 px-2 rounded"
                >
                  <div className="min-w-[180px] flex-1">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.lastApiCall ? `Last API call: ${lastCallLabel(t.lastApiCall, formatRelativeTime).toLowerCase()}` : "Never called the API"}
                    </p>
                  </div>
                  <StageBadge stage={t.stage} />
                  <FlagBadges flags={t.flags} />
                  <LedgerBadge ledger={t.ledger} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment providers</CardTitle>
          </CardHeader>
          <CardContent>
            {data.providers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No providers configured yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium pb-2">Provider</th>
                    <th className="text-right font-medium pb-2">Tenants</th>
                    <th className="text-right font-medium pb-2">Success (30d)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.providers.map((p) => {
                    const total = p.succeeded + p.failed;
                    return (
                      <tr key={p.provider} className="border-t">
                        <td className="py-2 capitalize">{p.provider}</td>
                        <td className="py-2 text-right tabular-nums">{p.tenants}</td>
                        <td className="py-2 text-right tabular-nums">
                          {total ? `${percent(p.succeeded / total)} of ${total}` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feature adoption</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.features.length === 0 && <p className="text-sm text-muted-foreground">No usage data yet.</p>}
            {data.features.map((f) => (
              <div key={f.feature} className="grid grid-cols-[120px_1fr_32px] items-center gap-2 text-sm">
                <span className="truncate">{featureLabels[f.feature] ?? f.feature}</span>
                <div className="h-2 rounded bg-muted">
                  <div className="h-2 rounded bg-primary" style={{ width: `${(f.tenants / maxFeature) * 100}%` }} />
                </div>
                <span className="text-right tabular-nums text-muted-foreground">{f.tenants}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clients and SDKs (7 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.clients7d.length === 0 && <p className="text-sm text-muted-foreground">No requests yet.</p>}
            {data.clients7d.map((c) => (
              <div key={c.client} className="grid grid-cols-[140px_1fr_48px] items-center gap-2 text-sm">
                <span className="truncate font-mono text-xs">{c.client}</span>
                <div className="h-2 rounded bg-muted">
                  <div className="h-2 rounded bg-primary/70" style={{ width: `${(c.requests / maxClient) * 100}%` }} />
                </div>
                <span className="text-right tabular-nums text-muted-foreground">{compact(c.requests)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Collections (30 days)"
          value={<CurrencyAmounts amounts={data.moneyMovement30d.collectionVolume} className="text-xl" />}
          hint={`${data.moneyMovement30d.collections} succeeded · ${data.moneyMovement30d.collectionsFailed} failed`}
        />
        <Stat
          label="Payouts (30 days)"
          value={<CurrencyAmounts amounts={data.moneyMovement30d.payoutVolume} className="text-xl" />}
          hint={`${data.moneyMovement30d.payouts} succeeded · ${data.moneyMovement30d.payoutsFailed} failed`}
        />
        <Stat label="Wallet transfers (30 days)" value={compact(data.moneyMovement30d.transfers)} />
        <Stat
          label="Need review"
          value={`${data.moneyMovement30d.stuck} stuck`}
          hint={`${data.moneyMovement30d.awaitingApproval} payouts waiting for tenant approval`}
          tone={data.moneyMovement30d.stuck > 0 ? "warn" : undefined}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Customers across tenants" value={compact(money30d.customers)} />
        <Stat label="Active subscriptions" value={compact(money30d.activeSubscriptions)} />
        <Stat
          label="Recurring revenue (monthly)"
          value={<CurrencyAmounts amounts={money30d.mrr} className="text-xl" />}
          hint="Plan prices of active subscriptions; excludes usage charges and overrides"
        />
      </div>
    </div>
  );
}
