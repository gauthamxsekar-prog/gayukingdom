import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "https://gayukingdomapi.vercel.app/api";
const LOCAL_API_URL = process.env.LOCAL_API_URL || "http://localhost:8000/api";

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
  const incomingUrl = new URL(request.url);
  const queryString = incomingUrl.search;

  const hostname = incomingUrl.hostname;
  const isLocalHost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  let baseApi = isLocalHost ? LOCAL_API_URL : API_URL;

  try {
    const baseApiUrl = new URL(baseApi);
    // prevent proxying back to the same Next.js server (recursion)
    if (
      baseApiUrl.hostname === incomingUrl.hostname &&
      (baseApiUrl.port || (baseApiUrl.protocol === "https:" ? "443" : "80")) ===
        (incomingUrl.port || (incomingUrl.protocol === "https:" ? "443" : "80"))
    ) {
      console.warn(
        "[proxy] LOCAL_API_URL appears to point to the same host:port as the incoming request — falling back to remote API to avoid recursion. Set LOCAL_API_URL to your backend server.",
      );
      baseApi = API_URL;
    }
  } catch (e) {
    console.warn("[proxy] invalid base API URL", baseApi, e);
  }

  const url = `${baseApi.replace(/\/$/, "")}/${pathString}${queryString}`;

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
    queryString,
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
