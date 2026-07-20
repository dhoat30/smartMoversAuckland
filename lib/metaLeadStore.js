import { randomUUID } from "node:crypto";

const KEY_PREFIX = "smartmovers:meta-lead:";
const LOCK_PREFIX = "smartmovers:meta-lead-lock:";
const RETRY_INDEX = "smartmovers:meta-lead-retries";
const RECORD_TTL_SECONDS = 180 * 24 * 60 * 60;
const LOCK_TTL_SECONDS = 120;
const PERMANENT_FAILURE_CODES = new Set(["META_LEAD_MISSING_NAME"]);

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function redisCommand(command, { fetchImpl = fetch } = {}) {
  const url = requiredEnvironment("UPSTASH_REDIS_REST_URL").replace(/\/$/, "");
  const token = requiredEnvironment("UPSTASH_REDIS_REST_TOKEN");
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.error) {
    throw new Error(`Durable lead store request failed (${response.status}).`);
  }
  return payload?.result;
}

function recordKey(leadId) {
  return `${KEY_PREFIX}${leadId}`;
}

function lockKey(leadId) {
  return `${LOCK_PREFIX}${leadId}`;
}

function parseRecord(value) {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error("Durable lead store contains an invalid record.");
  }
}

function nextRetryTime(attemptCount) {
  const minutes = Math.min(360, Math.max(1, 2 ** Math.max(0, attemptCount - 1)));
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function safeFailureCode(error) {
  if (typeof error?.code === "string") return error.code.slice(0, 120);
  if (Number.isInteger(error?.status)) return `HTTP_${error.status}`;
  return "PROCESSING_FAILED";
}

async function saveRecord(record, options) {
  await redisCommand(
    [
      "SET",
      recordKey(record.metaLeadId),
      JSON.stringify(record),
      "EX",
      RECORD_TTL_SECONDS,
    ],
    options,
  );
}

export function createMetaLeadStore({ fetchImpl = fetch } = {}) {
  const commandOptions = { fetchImpl };

  return {
    async get(leadId) {
      return parseRecord(
        await redisCommand(["GET", recordKey(leadId)], commandOptions),
      );
    },

    async claim(leadId, { maxAttempts = 8 } = {}) {
      const token = randomUUID();
      const acquired = await redisCommand(
        ["SET", lockKey(leadId), token, "NX", "EX", LOCK_TTL_SECONDS],
        commandOptions,
      );
      if (acquired !== "OK") return { claimed: false, reason: "in_progress" };

      const existing = await this.get(leadId);
      if (existing?.status === "processed") {
        await this.release(leadId, token);
        return { claimed: false, reason: "processed", record: existing };
      }
      if ((existing?.attemptCount || 0) >= maxAttempts) {
        await redisCommand(["ZREM", RETRY_INDEX, String(leadId)], commandOptions);
        await this.release(leadId, token);
        return { claimed: false, reason: "attempts_exhausted", record: existing };
      }
      if (PERMANENT_FAILURE_CODES.has(existing?.lastError)) {
        await redisCommand(["ZREM", RETRY_INDEX, String(leadId)], commandOptions);
        await this.release(leadId, token);
        return { claimed: false, reason: "permanent_failure", record: existing };
      }
      if (
        existing?.nextAttemptAt &&
        Date.parse(existing.nextAttemptAt) > Date.now()
      ) {
        await this.release(leadId, token);
        return { claimed: false, reason: "backoff", record: existing };
      }

      const now = new Date().toISOString();
      const record = {
        metaLeadId: String(leadId),
        status: "pending",
        attemptCount: (existing?.attemptCount || 0) + 1,
        lastError: null,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        processedAt: null,
        nextAttemptAt: null,
      };
      await saveRecord(record, commandOptions);
      return { claimed: true, token, record };
    },

    async markProcessed(leadId, token, record) {
      const now = new Date().toISOString();
      const processed = {
        ...record,
        status: "processed",
        lastError: null,
        updatedAt: now,
        processedAt: now,
        nextAttemptAt: null,
      };
      await saveRecord(processed, commandOptions);
      await Promise.allSettled([
        redisCommand(["ZREM", RETRY_INDEX, String(leadId)], commandOptions),
        this.release(leadId, token),
      ]);
      return processed;
    },

    async markFailed(leadId, token, record, error) {
      const now = new Date().toISOString();
      const failed = {
        ...record,
        status: "failed",
        lastError: safeFailureCode(error),
        updatedAt: now,
        processedAt: null,
        nextAttemptAt: PERMANENT_FAILURE_CODES.has(safeFailureCode(error))
          ? null
          : nextRetryTime(record.attemptCount),
      };
      await saveRecord(failed, commandOptions);
      if (failed.nextAttemptAt) {
        await redisCommand(
          ["ZADD", RETRY_INDEX, Date.parse(failed.nextAttemptAt), String(leadId)],
          commandOptions,
        );
      } else {
        await redisCommand(["ZREM", RETRY_INDEX, String(leadId)], commandOptions);
      }
      await this.release(leadId, token);
      return failed;
    },

    async listDue({ limit = 50 } = {}) {
      return (
        (await redisCommand(
          [
            "ZRANGEBYSCORE",
            RETRY_INDEX,
            "-inf",
            Date.now(),
            "LIMIT",
            0,
            limit,
          ],
          commandOptions,
        )) || []
      ).map(String);
    },

    async release(leadId, token) {
      const script =
        "if redis.call('GET', KEYS[1]) == ARGV[1] then " +
        "return redis.call('DEL', KEYS[1]) else return 0 end";
      await redisCommand(
        ["EVAL", script, 1, lockKey(leadId), token],
        commandOptions,
      );
    },
  };
}
