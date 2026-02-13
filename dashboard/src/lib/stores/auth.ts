import { create } from "zustand";
import type { User } from "@/types";
import { apiClient } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkSession: () => Promise<void>;
}

function loadAuthState(): { user: User | null; isAuthenticated: boolean } {
  if (typeof window === "undefined")
    return { user: null, isAuthenticated: false };
  const stored = localStorage.getItem("novabilling_user");
  if (stored) {
    try {
      return { user: JSON.parse(stored), isAuthenticated: true };
    } catch {
      // fall through
    }
  }
  return { user: null, isAuthenticated: false };
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadAuthState(),

  login: async (email: string, password: string) => {
    const result = await apiClient.auth.login(email, password);

    const user: User = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: "owner",
      tenantId: result.user.tenantId,
    };

    // Only store display info — no tokens or API keys
    localStorage.setItem("novabilling_user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    apiClient.auth.logout().catch(() => {});
    localStorage.removeItem("novabilling_user");
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user: User) => {
    localStorage.setItem("novabilling_user", JSON.stringify(user));
    set({ user });
  },

  checkSession: async () => {
    const result = await apiClient.auth.me();
    if (result) {
      const user: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: "owner",
        tenantId: result.user.tenantId,
      };
      localStorage.setItem("novabilling_user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } else {
      localStorage.removeItem("novabilling_user");
      set({ user: null, isAuthenticated: false });
    }
  },
}));
