"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { platformApi } from "@/lib/api/platform";

let cached: Promise<boolean> | null = null;

/** Whether the signed-in account may open the platform console (checked once per page load). */
export function usePlatformAccess(): boolean | null {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    cached ??= platformApi
      .me()
      .then((r) => r.isPlatformAdmin)
      .catch(() => false);
    let live = true;
    cached.then((v) => live && setAllowed(v));
    return () => {
      live = false;
    };
  }, []);
  return allowed;
}

export function PlatformGate({ children }: { children: React.ReactNode }) {
  const allowed = usePlatformAccess();
  if (allowed === null) {
    return <div className="animate-shimmer h-40 rounded-lg" />;
  }
  if (!allowed) {
    return (
      <Card>
        <CardContent className="p-10 flex flex-col items-center text-center gap-3">
          <ShieldAlert className="h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">Platform console is restricted</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Only operator accounts listed in PLATFORM_ADMIN_TENANT_IDS on the API server can open this page.
          </p>
        </CardContent>
      </Card>
    );
  }
  return <>{children}</>;
}
