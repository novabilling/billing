"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils/currency";
import { format } from "date-fns";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    mrr: number;
    oneTime: number;
  }>;
  onPeriodChange?: (period: string) => void;
}

const periods = ["7D", "30D", "90D", "1Y", "All"] as const;

function filterDataByPeriod(
  data: RevenueChartProps["data"],
  period: (typeof periods)[number],
): RevenueChartProps["data"] {
  const now = new Date();
  const count = data.length;
  switch (period) {
    case "7D":
    case "30D":
      // Show only the most recent month
      return data.slice(-1);
    case "90D":
      // Show last 3 months
      return data.slice(-Math.min(3, count));
    case "1Y":
      // Show last 6 months (all available data typically)
      return data.slice(-Math.min(6, count));
    case "All":
    default:
      return data;
  }
}

export function RevenueChart({ data, onPeriodChange }: RevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<(typeof periods)[number]>("All");

  const filteredData = filterDataByPeriod(data, selectedPeriod);

  const formattedData = filteredData.map((item) => ({
    ...item,
    date: format(new Date(item.date), "MMM"),
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Revenue Overview</CardTitle>
          <div className="flex gap-1">
            {periods.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedPeriod(period);
                  onPeriodChange?.(period);
                }}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                formatCurrency(value, "USD", { abbreviated: true })
              }
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-card p-2 shadow-md">
                      <p className="text-sm font-medium">
                        {payload[0].payload.date}
                      </p>
                      {payload.map((entry: any) => (
                        <div
                          key={entry.name}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground">
                            {entry.name}:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(entry.value, "USD")}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Total Revenue"
            />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke="#a855f7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMRR)"
              name="MRR"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
