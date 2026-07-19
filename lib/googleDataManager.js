import { createHash } from "node:crypto";
import { getVercelOidcToken } from "@vercel/oidc";
import { ExternalAccountClient } from "google-auth-library";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const DATA_MANAGER_SCOPE = "https://www.googleapis.com/auth/datamanager";
const DATA_MANAGER_URL = "https://datamanager.googleapis.com/v1/events:ingest";

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex").toUpperCase();
}

function normalizeEmail(value) {
  let email = String(value || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid customer email address.");
  }

  const [localPart, domain] = email.split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") {
    email = `${localPart.replace(/\./g, "")}@${domain}`;
  }

  return email;
}

function normalizePhone(value) {
  let phone = String(value || "").trim().replace(/[^\d+]/g, "");

  if (phone.startsWith("00")) phone = `+${phone.slice(2)}`;
  if (phone.startsWith("0")) phone = `+64${phone.slice(1)}`;
  if (phone.startsWith("64")) phone = `+${phone}`;

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error("Enter a valid phone number, preferably in +64 format.");
  }

  return phone;
}

function validateConversionTime(value) {
  const localValue = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(localValue)) {
    throw new Error("Enter a valid conversion date and time.");
  }

  const conversionTime = dayjs.tz(localValue, "Pacific/Auckland");
  if (
    !conversionTime.isValid() ||
    conversionTime.format("YYYY-MM-DDTHH:mm") !== localValue
  ) {
    throw new Error("Enter a valid New Zealand conversion date and time.");
  }

  const now = Date.now();
  if (conversionTime.valueOf() > now + 5 * 60 * 1000) {
    throw new Error("Conversion time cannot be in the future.");
  }
  if (conversionTime.valueOf() < now - 90 * 24 * 60 * 60 * 1000) {
    throw new Error("Google cannot import a click conversion older than 90 days.");
  }

  return conversionTime.toISOString();
}

function validateSubmission(input) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const gclid = String(input.gclid || "").trim();
  const conversionTime = validateConversionTime(input.conversionTime);
  const conversionValue = Number(input.conversionValue);
  const currency = String(input.currency || "").trim().toUpperCase();

  if (!Number.isFinite(conversionValue) || conversionValue < 0) {
    throw new Error("Conversion value must be zero or greater.");
  }
  if (currency !== "NZD") {
    throw new Error("Conversion currency must be NZD.");
  }
  if (gclid.length > 512) {
    throw new Error("Google Click ID is too long.");
  }
  if (input.confirmCustomerData !== true) {
    throw new Error("Confirm that the customer data can be used for conversion measurement.");
  }

  return { email, phone, gclid, conversionTime, conversionValue, currency };
}

function buildTransactionId(data, conversionActionId) {
  return createHash("sha256")
    .update(
      [
        conversionActionId,
        data.gclid,
        data.email,
        data.phone,
        data.conversionTime,
      ].join("|"),
    )
    .digest("hex")
    .slice(0, 32);
}

function googleErrorMessage(payload, fallback) {
  const error = payload?.error;
  if (!error) return fallback;

  const violations = (error.details || [])
    .flatMap((detail) => detail.fieldViolations || [])
    .map((violation) => violation.description || violation.reason)
    .filter(Boolean);

  return [error.message, ...violations].filter(Boolean).join(" ") || fallback;
}

async function getDataManagerAuthClient() {
  const projectNumber = digitsOnly(requiredEnvironment("GCP_PROJECT_NUMBER"));
  const poolId = requiredEnvironment("GCP_WORKLOAD_IDENTITY_POOL_ID");
  const providerId = requiredEnvironment("GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID");
  const serviceAccountEmail = requiredEnvironment("GCP_SERVICE_ACCOUNT_EMAIL");
  const oidcAudience = requiredEnvironment("GCP_AUDIENCE");
  const expectedOidcAudience =
    `https://iam.googleapis.com/projects/${projectNumber}/locations/global/` +
    `workloadIdentityPools/${poolId}/providers/${providerId}`;

  if (oidcAudience.replace(/\/$/, "") !== expectedOidcAudience) {
    throw new Error(
      "Google OIDC configuration mismatch: GCP_AUDIENCE must use the same numeric " +
        "project number, workload identity pool ID, and provider ID as the GCP variables.",
    );
  }

  const oidcToken = await getVercelOidcToken({ audience: oidcAudience });
  const authClient = ExternalAccountClient.fromJSON({
    type: "external_account",
    audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: async () => oidcToken,
    },
  });

  if (!authClient) throw new Error("Google authentication could not be initialized.");
  authClient.scopes = [DATA_MANAGER_SCOPE];
  return authClient;
}

export async function uploadOfflineConversion(input) {
  const data = validateSubmission(input);
  const customerId = digitsOnly(requiredEnvironment("GOOGLE_ADS_CUSTOMER_ID"));
  const conversionActionId = digitsOnly(
    requiredEnvironment("GOOGLE_CONVERTED_LEADS_CONVERSION_ACTION_ID"),
  );
  const projectId = requiredEnvironment("GOOGLE_CLOUD_PROJECT_ID");
  const transactionId = buildTransactionId(data, conversionActionId);

  const destination = {
    operatingAccount: {
      accountType: "GOOGLE_ADS",
      accountId: customerId,
    },
    productDestinationId: conversionActionId,
  };

  const event = {
    conversionValue: data.conversionValue,
    currency: data.currency,
    eventTimestamp: data.conversionTime,
    transactionId,
    eventSource: "WEB",
    userData: {
      userIdentifiers: [
        { emailAddress: sha256Hex(data.email) },
        { phoneNumber: sha256Hex(data.phone) },
      ],
    },
  };

  if (data.gclid) event.adIdentifiers = { gclid: data.gclid };

  const authClient = await getDataManagerAuthClient();
  const tokenResponse = await authClient.getAccessToken();
  const accessToken =
    typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;

  if (!accessToken) throw new Error("Google did not return an access token.");

  const response = await fetch(DATA_MANAGER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "x-goog-user-project": projectId,
    },
    body: JSON.stringify({
      destinations: [destination],
      encoding: "HEX",
      events: [event],
      validateOnly: false,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(
      googleErrorMessage(payload, `Google rejected the upload (${response.status}).`),
    );
    error.status = response.status;
    error.googleDetails = payload?.error?.details || [];
    throw error;
  }

  if (!payload?.requestId) {
    throw new Error("Google accepted the request but did not return a request ID.");
  }

  return {
    requestId: payload.requestId,
    transactionId,
    conversionTime: data.conversionTime,
  };
}
