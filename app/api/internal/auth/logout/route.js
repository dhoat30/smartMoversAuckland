import { NextResponse } from "next/server";
import { PORTAL_COOKIE_NAME } from "@/lib/internalPortalAuth";

export async function POST(request) {
  const response = NextResponse.redirect(new URL("/internal/login", request.url), 303);
  response.cookies.set(PORTAL_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });
  return response;
}
