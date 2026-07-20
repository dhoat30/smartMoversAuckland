import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const version = process.env.META_GRAPH_API_VERSION?.trim() || "v25.0";
const appId = required("META_APP_ID");
const appSecret = required("META_APP_SECRET");
const pageId = required("META_PAGE_ID");
const pageToken = required("META_PAGE_ACCESS_TOKEN");

async function graph(path, { token = pageToken, params = {} } = {}) {
  const url = new URL(`${version}/${path.replace(/^\/+/, "")}`, "https://graph.facebook.com/");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.error) {
    const code = payload?.error?.code;
    throw new Error(`Graph check failed for ${path} (HTTP ${response.status}${code ? `, code ${code}` : ""})`);
  }
  return payload;
}

const page = await graph("me", { params: { fields: "id,name" } });
if (String(page.id) !== String(pageId)) {
  throw new Error("META_PAGE_ACCESS_TOKEN belongs to a different Page than META_PAGE_ID.");
}
console.log(`✓ Page token identifies the configured Page: ${page.name || page.id}`);

const formsPayload = await graph(`${pageId}/leadgen_forms`, {
  params: { fields: "id,name,status", limit: 100 },
});
const activeForms = (formsPayload.data || []).filter((form) => form.status === "ACTIVE");
console.log(`✓ Listed Instant Forms: ${activeForms.length} active`);

const appToken = `${appId}|${appSecret}`;
const appSubscriptions = await graph(`${appId}/subscriptions`, {
  token: appToken,
});
const pageSubscription = (appSubscriptions.data || []).find(
  (subscription) =>
    subscription.object === "page" &&
    (subscription.fields || []).some((field) =>
      typeof field === "string" ? field === "leadgen" : field?.name === "leadgen",
    ),
);
if (!pageSubscription) {
  throw new Error("App-level Page webhook subscription is missing the leadgen field.");
}
console.log("✓ App-level Page webhook subscription includes leadgen");

const pageSubscriptions = await graph(`${pageId}/subscribed_apps`, {
  params: { fields: "id,name,subscribed_fields" },
});
const subscribedApp = (pageSubscriptions.data || []).find(
  (app) =>
    String(app.id) === String(appId) &&
    (app.subscribed_fields || []).includes("leadgen"),
);
if (!subscribedApp) {
  throw new Error("Page-level app subscription is missing leadgen.");
}
console.log("✓ Page-level app subscription includes leadgen");

let recentLead = null;
for (const form of activeForms) {
  const leads = await graph(`${form.id}/leads`, {
    params: {
      fields: "id,created_time,ad_id,form_id,field_data",
      limit: 1,
    },
  });
  if (leads.data?.[0]) {
    recentLead = leads.data[0];
    break;
  }
}

if (recentLead) {
  console.log(
    `✓ Retrieved a recent lead safely (ID present, ${recentLead.field_data?.length || 0} fields; values not printed)`,
  );
} else {
  console.log("ℹ No existing lead was available to retrieve from active forms");
}

console.log("Verification complete. No MoverMate lead was created.");
