import { apiFetch } from "./client";

// The platform console itself is the operator's private control panel; the
// dashboard only needs this organisation's own access state and plan.

export type AccessMode = "FULL" | "READ_ONLY" | "SUSPENDED";

export interface TenantAccess {
  mode: AccessMode;
  reason: string | null;
  url: string | null;
}

export interface PlanLimits {
  customers?: number;
  activeSubscriptions?: number;
  invoicesPerMonth?: number;
  teamMembers?: number;
  disabledFeatures?: string[];
}

export interface TenantBillingState {
  status: string;
  planId: string | null;
  trialEndsAt: string | null;
  planName?: string | null;
  limits?: PlanLimits | null;
  manageUrl?: string | null;
}

export interface TenantPlan {
  name: string;
  status: string;
  trialEndsAt: string | null;
  limits: PlanLimits | null;
  manageUrl: string | null;
}

export const platformApi = {
  me: () => apiFetch<{ isPlatformAdmin: boolean; access: TenantAccess; plan: TenantPlan | null }>("/admin/me"),
};
