"use client";

import { useEffect, useState } from "react";
import { platformApi, type TenantAccess, type TenantPlan } from "@/lib/api/platform";

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

/** This organisation's access mode, set by the platform operator. */
export function useTenantAccess(): TenantAccess | null {
  return useMe()?.access ?? null;
}

/** The plan the operator has put this organisation on, if any. */
export function useTenantPlan(): TenantPlan | null {
  return useMe()?.plan ?? null;
}
