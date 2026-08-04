import assert from "node:assert/strict";
import test from "node:test";

import { parseJsonResponse } from "../utils/fetchJson.js";

test("parses successful JSON responses", async () => {
  const response = new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

  assert.deepEqual(
    await parseJsonResponse(response, "https://example.test/data"),
    { ok: true },
  );
});

test("rejects HTML before attempting JSON parsing", async () => {
  const response = new Response("<html><head></head></html>", {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

  await assert.rejects(
    parseJsonResponse(response, "https://example.test/data"),
    /Expected JSON.*text\/html/,
  );
});

test("reports unsuccessful HTTP responses", async () => {
  const response = new Response(JSON.stringify({ error: "unavailable" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });

  await assert.rejects(
    parseJsonResponse(response, "https://example.test/data"),
    /HTTP 503/,
  );
});

test("can parse JSON error payloads when the caller handles the status", async () => {
  const response = new Response(JSON.stringify({ error: "invalid request" }), {
    status: 400,
    headers: { "Content-Type": "application/problem+json" },
  });

  assert.deepEqual(
    await parseJsonResponse(response, "https://example.test/data", {
      requireOk: false,
    }),
    { error: "invalid request" },
  );
});
