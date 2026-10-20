"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenantAccess } from "@/components/platform/platform-gate";

/** Says why the organisation is limited and where to fix it. */
export function AccessBanner() {
  const access = useTenantAccess();
  if (!access || access.mode === "FULL") return null;
  const title = access.mode === "READ_ONLY" ? "This organisation is read-only" : "This organisation is suspended";
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 border-b border-amber-300 bg-amber-50 px-6 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
      <Lock className="h-4 w-4 shrink-0" aria-hidden />
      <p className="flex-1">
        <span className="font-medium">{title}.</span> {access.reason ?? "Contact the platform operator."}
      </p>
      {access.url && (
        <Button asChild size="sm">
          <a href={access.url}>Resolve</a>
        </Button>
      )}
    </div>
  );
}
