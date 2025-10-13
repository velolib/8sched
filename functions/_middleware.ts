import { verifyToken } from "./utils/jwt.js";

export interface Env {
  JWT_SECRET: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Automatically disable all routes for testing
  // return new Response('Service Unavailable', { status: 503 });

  // Let public users view data (GET requests)
  if (request.method === "GET" && !url.pathname.startsWith("/api/summary")) {
    return await next();
  }

  // Protect all editing endpoints (PUT, POST, etc.)
  if (
    url.pathname.startsWith("/api/summary") ||
    url.pathname.startsWith("/api/schedules") ||
    url.pathname.startsWith("/api/teachers")
  ) {
    // return new Response('Service Unavailable', { status: 503 });

    const cookieHeader = request.headers.get("Cookie") || "";
    const token = cookieHeader.match(/session-token=([^;]+)/)?.[1];

    if (!token) {
      return new Response("Unauthorized: No token", { status: 401 });
    }

    try {
      // The core of the security: verify the JWT
      await verifyToken(env, token);
      // If verification succeeds, proceed to the requested API function
    } catch {
      // If verification fails (bad signature, expired, etc.), block the request
      return new Response("Unauthorized: Invalid token", { status: 401 });
    }
  }

  // Allow all other requests (like /api/auth/login) to pass through
  return await next();
};
