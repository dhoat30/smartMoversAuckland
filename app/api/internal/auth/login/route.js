import { NextResponse } from "next/server";
import {
  PORTAL_COOKIE_NAME,
  createPortalSession,
  credentialsAreValid,
  portalCookieOptions,
} from "@/lib/internalPortalAuth";

export const runtime = "nodejs";

export async function POST(request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  if (!credentialsAreValid(username, password)) {
    return NextResponse.redirect(new URL("/internal/login?error=1", request.url), 303);
  }

  const response = NextResponse.redirect(
    new URL("/internal/offline-conversions", request.url),
    303,
  );
  response.cookies.set(
    PORTAL_COOKIE_NAME,
    createPortalSession(),
    portalCookieOptions(),
  );
  return response;
}
