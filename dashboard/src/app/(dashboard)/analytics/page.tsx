"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiClient } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/currency";
import { format } from "date-fns";
import { Download, Users, CreditCard, DollarSign, Activity, Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

/** Small info icon with a tooltip explaining the metric. */
function MetricTooltip({ text }: { text: string }) {
  return (
    <UITooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="More information about this metric"
          className="inline-flex items-center justify-center h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help align-middle focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
        >
          <Info
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-wrap">{text}</TooltipContent>
    </UITooltip>
  );
}

export default function AnalyticsPage() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<{
    arpu: number;
    arr: number;
    mrr: number;
    churnRate: string;
    successRate: string;
    totalRevenue: number;
    totalCustomers: number;
    trialingCount: number;
    totalSubscriptions: number;
    activePlansCount: number;
  } | null>(null);
  const [planDistribution, setPlanDistribution] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [mrrBreakdown, setMrrBreakdown] = useState<{
    totalMrr: number;
    newMrr: number;
    expansionMrr: number;
    contractionMrr: number;
    churnMrr: number;
    netNewMrr: number;
    byPlan: Array<{ planId: string; planName: string; mrr: number; subscriptionCount: number }>;
  } | null>(null);
  const [netRevenue, setNetRevenue] = useState<{
    grossRevenue: number;
    refunds: number;
    creditNotes: number;
    netRevenue: number;
  } | null>(null);
  const [cohorts, setCohorts] = useState<{
    months: string[];
    cohorts: Array<{ month: string; totalCustomers: number; retentionPercentages: number[] }>;
  } | null>(null);
  const [ltv, setLtv] = useState<{
    avgLtv: number;
    avgLifespanDays: number;
    byPlan: Array<{ planId: string; planName: string; avgLtv: number; avgLifespanDays: number }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        revenue,
        kpis,
        subs,
        plans,
        subAnalytics,
        mrrData,
        netRevData,
        cohortData,
        ltvData,
      ] = await Promise.all([
        apiClient.analytics.getRevenueData(),
        apiClient.analytics.getKPIs(),
        apiClient.subscriptions.list({ limit: 100 }),
        apiClient.plans.list(),
        fetch("/api/proxy/analytics/subscriptions", { credentials: "include" }).then((r) => r.json()),
        apiClient.analytics.getMrrBreakdown().catch(() => null),
        apiClient.analytics.getNetRevenue().catch(() => null),
        apiClient.analytics.getChurnCohorts(12).catch(() => null),
        apiClient.analytics.getLtv().catch(() => null),
      ]);

      setRevenueData(
        revenue.map((item) => ({
          ...item,
          month: format(new Date(item.date), "MMM"),
        })),
      );

      const subData = subAnalytics.data?.data || subAnalytics.data || subAnalytics;

      // Build plan distribution from subscription list
      const planMap = new Map<string, string>();
      plans.forEach((p) => planMap.set(p.id, p.name));
      const planCounts: Record<string, number> = {};
      (subs.data || []).forEach((s) => {
        const planName = s.planName || planMap.get(s.planId) || "Unknown";
        planCounts[planName] = (planCounts[planName] || 0) + 1;
      });
      const totalSubs = subs.data?.length || 1;
      setPlanDistribution(
        Object.entries(planCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count], idx) => ({
            name,
            value: Math.round((count / totalSubs) * 100),
            color: COLORS[idx % COLORS.length],
          })),
      );

      if (mrrData) setMrrBreakdown(mrrData);
      if (netRevData) setNetRevenue(netRevData);
      if (cohortData) setCohorts(cohortData);
      if (ltvData) setLtv(ltvData);

      // Use backend-aggregated KPIs for accuracy – avoids counting only the first
      // 100 subscriptions for metrics like distinct active plans.
      const activePlansCount = mrrData
        ? mrrData.byPlan.length
        : Number(subData.active) > 0
          ? Object.keys(planCounts).length
          : 0;

      setMetrics({
        arpu: kpis.arpu,
        arr: kpis.arr,
        mrr: kpis.mrr,
        churnRate: kpis.churnRate,
        successRate: kpis.successRate ? `${kpis.successRate.toFixed(2)}%` : "0.00%",
        totalRevenue: kpis.mrr * 12, // fallback; net revenue widget is more accurate
        totalCustomers: kpis.totalCustomers,
        trialingCount: Number(subData.trialing) || 0,
        totalSubscriptions: kpis.totalSubscriptions,
        activePlansCount,
      });
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const successRate = metrics ? parseFloat(metrics.successRate) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-shimmer rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 animate-shimmer rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights and performance metrics
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (!revenueData.length) return;
            const header = "Month,Revenue,MRR,One-Time\n";
            const rows = revenueData
              .map((r) => `${r.month || r.date},${r.revenue},${r.mrr},${r.oneTime}`)
              .join("\n");
            const blob = new Blob([header + rows], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `novabilling-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1 — REVENUE
      ══════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Revenue</h2>
        </div>

        {/* Revenue KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {netRevenue && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Gross Revenue
                    <MetricTooltip text="Total amount from all paid invoices before deducting refunds or credit notes." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(netRevenue.grossRevenue, "USD")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Refunds
                    <MetricTooltip text="Total amount returned to customers via payment refunds." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">-{formatCurrency(netRevenue.refunds, "USD")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Credit Notes
                    <MetricTooltip text="Total value of issued credit notes, which reduce the amount owed by customers." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600">-{formatCurrency(netRevenue.creditNotes, "USD")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Net Revenue
                    <MetricTooltip text="Gross revenue minus refunds and credit notes. This is the actual revenue retained." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(netRevenue.netRevenue, "USD")}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* MRR & ARR breakdown row */}
        {mrrBreakdown && (
          <>
            {/* ARR highlight */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    MRR
                    <MetricTooltip text="Monthly Recurring Revenue — the predictable monthly revenue from all active subscriptions, normalised to a monthly amount." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(mrrBreakdown.totalMrr, "USD")}</p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly Recurring Revenue</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    ARR
                    <MetricTooltip text="Annual Recurring Revenue — MRR × 12. Represents the expected recurring revenue over a full year based on current active subscriptions." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(mrrBreakdown.totalMrr * 12, "USD")}</p>
                  <p className="text-xs text-muted-foreground mt-1">Annual Recurring Revenue (MRR × 12)</p>
                </CardContent>
              </Card>
            </div>

            {/* MRR movement row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    New MRR
                    <MetricTooltip text="MRR added from new subscriptions created this month." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">+{formatCurrency(mrrBreakdown.newMrr, "USD")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Expansion
                    <MetricTooltip text="MRR gained from existing customers upgrading to a higher-priced plan this month." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">+{formatCurrency(mrrBreakdown.expansionMrr, "USD")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Contraction
                    <MetricTooltip text="MRR lost from existing customers downgrading to a lower-priced plan this month." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600">-{formatCurrency(mrrBreakdown.contractionMrr, "USD")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Net New MRR
                    <MetricTooltip text="Net MRR change this month: New MRR + Expansion − Contraction − Churn MRR." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${mrrBreakdown.netNewMrr >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {mrrBreakdown.netNewMrr >= 0 ? "+" : ""}{formatCurrency(mrrBreakdown.netNewMrr, "USD")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Revenue chart + MRR by plan */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly recurring and one-time revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value, "USD", { abbreviated: true })}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-card p-2 shadow-md">
                            <p className="text-sm font-medium">{payload[0].payload.month}</p>
                            <p className="text-sm text-blue-600">
                              {formatCurrency(payload[0].value as number, "USD")}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {mrrBreakdown && mrrBreakdown.byPlan.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>MRR by Plan</CardTitle>
                <CardDescription>Monthly recurring revenue broken down by subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mrrBreakdown.byPlan}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="planName" stroke="#6b7280" fontSize={12} />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => formatCurrency(value, "USD", { abbreviated: true })}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const planData = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-card p-2 shadow-md">
                              <p className="text-sm font-medium">{planData.planName}</p>
                              <p className="text-sm text-blue-600">MRR: {formatCurrency(planData.mrr, "USD")}</p>
                              <p className="text-sm text-muted-foreground">
                                {planData.subscriptionCount} subscription{planData.subscriptionCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="mrr" fill="#3b82f6" name="MRR" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Share of active subscriptions per plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — SUBSCRIPTIONS
      ══════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Subscriptions</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Subscriptions
                <MetricTooltip text="The total number of subscriptions ever created, across all statuses (active, canceled, trialing, paused)." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.totalSubscriptions ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1">All-time subscriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trialing
                <MetricTooltip text="Customers currently on a free trial period before their first paid billing cycle." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.trialingCount ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Currently on free trial</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Churn Rate
                <MetricTooltip text="Percentage of subscriptions that have been canceled out of all subscriptions ever created. Lower is better." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.churnRate ?? "0%"}</p>
              <p className="text-sm text-muted-foreground mt-1">Canceled / total subscriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Plans
                <MetricTooltip text="Number of distinct subscription plans that currently have at least one active subscriber." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.activePlansCount ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Plans with active subscribers</p>
            </CardContent>
          </Card>
        </div>

        {/* Retention cohort table */}
        {cohorts && cohorts.cohorts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Retention Cohort Analysis</CardTitle>
              <CardDescription>Monthly cohort retention rates</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left font-medium text-muted-foreground">Cohort</th>
                    <th className="px-2 py-1 text-left font-medium text-muted-foreground">Users</th>
                    {cohorts.months.map((m, i) => (
                      <th key={m} className="px-2 py-1 text-center font-medium text-muted-foreground">
                        M{i}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohorts.cohorts
                    .filter((c) => c.totalCustomers > 0)
                    .map((cohort) => (
                      <tr key={cohort.month} className="border-t border-border">
                        <td className="px-2 py-1 font-medium">{cohort.month}</td>
                        <td className="px-2 py-1 text-muted-foreground">{cohort.totalCustomers}</td>
                        {cohort.retentionPercentages.map((pct, i) => {
                          const bg =
                            pct >= 80
                              ? `rgba(34, 197, 94, ${pct / 100})`
                              : pct >= 50
                                ? `rgba(245, 158, 11, ${pct / 100})`
                                : `rgba(239, 68, 68, ${Math.max(0.15, pct / 100)})`;
                          return (
                            <td
                              key={i}
                              className="px-2 py-1 text-center font-medium"
                              style={{ backgroundColor: bg, color: pct > 50 ? "#fff" : undefined }}
                            >
                              {pct.toFixed(0)}%
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — CUSTOMERS
      ══════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Customers</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Customers
                <MetricTooltip text="Total number of registered customer accounts, regardless of subscription or activity status." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.totalCustomers ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Registered customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ARPU
                <MetricTooltip text="Average Revenue Per User — total revenue divided by the number of customers. Reflects how much revenue each customer generates on average." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(metrics?.arpu ?? 0, "USD")}</p>
              <p className="text-sm text-muted-foreground mt-1">Per customer (all time)</p>
            </CardContent>
          </Card>
          {ltv && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Lifetime Value
                    <MetricTooltip text="Average Customer Lifetime Value — the total revenue a customer generates over the entire duration of their subscription(s)." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(ltv.avgLtv, "USD")}</p>
                  <p className="text-sm text-muted-foreground mt-1">Average LTV across all customers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Lifespan
                    <MetricTooltip text="Average number of days a customer remains subscribed, from their first subscription creation to cancellation (or today for active subscribers)." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{ltv.avgLifespanDays}<span className="text-base font-normal text-muted-foreground ml-1">days</span></p>
                  <p className="text-sm text-muted-foreground mt-1">Average customer lifespan</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* LTV by plan + plan distribution */}
        {(ltv || planDistribution.length > 0) && (
          <div className="grid gap-6 lg:grid-cols-2">
            {ltv && ltv.byPlan.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>LTV by Plan</CardTitle>
                  <CardDescription>Average customer lifetime value per plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ltv.byPlan.map((p) => (
                      <div key={p.planId} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{p.planName}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold">{formatCurrency(p.avgLtv, "USD")}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({p.avgLifespanDays}d)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {planDistribution.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                  <CardDescription>Share of active subscriptions per plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={90}
                        dataKey="value"
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — PAYMENTS
      ══════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Payments</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Success Rate gauge */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Success Rate</CardTitle>
              <CardDescription>Ratio of successful to total payment attempts</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[260px]">
              <div className="relative flex items-center justify-center">
                <svg className="w-48 h-48" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={successRate >= 90 ? "#22c55e" : successRate >= 70 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${successRate * 2.64} 264`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold">{successRate.toFixed(1)}%</span>
                  <span className="text-sm text-muted-foreground">success</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {successRate >= 90 ? "Excellent" : successRate >= 70 ? "Good" : "Needs Attention"} — target is ≥ 90%
              </p>
            </CardContent>
          </Card>

          {/* Revenue trend (duplicate here for payment context) */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Payment Volume</CardTitle>
              <CardDescription>Total payment revenue collected per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value, "USD", { abbreviated: true })}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-card p-2 shadow-md">
                            <p className="text-sm font-medium">{payload[0].payload.month}</p>
                            <p className="text-sm text-blue-600">
                              {formatCurrency(payload[0].value as number, "USD")}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
