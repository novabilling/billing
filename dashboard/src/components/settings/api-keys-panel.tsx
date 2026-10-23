"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Copy, KeyRound, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ApiKeyRow {
  id: string;
  key: string | null;
  name: string;
  scopes: string[];
  lastUsed: string | null;
  expiresAt: string | null;
  createdAt: string;
}

/** The proxy may wrap bodies as { data }; accept both. */
function unwrap<T>(json: unknown): T {
  const j = json as { data?: { data?: T } | T };
  return ((j?.data as { data?: T })?.data ?? j?.data ?? json) as T;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(unwrap<{ message?: string }>(body)?.message || `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : unwrap<T>(await res.json());
}

function copy(value: string, what: string) {
  navigator.clipboard.writeText(value);
  toast.success(`${what} copied to clipboard`);
}

/**
 * API keys are stored hashed: the organisation's key is shown masked, and any
 * new key only once, when it is created or rotated.
 */
export function ApiKeysPanel({ maskedKey, canManage }: { maskedKey: string | null; canManage: boolean }) {
  const [revealed, setRevealed] = useState<{ label: string; key: string } | null>(null);
  const [masked, setMasked] = useState(maskedKey);
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [name, setName] = useState("");
  const [access, setAccess] = useState<"read" | "write">("read");
  const [busy, setBusy] = useState(false);

  useEffect(() => setMasked(maskedKey), [maskedKey]);

  async function loadKeys() {
    if (!canManage) return;
    try {
      setKeys(await call<ApiKeyRow[]>("/tenants/me/api-keys"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load API keys");
    }
  }

  useEffect(() => {
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  async function rotate() {
    if (!confirm("Rotate the organisation's API key? The current key stops working immediately.")) return;
    setBusy(true);
    try {
      const { key } = await call<{ key: string }>("/tenants/me/api-key/rotate", { method: "POST" });
      setRevealed({ label: "New organisation API key", key });
      setMasked(`sk_live_****${key.slice(-4)}`);
      toast.success("API key rotated. Update your integrations now.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not rotate the API key");
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    if (!name.trim()) return toast.error("Give the key a name");
    setBusy(true);
    try {
      const created = await call<{ key: string; name: string }>("/tenants/me/api-keys", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), scopes: access === "write" ? ["read", "write"] : ["read"] }),
      });
      setRevealed({ label: `New key "${created.name}"`, key: created.key });
      setName("");
      await loadKeys();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the key");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(row: ApiKeyRow) {
    if (!confirm(`Revoke "${row.name}"? Requests using it will fail immediately.`)) return;
    try {
      await call(`/tenants/me/api-keys/${row.id}`, { method: "DELETE" });
      setKeys((current) => current.filter((k) => k.id !== row.id));
      toast.success("Key revoked");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not revoke the key");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Keys are shown in full only once, when created. Store them in your secrets manager.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {revealed && (
          <div className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/40">
            <Label>{revealed.label}</Label>
            <div className="flex gap-2">
              <Input value={revealed.key} readOnly className="font-mono" />
              <Button variant="outline" onClick={() => copy(revealed.key, "API key")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Copy it now — it will not be shown again.</p>
            <Button variant="ghost" size="sm" onClick={() => setRevealed(null)}>
              I have stored it
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <Label>Organisation API key (full access)</Label>
          <Input value={masked ?? "Not set"} readOnly className="font-mono" />
          {canManage && (
            <div className="mt-3 rounded-md border border-destructive/20 bg-destructive/10 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-300">Rotate API key</h4>
                  <p className="mt-1 text-sm text-red-800 dark:text-red-400">
                    Issues a new organisation key and invalidates the current one at once.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-3" onClick={rotate} disabled={busy}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Rotate API key
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {canManage && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">Additional keys</h4>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input placeholder="Key name, e.g. Reporting" value={name} onChange={(e) => setName(e.target.value)} />
              <Select value={access} onValueChange={(v) => setAccess(v as "read" | "write")}>
                <SelectTrigger className="sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read only</SelectItem>
                  <SelectItem value="write">Read and write</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={create} disabled={busy}>
                <KeyRound className="mr-2 h-4 w-4" />
                Create key
              </Button>
            </div>
            {keys.length > 0 && (
              <ul className="divide-y rounded-md border">
                {keys.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium">{row.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{row.key ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.lastUsed ? `Last used ${new Date(row.lastUsed).toLocaleString()}` : "Never used"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={row.scopes.includes("write") ? "default" : "secondary"}>
                        {row.scopes.includes("write") ? "Read & write" : "Read only"}
                      </Badge>
                      <Button variant="ghost" size="icon" aria-label={`Revoke ${row.name}`} onClick={() => revoke(row)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
