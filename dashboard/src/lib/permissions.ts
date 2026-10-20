import type { User } from "@/types";

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
