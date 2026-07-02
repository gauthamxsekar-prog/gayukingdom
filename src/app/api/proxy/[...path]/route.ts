import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "https://gayukingdomapi.vercel.app/api";

export async function GET(request: Request, context: any) {
  return proxy(request, context.params);
}

export async function POST(request: Request, context: any) {
  return proxy(request, context.params);
}

export async function PUT(request: Request, context: any) {
  return proxy(request, context.params);
}

export async function DELETE(request: Request, context: any) {
  return proxy(request, context.params);
}

export async function PATCH(request: Request, context: any) {
  return proxy(request, context.params);
}

async function proxy(request: Request, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  const pathString = path.join("/");
  const url = `${API_URL}/${pathString}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("host");

  const requestBody =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  console.log("[proxy] forwarding", {
    method: request.method,
    url,
    pathString,
    headers: Object.fromEntries(requestHeaders.entries()),
    body: requestBody,
  });

  const response = await fetch(url, {
    method: request.method,
    headers: requestHeaders,
    body: requestBody || undefined,
    redirect: "follow",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("x-nextjs-proxy", "true");

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
