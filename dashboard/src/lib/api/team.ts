import { apiFetch } from "./client";

export type ApiRole = "OWNER" | "ADMIN" | "FINANCE" | "DEVELOPER" | "VIEWER";

export interface Member {
  userId: string;
  name: string;
  email: string;
  role: ApiRole;
  active: boolean;
  lastLoginAt: string | null;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: ApiRole;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export const teamApi = {
  members: () => apiFetch<Member[]>("/team/members"),
  invitations: () => apiFetch<Invitation[]>("/team/invitations"),
  invite: (email: string, role: ApiRole) =>
    apiFetch<Invitation & { acceptUrl: string; emailed: boolean }>("/team/invitations", {
      method: "POST",
      body: JSON.stringify({ email, role }),
    }),
  revoke: (id: string) => apiFetch<void>(`/team/invitations/${id}`, { method: "DELETE" }),
  changeRole: (userId: string, role: ApiRole) =>
    apiFetch<Member[]>(`/team/members/${userId}`, { method: "PATCH", body: JSON.stringify({ role }) }),
  remove: (userId: string) => apiFetch<void>(`/team/members/${userId}`, { method: "DELETE" }),
  leave: () => apiFetch<void>("/team/me", { method: "DELETE" }),
};
