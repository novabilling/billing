import { NextRequest, NextResponse } from "next/server";
import { forwardSession, sessionToken } from "@/lib/server/session";

export async function POST(req: NextRequest) {
  const token = await sessionToken();
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  return forwardSession("/auth/switch", await req.json(), token);
}
