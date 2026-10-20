"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { platformApi, type TenantAccess } from "@/lib/api/platform";

type Me = Awaited<ReturnType<typeof platformApi.me>>;
let cached: Promise<Me | null> | null = null;

/** /admin/me, fetched once per page load and shared. */
function useMe(): Me | null | undefined {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  useEffect(() => {
    cached ??= platformApi.me().catch(() => null);
    let live = true;
    cached.then((v) => live && setMe(v));
    return () => {
      live = false;
    };
  }, []);
  return me;
}

/** Whether the signed-in account may open the platform console (checked once per page load). */
export function usePlatformAccess(): boolean | null {
  const me = useMe();
  return me === undefined ? null : Boolean(me?.isPlatformAdmin);
}

/** This organisation's access mode, set by the platform operator. */
export function useTenantAccess(): TenantAccess | null {
  return useMe()?.access ?? null;
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
