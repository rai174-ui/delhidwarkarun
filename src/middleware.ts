import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // If an external bot, crawler, or vulnerability scanner sends a dummy `next-action` header (e.g. "x")
  // our codebase doesn't use Next.js Server Actions, so intercept and reject cleanly
  // to prevent Next.js from throwing "Failed to find Server Action" stack traces in logs.
  if (request.headers.has("next-action")) {
    return new NextResponse("Invalid action header", { status: 400 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
