"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, Receipt, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/currency";
import { formatRelativeTime } from "@/lib/utils/date";
import type { ActivityEvent, RevenueData } from "@/types";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [quickStats, setQuickStats] = useState<{
    topPlan: string;
    topPlanPct: number;
    arpu: number;
    churnRate: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          kpisData,
          revenue,
          activityData,
          subs,
          plans,
          custAnalytics,
          subAnalytics,
        ] = await Promise.all([
          apiClient.analytics.getKPIs(),
          apiClient.analytics.getRevenueData(),
          apiClient.activity.list(10),
          apiClient.subscriptions.list({ limit: 100 }),
          apiClient.plans.list(),
          fetch("/api/proxy/analytics/customers", {
            credentials: "include",
          }).then((r) => r.json()),
          fetch("/api/proxy/analytics/subscriptions", {
            credentials: "include",
          }).then((r) => r.json()),
        ]);

        setKpis(kpisData);
        setRevenueData(revenue);
        setActivities(activityData);

        // Compute top plan from real subscription data
        const planMap = new Map<string, string>();
        plans.forEach((p) => planMap.set(p.id, p.name));

        const planCounts: Record<string, number> = {};
        (subs.data || []).forEach((s) => {
          const name = s.planName || planMap.get(s.planId) || "Unknown";
          planCounts[name] = (planCounts[name] || 0) + 1;
        });

        const totalSubs = subs.data?.length || 1;
        const topEntry = Object.entries(planCounts).sort(
          (a, b) => b[1] - a[1],
        )[0];

        const custData =
          custAnalytics.data?.data || custAnalytics.data || custAnalytics;
        const subData =
          subAnalytics.data?.data || subAnalytics.data || subAnalytics;

        setQuickStats({
          topPlan: topEntry ? topEntry[0] : "N/A",
          topPlanPct: topEntry
            ? Math.round((topEntry[1] / totalSubs) * 100)
            : 0,
          arpu: Number(custData.arpu) || 0,
          churnRate: subData.churnRate || "0.00%",
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const getActivityIcon = (type: string) => {
    if (type.includes("payment")) return <DollarSign className="h-4 w-4" />;
    if (type.includes("subscription")) return <Receipt className="h-4 w-4" />;
    if (type.includes("customer")) return <Users className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  const getActivityColor = (type: string) => {
    if (type.includes("succeeded")) return "success";
    if (type.includes("failed")) return "error";
    if (type.includes("created")) return "default";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Monthly Recurring Revenue"
          value={
            kpis ? formatCurrency(kpis.mrr, "USD", { abbreviated: true }) : "$0"
          }
          change={kpis?.mrrChange || 0}
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
          isLoading={isLoading}
        />
        <KPICard
          title="Active Subscriptions"
          value={kpis?.activeSubscriptions.toString() || "0"}
          change={kpis?.subscriptionChange || 0}
          icon={<Receipt className="h-6 w-6 text-blue-600" />}
          isLoading={isLoading}
        />
        <KPICard
          title="Total Customers"
          value={kpis?.totalCustomers.toString() || "0"}
          change={kpis?.customerChange || 0}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          isLoading={isLoading}
        />
        <KPICard
          title="Success Rate"
          value={kpis ? `${kpis.successRate.toFixed(1)}%` : "0%"}
          change={2.1}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    <Badge variant={getActivityColor(activity.type) as any}>
                      {getActivityIcon(activity.type)}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{quickStats?.topPlan || "—"}</p>
            <p className="text-sm text-muted-foreground">
              {quickStats
                ? `${quickStats.topPlanPct}% of subscriptions`
                : "Loading..."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Average Revenue Per User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(quickStats?.arpu || 0, "USD")}
            </p>
            <p className="text-sm text-muted-foreground">Per active customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {quickStats?.churnRate || "0%"}
            </p>
            <p className="text-sm text-muted-foreground">
              Canceled / total subscriptions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
