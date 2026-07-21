const FIELD_ALIASES = {
  fullName: ["full_name", "name", "contact_name"],
  firstName: ["first_name", "firstname", "given_name"],
  lastName: ["last_name", "lastname", "surname", "family_name"],
  email: ["email", "email_address"],
  phone: ["phone_number", "mobile_number", "mobile_phone", "phone"],
  pickup: [
    "pickup_address",
    "pickup_location",
    "moving_from",
    "move_from",
    "where_are_you_moving_from",
    "where_are_you_moving_from_",
  ],
  dropoff: [
    "dropoff_address",
    "drop_off_address",
    "dropoff_location",
    "moving_to",
    "move_to",
    "where_are_you_moving_to",
    "where_are_you_moving_to_",
  ],
  moveDate: ["moving_date", "preferred_move_date", "date_of_move", "move_date"],
  propertyType: ["type_of_property", "home_type", "property_type"],
  message: [
    "additional_information",
    "additional_details",
    "comments",
    "message",
  ],
  jobCategory: ["services_required", "move_type", "moving_job_category"],
};

export function normalizeMetaFieldName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function fieldValue(field) {
  const values = Array.isArray(field?.values) ? field.values : [];
  return values
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

function createFieldMap(fieldData) {
  const map = new Map();
  for (const field of fieldData || []) {
    const key = normalizeMetaFieldName(field?.name);
    const value = fieldValue(field);
    if (key && value) map.set(key, value);
  }
  return map;
}

function findValue(fields, aliases, matcher) {
  for (const alias of aliases) {
    if (fields.has(alias)) return { key: alias, value: fields.get(alias) };
  }

  if (matcher) {
    for (const [key, value] of fields) {
      if (matcher(key)) return { key, value };
    }
  }

  return { key: null, value: "" };
}

function splitFullName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() || "",
    lastName: parts.join(" "),
  };
}

function titleFromFieldName(name) {
  return name
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function moverMateJobCategory(service) {
  const normalized = normalizeMetaFieldName(service);
  if (normalized.includes("unpack")) return "Unpacking";
  if (normalized.includes("pack")) return "Packing";
  return "Moving";
}

export function mapMetaLeadToMoverMate(lead, { formName, pageId } = {}) {
  const fields = createFieldMap(lead?.field_data);
  const used = new Set();
  const take = (aliases, matcher) => {
    const result = findValue(fields, aliases, matcher);
    if (result.key) used.add(result.key);
    return result.value;
  };

  const explicitFirstName = take(FIELD_ALIASES.firstName);
  const explicitLastName = take(FIELD_ALIASES.lastName);
  const fullName = take(FIELD_ALIASES.fullName);
  const splitName = splitFullName(fullName);
  const firstName = explicitFirstName || splitName.firstName;
  const lastName = explicitLastName || splitName.lastName;

  if (!firstName) {
    const error = new Error(
      "Meta lead is missing a usable name; MoverMate lead was not created.",
    );
    error.code = "META_LEAD_MISSING_NAME";
    throw error;
  }

  const email = take(FIELD_ALIASES.email);
  const phone = take(FIELD_ALIASES.phone);
  const pickup = take(
    FIELD_ALIASES.pickup,
    (key) =>
      /(where|what|address|location).*(moving|move).*(from|pickup|pick_up)/.test(
        key,
      ) || /(pickup|pick_up).*(address|location)/.test(key),
  );
  const dropoff = take(
    FIELD_ALIASES.dropoff,
    (key) =>
      /(where|what|address|location).*(moving|move).*(to|dropoff|drop_off)/.test(
        key,
      ) || /(dropoff|drop_off).*(address|location)/.test(key),
  );
  const date = take(FIELD_ALIASES.moveDate);
  const propertyType = take(FIELD_ALIASES.propertyType);
  const message = take(FIELD_ALIASES.message);
  const serviceRequired = take(FIELD_ALIASES.jobCategory);

  const noteLines = [];
  if (propertyType) noteLines.push(`Property type: ${propertyType}`);
  if (serviceRequired) noteLines.push(`Services required: ${serviceRequired}`);
  if (message) noteLines.push(`Additional information: ${message}`);

  for (const [key, value] of fields) {
    if (!used.has(key)) noteLines.push(`${titleFromFieldName(key)}: ${value}`);
  }

  const formLabel = formName || lead?.form_id || "Unknown form";
  return {
    firstName,
    lastName,
    email,
    phone,
    date,
    pickup,
    dropoff,
    source: `Meta Instant Form - ${formLabel}`,
    // MoverMate only accepts configured job type names. Do not guess an
    // account-specific value from a free-form Meta answer.
    jobCategory: moverMateJobCategory(serviceRequired),
    note: noteLines.join("\n"),
    metadata: {
      meta_lead_id: lead?.id,
      meta_form_id: lead?.form_id,
      meta_ad_id: lead?.ad_id,
      meta_page_id: pageId,
      meta_created_time: lead?.created_time,
    },
  };
}
