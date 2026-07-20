const LEAD_FIELDS = "id,created_time,ad_id,form_id,field_data";

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function getMetaGraphConfig() {
  const version = (process.env.META_GRAPH_API_VERSION || "v25.0").trim();
  if (!/^v\d+\.\d+$/.test(version)) {
    throw new Error("META_GRAPH_API_VERSION must look like v25.0.");
  }

  return {
    version,
    pageId: requiredEnvironment("META_PAGE_ID"),
    pageToken: requiredEnvironment("META_PAGE_ACCESS_TOKEN"),
  };
}

function safeGraphError(payload, status) {
  const type = payload?.error?.type;
  const code = payload?.error?.code;
  const detail = [type, code ? `code ${code}` : ""].filter(Boolean).join(", ");
  return `Meta Graph API request failed (${status}${detail ? `; ${detail}` : ""}).`;
}

export async function fetchMetaGraphJson(
  pathOrUrl,
  params = {},
  { token, version, fetchImpl = fetch } = {},
) {
  const config = getMetaGraphConfig();
  const accessToken = token || config.pageToken;
  const apiVersion = version || config.version;
  const url = pathOrUrl.startsWith("https://")
    ? new URL(pathOrUrl)
    : new URL(
        `${apiVersion}/${String(pathOrUrl).replace(/^\/+/, "")}`,
        "https://graph.facebook.com/",
      );

  if (url.hostname !== "graph.facebook.com") {
    throw new Error("Refusing to follow a non-Meta Graph API pagination URL.");
  }
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetchImpl(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.error) {
    const error = new Error(safeGraphError(payload, response.status));
    error.status = response.status;
    error.code = payload?.error?.code
      ? `META_GRAPH_${payload.error.code}`
      : "META_GRAPH_ERROR";
    throw error;
  }

  return payload;
}

export async function getMetaLead(leadId, options = {}) {
  return fetchMetaGraphJson(
    encodeURIComponent(String(leadId)),
    { fields: LEAD_FIELDS },
    options,
  );
}

export async function getMetaFormName(formId, options = {}) {
  if (!formId) return null;
  try {
    const form = await fetchMetaGraphJson(
      encodeURIComponent(String(formId)),
      { fields: "id,name" },
      options,
    );
    return typeof form?.name === "string" ? form.name.trim() || null : null;
  } catch {
    return null;
  }
}

export async function listActiveMetaForms(options = {}) {
  const { pageId } = getMetaGraphConfig();
  const forms = [];
  let next = null;

  do {
    const page = await fetchMetaGraphJson(
      next || `${encodeURIComponent(pageId)}/leadgen_forms`,
      next ? {} : { fields: "id,name,status", limit: 100 },
      options,
    );
    forms.push(...(page?.data || []));
    next = page?.paging?.next || null;
  } while (next);

  return forms.filter((form) => form?.id && form?.status === "ACTIVE");
}

export async function listRecentFormLeads(
  formId,
  { since, maxLeads = 200, ...options } = {},
) {
  const leads = [];
  let next = null;
  let reachedOlderLead = false;

  do {
    const page = await fetchMetaGraphJson(
      next || `${encodeURIComponent(String(formId))}/leads`,
      next ? {} : { fields: LEAD_FIELDS, limit: Math.min(100, maxLeads) },
      options,
    );

    for (const lead of page?.data || []) {
      const createdAt = Date.parse(lead?.created_time || "");
      if (since && Number.isFinite(createdAt) && createdAt < since.getTime()) {
        reachedOlderLead = true;
        break;
      }
      leads.push(lead);
      if (leads.length >= maxLeads) break;
    }

    next = page?.paging?.next || null;
  } while (next && !reachedOlderLead && leads.length < maxLeads);

  return leads;
}

export { LEAD_FIELDS };
