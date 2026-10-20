import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BACKEND_URL, browserSession } from "@/lib/server/session";

async function fetchMe(token: string) {
  return fetch(`${BACKEND_URL}/api/auth/session`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("nb_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    let res = await fetchMe(token);

    // If token expired, attempt refresh
    if (!res.ok) {
      const refreshToken = cookieStore.get("nb_refresh_token")?.value;
      if (!refreshToken) {
        return NextResponse.json(
          { message: "Session expired" },
          { status: 401 },
        );
      }

      const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        return NextResponse.json(
          { message: "Session expired" },
          { status: 401 },
        );
      }

      const refreshJson = await refreshRes.json();
      const refreshData = refreshJson;

      cookieStore.set("nb_token", refreshData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });

      cookieStore.set("nb_refresh_token", refreshData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      res = await fetchMe(refreshData.accessToken);

      if (!res.ok) {
        return NextResponse.json(
          { message: "Session expired" },
          { status: 401 },
        );
      }
    }

    return NextResponse.json(browserSession(await res.json()));
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
