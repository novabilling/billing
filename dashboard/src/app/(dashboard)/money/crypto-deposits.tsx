"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { moneyApi, type CryptoDeposit, type MoneyIntent } from "@/lib/api/money";
import { formatDateTime } from "@/lib/utils/date";

const statusVariant: Record<CryptoDeposit["status"], "default" | "secondary" | "outline"> = {
  matched: "default",
  assigned: "secondary",
  unmatched: "outline",
  confirming: "outline",
};

/** Public block explorer for a deposit; Bitcoin deposits are keyed "txid:output". */
function explorerUrl(d: CryptoDeposit): string {
  const hash = d.txHash.split(":")[0];
  if (d.chain === "ETHEREUM") return `https://etherscan.io/tx/${hash}`;
  if (d.chain === "BITCOIN") return `https://mempool.space/tx/${hash}`;
  return `https://tronscan.org/#/transaction/${hash}`;
}

/**
 * USDT transfers seen arriving at the merchant's own TRON address. Most
 * match a collection on their own; the rest (wrong amount, late, or paid
 * without the amount's tail while several collections asked for it) can be
 * assigned to an open collection here.
 */
export function CryptoDeposits() {
  const [rows, setRows] = useState<CryptoDeposit[] | null>(null);
  const [open, setOpen] = useState<MoneyIntent[]>([]);
  const [filter, setFilter] = useState<"all" | "unmatched">("all");
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [deposits, collections] = await Promise.all([
        moneyApi.cryptoDeposits({ status: filter === "all" ? undefined : filter }),
        moneyApi.list("collection", { status: "processing" }),
      ]);
      setRows(deposits.data);
      setOpen(collections.data.filter((c) => c.provider === "tron_usdt" || c.provider === "eth_usdt"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load deposits");
      setRows([]);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const assign = async (deposit: CryptoDeposit) => {
    const collectionId = choice[deposit.id];
    if (!collectionId) return;
    setBusy(deposit.id);
    try {
      const settled = await moneyApi.assignDeposit(deposit.id, collectionId);
      toast.success(settled.status === "succeeded" ? "Collection marked paid" : `Collection is ${settled.status}`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not assign the deposit");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Crypto deposits</CardTitle>
          <CardDescription>
            Crypto received at your own wallet addresses (USDT on TRON or Ethereum, Bitcoin), checked every minute. Funds
            are already in your wallet; this list only shows which collection each one paid.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as "all" | "unmatched")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All deposits</SelectItem>
              <SelectItem value="unmatched">Unmatched</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={load} aria-label="Reload deposits">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {rows === null ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            {filter === "unmatched" ? "Every deposit matched a collection." : "Nothing has arrived at your wallet addresses yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Received</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium">From</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDateTime(d.blockTime)}
                      <a
                        href={explorerUrl(d)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                      >
                        {d.txHash.slice(0, 10)}… <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                      {d.amount} {d.token}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs break-all">{d.from ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[d.status]} className="capitalize">
                        {d.status}
                      </Badge>
                      {d.collectionId && <p className="mt-1 font-mono text-xs text-muted-foreground">{d.collectionId}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {d.status === "unmatched" && d.chain !== "BITCOIN" && open.some((c) => c.paymentDetails?.chain === d.chain) && (
                        <div className="flex items-center justify-end gap-2">
                          <Select value={choice[d.id] ?? ""} onValueChange={(v) => setChoice((c) => ({ ...c, [d.id]: v }))}>
                            <SelectTrigger className="w-[220px]">
                              <SelectValue placeholder="Pick an open collection" />
                            </SelectTrigger>
                            <SelectContent>
                              {open.filter((c) => c.paymentDetails?.chain === d.chain).map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.paymentDetails?.amount ?? c.amount} {c.paymentDetails?.coin ?? "USDT"} ·{" "}
                                  {c.description || c.reference || c.id.slice(-6)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" disabled={!choice[d.id] || busy === d.id} onClick={() => assign(d)}>
                            Assign
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
