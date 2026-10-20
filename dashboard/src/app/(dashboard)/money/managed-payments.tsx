"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brand } from "@/lib/brand";
import { moneyApi, type ManagedAccount } from "@/lib/api/money";

const statusText: Record<ManagedAccount["status"], { label: string; variant: "success" | "warning" | "error"; hint: string }> = {
  pending_review: { label: "In review", variant: "warning", hint: "We are checking your business and bank details. Checkout links start working once it is approved." },
  active: { label: "Active", variant: "success", hint: "Checkout links fall back to managed payments whenever none of your own providers can take the payment." },
  rejected: { label: "Not approved", variant: "error", hint: "Contact support to find out what is needed." },
  suspended: { label: "Suspended", variant: "error", hint: "New payments are paused. Contact support." },
};

const empty = { businessName: "", email: "", phone: "", country: "UG", currency: "UGX", bankCode: "", accountNumber: "", accountName: "" };

/**
 * Managed payments: for accounts without their own Flutterwave or other
 * provider account. Payments settle straight to the bank account given here;
 * the platform fee is taken by the processor on the way.
 */
export function ManagedPayments({ onChanged }: { onChanged: () => void }) {
  const [state, setState] = useState<{ available: boolean; account: ManagedAccount | null } | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setState(await moneyApi.managedStatus());
    } catch {
      setState({ available: false, account: null });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!state?.available) return null;

  const set = (key: keyof typeof empty, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const field = (key: keyof typeof empty, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={`managed-${key}`}>{label}</Label>
      <Input id={`managed-${key}`} value={form[key]} onChange={(e) => set(key, e.target.value)} {...props} />
    </div>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await moneyApi.openManaged({
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        country: form.country.toUpperCase(),
        currency: form.currency.toUpperCase(),
        bank: { code: form.bankCode, accountNumber: form.accountNumber, accountName: form.accountName || undefined },
      });
      toast.success("Managed payments requested");
      await load();
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open managed payments");
    } finally {
      setSaving(false);
    }
  };

  const account = state.account;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Managed payments
          {account && <Badge variant={statusText[account.status].variant}>{statusText[account.status].label}</Badge>}
        </CardTitle>
        <CardDescription>
          No Flutterwave or other provider account? Take card, mobile money and bank payments through {brand.name}. Money settles
          straight to your bank account; {brand.name} never holds it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {account ? (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Business</dt>
              <dd>{account.businessName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Settles to</dt>
              <dd>
                {account.bankName ?? "Bank"} ···{account.accountNumberLast4 ?? "—"} in {account.currency}
              </dd>
            </div>
            {account.fee && (
              <div>
                <dt className="text-muted-foreground">Platform fee</dt>
                <dd>{account.fee.type === "percentage" ? `${account.fee.value}% per payment` : `${account.fee.value} ${account.currency} per payment`}</dd>
              </div>
            )}
            <p className="text-muted-foreground sm:col-span-2">{account.reason ?? statusText[account.status].hint}</p>
          </dl>
        ) : (
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {field("businessName", "Registered business name", { required: true })}
            {field("email", "Finance email", { type: "email", required: true })}
            {field("phone", "Business phone", { placeholder: "+256…", required: true })}
            <div className="grid grid-cols-2 gap-3">
              {field("country", "Country", { maxLength: 2, required: true })}
              {field("currency", "Settlement currency", { maxLength: 3, required: true })}
            </div>
            {field("bankCode", "Bank code", { placeholder: "From Flutterwave's bank list", required: true })}
            {field("accountNumber", "Bank account number", { required: true })}
            {field("accountName", "Account name (optional)")}
            <div className="flex items-end">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Request managed payments
              </Button>
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Your details are reviewed before payments start. The fee is shown here once approved and is taken from each payment
              before it reaches your bank.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
