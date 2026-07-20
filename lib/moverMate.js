const MOVERMATE_URL = "https://server.movermate.com.au/webhook/leads";

function requiredMoverMateToken({ allowLegacyToken = true } = {}) {
  const token = (
    process.env.MOVERMATE_API_KEY ||
    (allowLegacyToken ? process.env.MOVERMATE_TOKEN : "") ||
    ""
  ).trim();

  if (!token) {
    throw new Error(
      "Missing MOVERMATE_API_KEY (MOVERMATE_TOKEN is supported temporarily for existing website forms).",
    );
  }

  return token;
}

export function pruneEmpty(object) {
  return Object.fromEntries(
    Object.entries(object || {}).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    }),
  );
}

export function sanitizeMoverMateMetadata(metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return undefined;
  }

  const allowedKeys = [
    "gclid",
    "gbraid",
    "wbraid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "meta_lead_id",
    "meta_form_id",
    "meta_ad_id",
    "meta_page_id",
    "meta_created_time",
  ];
  const cleanMetadata = pruneEmpty(
    Object.fromEntries(allowedKeys.map((key) => [key, metadata[key]])),
  );

  return Object.keys(cleanMetadata).length ? cleanMetadata : undefined;
}

export function buildMoverMatePayload(input) {
  const firstName = String(input?.firstName || "").trim();
  if (!firstName) {
    throw new Error("MoverMate requires firstName; the lead was not sent.");
  }

  return pruneEmpty({
    firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    date: input.date,
    pickup: input.pickup,
    dropoff: input.dropoff,
    source: input.source,
    jobType: input.jobType,
    jobCategory: input.jobCategory,
    note: input.note,
    metadata: sanitizeMoverMateMetadata(input.metadata),
  });
}

function safeMoverMateError(payload, status) {
  const failureType = payload?.success === false ? "application rejection" : "HTTP rejection";
  return `MoverMate rejected the lead (${failureType}, HTTP ${status}).`;
}

export async function createMoverMateLead(
  input,
  {
    sendInventoryLink = false,
    idempotencyKey,
    allowLegacyToken = true,
    fetchImpl = fetch,
  } = {},
) {
  const payload = buildMoverMatePayload(input);
  const url = new URL(MOVERMATE_URL);
  if (sendInventoryLink) url.searchParams.set("sendInventoryLink", "true");

  const headers = {
    token: requiredMoverMateToken({ allowLegacyToken }),
    "Content-Type": "application/json",
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  const response = await fetchImpl(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const responsePayload = await response.json().catch(() => null);

  if (!response.ok || responsePayload?.success === false) {
    const error = new Error(safeMoverMateError(responsePayload, response.status));
    error.status = response.status;
    throw error;
  }

  return responsePayload;
}
