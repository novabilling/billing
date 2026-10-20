import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/server/session";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await fetch(`${BACKEND_URL}/api/auth/invitations/${encodeURIComponent(token)}`);
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(res.ok ? data : { message: data.message || "This invitation is invalid or has expired" }, { status: res.status });
}
