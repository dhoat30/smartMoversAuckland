import { createHmac, timingSafeEqual } from "node:crypto";

export const PORTAL_COOKIE_NAME = "smart_movers_internal_session";
export const PORTAL_SESSION_SECONDS = 60 * 60 * 24 * 30;

function getSessionSecret() {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  if (!username || !password) {
    throw new Error("Internal portal credentials are not configured.");
  }

  return `${username}:${password}`;
}

function sign(value) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safelyEqual(left, right) {
  const leftDigest = createHmac("sha256", "portal-credential")
    .update(String(left))
    .digest();
  const rightDigest = createHmac("sha256", "portal-credential")
    .update(String(right))
    .digest();

  return timingSafeEqual(leftDigest, rightDigest);
}

export function credentialsAreValid(username, password) {
  return (
    safelyEqual(username, process.env.USERNAME || "") &&
    safelyEqual(password, process.env.PASSWORD || "")
  );
}

export function createPortalSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + PORTAL_SESSION_SECONDS;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function portalSessionIsValid(value) {
  if (!value) return false;

  const [version, expiresAt, signature] = value.split(".");
  if (version !== "v1" || !expiresAt || !signature) return false;
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now() / 1000) {
    return false;
  }

  const expected = sign(`${version}.${expiresAt}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function portalCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: PORTAL_SESSION_SECONDS,
    path: "/",
  };
}
