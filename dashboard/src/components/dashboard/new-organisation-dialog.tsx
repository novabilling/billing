"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth";

/** Another organisation for the signed-in person, who owns it; switches to it once created. */
export function NewOrganisationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createOrganisation = useAuthStore((s) => s.createOrganisation);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const session = await createOrganisation(name.trim());
      setApiKey(session.apiKey ?? null);
      toast.success(`${name.trim()} created`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the organisation");
    } finally {
      setSaving(false);
    }
  };

  const close = () => {
    onOpenChange(false);
    if (apiKey) window.location.href = "/dashboard";
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New organisation</DialogTitle>
          <DialogDescription>
            A separate business with its own customers, billing, providers and team. You will own it, and can switch between
            organisations from your profile menu.
          </DialogDescription>
        </DialogHeader>
        {apiKey ? (
          <div className="space-y-2">
            <Label htmlFor="new-org-key">API key (shown once)</Label>
            <Input id="new-org-key" readOnly value={apiKey} className="font-mono text-xs" onFocus={(e) => e.target.select()} />
            <DialogFooter>
              <Button onClick={close}>Open {name.trim()}</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-org-name">Organisation name</Label>
              <Input id="new-org-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || name.trim().length < 2}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
