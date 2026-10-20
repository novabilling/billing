import { NextRequest } from "next/server";
import { forwardSession } from "@/lib/server/session";

export async function POST(req: NextRequest) {
  return forwardSession("/auth/login", await req.json());
}
