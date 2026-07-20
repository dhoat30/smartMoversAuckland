import { createHmac, timingSafeEqual } from "node:crypto";

function safeStringEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function verifyMetaWebhookChallenge(searchParams, verifyToken) {
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode !== "subscribe" ||
    !verifyToken ||
    !safeStringEqual(token, verifyToken) ||
    challenge === null
  ) {
    return null;
  }

  return challenge;
}

export function isValidMetaSignature(rawBody, signatureHeader, appSecret) {
  if (!appSecret || !signatureHeader?.startsWith("sha256=")) return false;

  const suppliedHex = signatureHeader.slice("sha256=".length);
  if (!/^[a-f0-9]{64}$/i.test(suppliedHex)) return false;

  const supplied = Buffer.from(suppliedHex, "hex");
  const expected = createHmac("sha256", appSecret)
    .update(rawBody)
    .digest();

  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function extractMetaLeadIds(payload, configuredPageId) {
  if (payload?.object !== "page" || !Array.isArray(payload.entry)) return [];

  const leadIds = new Set();
  for (const entry of payload.entry) {
    if (configuredPageId && String(entry?.id) !== String(configuredPageId)) {
      continue;
    }

    for (const change of entry?.changes || []) {
      const leadId = change?.field === "leadgen" && change?.value?.leadgen_id;
      if (leadId) leadIds.add(String(leadId));
    }
  }

  return [...leadIds];
}

export function safeSecretEqual(left, right) {
  return Boolean(left && right && safeStringEqual(left, right));
}
