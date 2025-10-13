import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_ORIGINS = (process.env.CORS_ORIGIN || "").split(",");

export default function middleware(req: NextRequest) {
  const origin = req.headers.get("Origin");
  const matchingValidOrigin = VALID_ORIGINS.find(
    (validOrigin) => validOrigin == origin,
  );

  const response = NextResponse.next();

  if (matchingValidOrigin) {
    for (const [header, value] of Object.entries({
      "Access-Control-Allow-Origin": matchingValidOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })) {
      response.headers.set(header, value);
    }
  }

  // You can also set request headers in NextResponse.rewrite
  return response;
}

// export const config = {
//   matcher: ["/api/:path*"],
// };
