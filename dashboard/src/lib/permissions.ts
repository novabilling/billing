import type { ReactNode } from "react";
import type { User } from "@/types";
import { useAuthStore } from "@/lib/stores/auth";

/** Mirrors the API's role permissions so the dashboard can hide what a role cannot do; the API still enforces them. */
export type Permission =
  | "read"
  | "billing.write"
  | "money.move"
  | "money.approve"
  | "settings.developer"
  | "settings.providers"
  | "org.manage"
  | "team.manage";

export function can(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  // Sessions cached before roles existed belong to owners.
  if (!user.permissions) return true;
  return user.permissions.includes(permission);
}

/** Whether the signed-in user holds a permission. */
export function useCan(permission: Permission): boolean {
  return useAuthStore((s) => can(s.user, permission));
}

/** Renders its children only when the signed-in user holds the permission. */
export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return useCan(permission) ? children : fallback;
}

export const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  finance: "Finance",
  developer: "Developer",
  viewer: "Viewer",
};

export const roleDescriptions: Record<string, string> = {
  owner: "Everything, including other owners",
  admin: "Everything except managing owners",
  finance: "Customers, billing, payments and payouts",
  developer: "Read everything; API keys and webhooks",
  viewer: "Read only",
};
