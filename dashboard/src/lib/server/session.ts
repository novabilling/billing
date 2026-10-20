import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** Server-only helpers for the auth route handlers: the API base, session cookies and the user shape we hand the browser. */
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export interface BackendSession {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  tenant: { id: string; name: string; email: string };
  user: { id: string; name: string; email: string };
  role: string;
  permissions: string[];
  organisations?: { id: string; name: string; slug: string; role: string }[];
}

export async function setSessionCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  const base = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  cookieStore.set("nb_token", accessToken, { ...base, maxAge: 60 * 60 }); // matches JWT expiration
  cookieStore.set("nb_refresh_token", refreshToken, { ...base, maxAge: 60 * 60 * 24 * 7 });
}

/** What the browser keeps: display details and permissions, never tokens. */
export function browserSession(data: BackendSession) {
  return {
    user: {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      tenantId: data.tenant.id,
      tenantName: data.tenant.name,
      role: data.role.toLowerCase(),
      permissions: data.permissions,
    },
    ...(data.organisations && {
      organisations: data.organisations.map((o) => ({ ...o, role: o.role.toLowerCase() })),
    }),
    ...(data.apiKey && { apiKey: data.apiKey }),
  };
}

/** Forward a request that returns a fresh session (tokens included) and keep the tokens in cookies. */
export async function forwardSession(path: string, body: unknown, token?: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ message: data.message || "Request failed" }, { status: res.status });
    await setSessionCookies(data.accessToken, data.refreshToken);
    return NextResponse.json(browserSession(data));
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function sessionToken() {
  return (await cookies()).get("nb_token")?.value;
}
