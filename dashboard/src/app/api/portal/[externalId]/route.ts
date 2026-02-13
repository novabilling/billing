import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ externalId: string }> },
) {
  const { externalId } = await params;
  const apiKey = req.nextUrl.searchParams.get("key");

  if (!apiKey) {
    return NextResponse.json(
      { message: "Missing API key. Pass ?key=your-tenant-api-key" },
      { status: 401 },
    );
  }

  // Determine which sub-resource to fetch
  const resource = req.nextUrl.searchParams.get("resource") || "billing";
  const status = req.nextUrl.searchParams.get("status");
  const page = req.nextUrl.searchParams.get("page");

  let apiPath = `/api/portal/customers/${encodeURIComponent(externalId)}`;

  switch (resource) {
    case "billing":
      apiPath += "/billing";
      break;
    case "subscriptions":
      apiPath += "/subscriptions";
      break;
    case "invoices":
      apiPath += "/invoices";
      if (status) apiPath += `?status=${status}`;
      if (page) apiPath += `${status ? "&" : "?"}page=${page}`;
      break;
    case "payments":
      apiPath += "/payments";
      if (page) apiPath += `?page=${page}`;
      break;
    default:
      apiPath += "/billing";
  }

  try {
    const res = await fetch(`${BACKEND_URL}${apiPath}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { message: "Backend unavailable" },
      { status: 502 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ externalId: string }> },
) {
  const { externalId } = await params;
  const apiKey = req.nextUrl.searchParams.get("key");

  if (!apiKey) {
    return NextResponse.json({ message: "Missing API key" }, { status: 401 });
  }

  const invoiceId = req.nextUrl.searchParams.get("invoiceId");
  if (!invoiceId) {
    return NextResponse.json({ message: "Missing invoiceId" }, { status: 400 });
  }

  let body: string | undefined;
  try {
    const text = await req.text();
    if (text) body = text;
  } catch {
    // no body
  }

  const apiPath = `/api/portal/customers/${encodeURIComponent(externalId)}/invoices/${invoiceId}/checkout`;

  try {
    const res = await fetch(`${BACKEND_URL}${apiPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: body || "{}",
    });

    const responseBody = await res.text();
    return new NextResponse(responseBody, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { message: "Backend unavailable" },
      { status: 502 },
    );
  }
}
