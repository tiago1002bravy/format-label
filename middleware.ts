import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/api/:path*"],
};

export function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);

  // Log básico de request
  const { method, nextUrl } = request;
  console.log(JSON.stringify({ level: "info", requestId, event: "request", method, path: nextUrl.pathname }));

  // Mede duração no finalize
  response.headers.set("server-timing", `total;desc=\"Total\";dur=${Date.now() - start}`);
  return response;
}


