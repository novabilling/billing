import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

async function refreshAccessToken(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<string | null> {
  const refreshToken = cookieStore.get("nb_refresh_token")?.value;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json;

    cookieStore.set("nb_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    cookieStore.set("nb_refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return data.accessToken;
  } catch {
    return null;
  }
}

async function makeBackendRequest(
  url: string,
  method: string,
  token: string,
  body?: string,
): Promise<Response> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = { method, headers };

  if (method !== "GET" && method !== "HEAD" && body) {
    fetchOptions.body = body;
  }

  return fetch(url, fetchOptions);
}

async function proxyRequest(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const apiPath = `/api/${path.join("/")}`;
  const cookieStore = await cookies();

  const token = cookieStore.get("nb_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // Build target URL with query params
  const url = new URL(apiPath, BACKEND_URL);
  const searchParams = req.nextUrl.searchParams;
  searchParams.forEach((value, key) => url.searchParams.set(key, value));

  // Read body once for potential retry
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const text = await req.text();
    if (text) body = text;
  }

  try {
    let res = await makeBackendRequest(url.toString(), req.method, token, body);

    // If 401, attempt token refresh and retry
    if (res.status === 401) {
      const newToken = await refreshAccessToken(cookieStore);
      if (newToken) {
        res = await makeBackendRequest(
          url.toString(),
          req.method,
          newToken,
          body,
        );
      }
    }

    const contentType = res.headers.get("Content-Type") || "application/json";

    // Handle binary responses (PDFs, images, etc.)
    if (
      contentType.includes("application/pdf") ||
      contentType.includes("application/octet-stream") ||
      contentType.includes("image/")
    ) {
      const arrayBuffer = await res.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        status: res.status,
        headers: {
          "Content-Type": contentType,
          ...(res.headers.get("Content-Disposition")
            ? { "Content-Disposition": res.headers.get("Content-Disposition")! }
            : {}),
        },
      });
    }

    const responseBody = await res.text();
    return new NextResponse(responseBody, {
      status: res.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Backend unavailable" },
      { status: 502 },
    );
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, ctx);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, ctx);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, ctx);
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, ctx);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, ctx);
}
