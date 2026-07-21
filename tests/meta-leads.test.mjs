import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

import {
  extractMetaLeadIds,
  isValidMetaSignature,
  verifyMetaWebhookChallenge,
} from "../lib/metaWebhook.js";
import {
  mapMetaLeadToMoverMate,
  normalizeMetaFieldName,
} from "../lib/metaLeadMapper.js";
import { createMetaLeadProcessor } from "../lib/metaLeadProcessor.js";
import { createMetaLeadStore } from "../lib/metaLeadStore.js";

const sampleLead = {
  id: "lead-123",
  created_time: "2026-07-21T01:02:03+0000",
  ad_id: "ad-456",
  form_id: "form-789",
  field_data: [
    { name: "Full Name", values: ["Jamie Example"] },
    { name: "Email", values: ["jamie@example.test"] },
    { name: "Phone Number", values: ["+64 21 555 0101"] },
    { name: "Where are you moving from?", values: ["Auckland"] },
    { name: "Where are you moving to?", values: ["Wellington"] },
    { name: "Move Type", values: ["House move"] },
    { name: "Do you need packing?", values: ["Yes"] },
  ],
};

function createMemoryStore() {
  const records = new Map();
  return {
    records,
    async claim(leadId) {
      const existing = records.get(leadId);
      if (existing?.status === "processed") {
        return { claimed: false, reason: "processed", record: existing };
      }
      const record = {
        metaLeadId: leadId,
        status: "pending",
        attemptCount: (existing?.attemptCount || 0) + 1,
      };
      records.set(leadId, record);
      return { claimed: true, token: "lock", record };
    },
    async markProcessed(leadId, token, record) {
      records.set(leadId, { ...record, status: "processed" });
    },
    async markFailed(leadId, token, record, error) {
      records.set(leadId, {
        ...record,
        status: "failed",
        lastError: error?.code || "PROCESSING_FAILED",
      });
    },
    async listDue() {
      return [...records.values()]
        .filter((record) => record.status === "failed")
        .map((record) => record.metaLeadId);
    },
  };
}

function createFakeUpstashFetch() {
  const strings = new Map();
  const sortedSets = new Map();

  return async (url, options) => {
    const command = JSON.parse(options.body);
    const [name, ...args] = command;
    let result = null;

    if (name === "SET") {
      const [key, value] = args;
      const nx = args.includes("NX");
      if (!nx || !strings.has(key)) {
        strings.set(key, value);
        result = "OK";
      }
    } else if (name === "GET") {
      result = strings.get(args[0]) ?? null;
    } else if (name === "ZADD") {
      const [key, score, member] = args;
      if (!sortedSets.has(key)) sortedSets.set(key, new Map());
      sortedSets.get(key).set(member, Number(score));
      result = 1;
    } else if (name === "ZREM") {
      result = sortedSets.get(args[0])?.delete(args[1]) ? 1 : 0;
    } else if (name === "ZRANGEBYSCORE") {
      result = [];
    } else if (name === "EVAL") {
      const key = args[2];
      const token = args[3];
      if (strings.get(key) === token) {
        strings.delete(key);
        result = 1;
      } else {
        result = 0;
      }
    } else {
      throw new Error(`Unhandled fake Redis command: ${name}`);
    }

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
}

test("webhook challenge requires subscribe mode and the correct token", () => {
  const valid = new URLSearchParams({
    "hub.mode": "subscribe",
    "hub.verify_token": "verify-me",
    "hub.challenge": "challenge-value",
  });
  assert.equal(verifyMetaWebhookChallenge(valid, "verify-me"), "challenge-value");

  valid.set("hub.verify_token", "wrong");
  assert.equal(verifyMetaWebhookChallenge(valid, "verify-me"), null);
});

test("webhook signature uses the untouched raw body", () => {
  const secret = "test-app-secret";
  const body = Buffer.from('{"object":"page","entry":[]}');
  const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

  assert.equal(isValidMetaSignature(body, signature, secret), true);
  assert.equal(isValidMetaSignature(Buffer.from("changed"), signature, secret), false);
  assert.equal(isValidMetaSignature(body, null, secret), false);
});

test("leadgen IDs are page-scoped and deduplicated within a delivery", () => {
  const payload = {
    object: "page",
    entry: [
      {
        id: "page-1",
        changes: [
          { field: "leadgen", value: { leadgen_id: "lead-1" } },
          { field: "leadgen", value: { leadgen_id: "lead-1" } },
          { field: "feed", value: {} },
        ],
      },
      {
        id: "different-page",
        changes: [{ field: "leadgen", value: { leadgen_id: "lead-2" } }],
      },
    ],
  };

  assert.deepEqual(extractMetaLeadIds(payload, "page-1"), ["lead-1"]);
});

test("custom Meta fields map to MoverMate without losing unknown answers", () => {
  assert.equal(normalizeMetaFieldName("Where are you moving from?"), "where_are_you_moving_from");
  const mapped = mapMetaLeadToMoverMate(sampleLead, {
    formName: "Long-distance enquiry",
    pageId: "page-1",
  });

  assert.equal(mapped.firstName, "Jamie");
  assert.equal(mapped.lastName, "Example");
  assert.equal(mapped.pickup, "Auckland");
  assert.equal(mapped.dropoff, "Wellington");
  assert.equal(mapped.jobType, undefined);
  assert.equal(mapped.jobCategory, "Moving");
  assert.equal(mapped.source, "Meta Instant Form - Long-distance enquiry");
  assert.match(mapped.note, /Services required: House move/);
  assert.match(mapped.note, /Do You Need Packing: Yes/);
  assert.equal(mapped.metadata.meta_lead_id, "lead-123");
});

test("a missing name is rejected before MoverMate", () => {
  assert.throws(
    () => mapMetaLeadToMoverMate({ ...sampleLead, field_data: [] }),
    /missing a usable name/i,
  );
});

test("replaying a lead ID does not create a second MoverMate lead", async () => {
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.test";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
  const store = createMetaLeadStore({ fetchImpl: createFakeUpstashFetch() });
  let moverMateCalls = 0;
  const processor = createMetaLeadProcessor({
    store,
    pageId: "page-1",
    fetchLead: async () => sampleLead,
    fetchFormName: async () => "Test form",
    sendToMoverMate: async () => {
      moverMateCalls += 1;
      return { success: true };
    },
    listForms: async () => [],
    listFormLeads: async () => [],
  });

  assert.equal((await processor.processLead("lead-123")).outcome, "processed");
  assert.equal(
    (await processor.processLead("lead-123")).outcome,
    "already_processed",
  );
  assert.equal(moverMateCalls, 1);
});

test("reconciliation discovers an unprocessed lead", async () => {
  const store = createMemoryStore();
  let moverMateCalls = 0;
  const processor = createMetaLeadProcessor({
    store,
    pageId: "page-1",
    fetchLead: async () => sampleLead,
    fetchFormName: async () => "Test form",
    sendToMoverMate: async () => {
      moverMateCalls += 1;
      return { success: true };
    },
    listForms: async () => [{ id: "form-789", status: "ACTIVE" }],
    listFormLeads: async () => [sampleLead],
  });

  const summary = await processor.reconcile();
  assert.equal(summary.candidates, 1);
  assert.equal(summary.processed, 1);
  assert.equal(moverMateCalls, 1);
});
