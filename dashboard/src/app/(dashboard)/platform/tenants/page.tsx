"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformGate } from "@/components/platform/platform-gate";
import { CurrencyAmounts, FlagBadges, LedgerBadge, StageBadge, compact, lastCallLabel, plural } from "@/components/platform/bits";
import {
  featureLabels,
  flagLabels,
  platformApi,
  stageLabels,
  type PlatformTenantRow,
} from "@/lib/api/platform";
import { formatRelativeTime } from "@/lib/utils/date";

const ALL = "all";

export default function PlatformTenantsPage() {
  return (
    <PlatformGate>
      <Suspense fallback={<div className="animate-shimmer h-96 rounded-lg" />}>
        <TenantList />
      </Suspense>
    </PlatformGate>
  );
}

function TenantList() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState(ALL);
  const [flag, setFlag] = useState(ALL);
  const [sort, setSort] = useState(params.get("sort") || "attention");
  const [rows, setRows] = useState<PlatformTenantRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      platformApi
        .tenants({
          search: search || undefined,
          stage: stage === ALL ? undefined : stage,
          flag: flag === ALL ? undefined : flag,
          sort,
        })
        .then((r) => {
          setRows(r.data);
          setError(null);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Could not load tenants"));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, stage, flag, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tenants</h1>
        <p className="text-sm text-muted-foreground">Every account on the platform, its stage, activity and open issues.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="tenant-search"
            className="pl-9"
            placeholder="Search name, email, slug or id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All stages</SelectItem>
            {Object.entries(stageLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={flag} onValueChange={setFlag}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Issue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any issue status</SelectItem>
            {Object.entries(flagLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="attention">Most issues first</SelectItem>
            <SelectItem value="requests">Most API calls</SelectItem>
            <SelectItem value="last_api_call">Recently active</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {error ? (
            <p className="p-6 text-sm text-red-600">{error}</p>
          ) : !rows ? (
            <div className="animate-shimmer h-64" />
          ) : rows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No tenants match these filters.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Tenant</th>
                  <th className="text-left font-medium px-4 py-3">Stage</th>
                  <th className="text-left font-medium px-4 py-3">Last API call</th>
                  <th className="text-right font-medium px-4 py-3">Requests (7d)</th>
                  <th className="text-right font-medium px-4 py-3">Volume (30d)</th>
                  <th className="text-left font-medium px-4 py-3">Providers</th>
                  <th className="text-left font-medium px-4 py-3">Uses</th>
                  <th className="text-left font-medium px-4 py-3">Ledger</th>
                  <th className="text-left font-medium px-4 py-3">Issues</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-t align-top hover:bg-accent/40">
                    <td className="px-4 py-3">
                      <Link href={`/platform/tenants/${t.id}`} className="font-medium hover:underline">
                        {t.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{t.email}</p>
                      <p className="text-xs text-muted-foreground">Joined {formatRelativeTime(t.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={t.stage} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={t.lastApiCall ? "" : "text-muted-foreground"}>
                        {lastCallLabel(t.lastApiCall, formatRelativeTime)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {compact(t.requests7d)}
                      {t.errors7d > 0 && <p className="text-xs text-red-600">{plural(t.errors7d, "error")}</p>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <CurrencyAmounts amounts={t.paymentVolume30d} />
                    </td>
                    <td className="px-4 py-3 capitalize">{t.providers.join(", ") || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px]">
                      {t.features.map((f) => featureLabels[f] ?? f).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <LedgerBadge ledger={t.ledger} />
                    </td>
                    <td className="px-4 py-3">
                      <FlagBadges flags={t.flags} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
