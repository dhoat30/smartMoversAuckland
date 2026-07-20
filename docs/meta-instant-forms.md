# Meta Instant Forms → MoverMate

This integration receives every `leadgen` webhook for the configured Facebook Page, retrieves the complete lead through Meta Graph API, maps it to MoverMate, and uses durable Redis state to prevent duplicate delivery. A five-minute reconciliation job recovers leads whose webhook was delayed or not delivered.

No Meta or MoverMate secret is exposed to browser code. Logs contain counts, status codes, and safe error codes only—not lead contact details or access tokens.

## Architecture

- `GET /api/meta-leads/webhook`: Meta callback verification.
- `POST /api/meta-leads/webhook`: raw-body HMAC verification and lead processing.
- `GET /api/meta-leads/reconcile`: protected scheduled reconciliation.
- Meta Graph API `v25.0`: lead, form, active-form, and recent-form-lead retrieval.
- Upstash Redis REST: durable lead status, retry schedule, and processing locks.
- MoverMate: `POST https://server.movermate.com.au/webhook/leads`.

Redis records contain only the Meta lead ID and processing metadata:

```text
status: pending | processed | failed
attemptCount
lastError (safe code only)
createdAt
updatedAt
processedAt
nextAttemptAt
```

Records expire after 180 days. Processing locks expire after two minutes. Failed deliveries use exponential backoff, capped at six hours, and stop after `META_LEAD_MAX_ATTEMPTS`.

## Required Vercel environment variables

Add these to Production, Preview (if used), and the local environment as appropriate:

```dotenv
MOVERMATE_API_KEY=

META_APP_ID=
META_APP_SECRET=
META_PAGE_ID=
META_PAGE_ACCESS_TOKEN=
META_GRAPH_API_VERSION=v25.0
META_WEBHOOK_VERIFY_TOKEN=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CRON_SECRET=
```

Optional tuning:

```dotenv
META_RECONCILE_LOOKBACK_HOURS=24
META_RECONCILE_MAX_LEADS=200
META_LEAD_MAX_ATTEMPTS=8
```

`MOVERMATE_TOKEN` remains supported temporarily for existing website forms, but production should migrate to `MOVERMATE_API_KEY`.

Generate independent, random values for `META_WEBHOOK_VERIFY_TOKEN` and `CRON_SECRET`. Do not reuse the Meta app secret.

## Durable storage setup

1. Create an Upstash Redis database in the Vercel Marketplace or Upstash Console.
2. Copy its HTTPS REST URL into `UPSTASH_REDIS_REST_URL`.
3. Copy the standard read/write REST token into `UPSTASH_REDIS_REST_TOKEN`.
4. Never use the read-only token: processing requires `SET`, `ZADD`, `ZREM`, and `EVAL`.
5. Disable eviction for this database if the selected plan permits it. Idempotency records must not be removed under memory pressure.

The integration intentionally fails closed if Redis is not configured. It will not send a Meta lead to MoverMate without durable duplicate protection.

## Vercel deployment and cron

`vercel.json` schedules:

```text
*/5 * * * *  /api/meta-leads/reconcile
```

Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically when `CRON_SECRET` is configured. Confirm that the selected Vercel plan supports five-minute cron frequency. After adding all environment variables, redeploy; changing environment variables alone does not update an already-built deployment.

The public callback URL is:

```text
https://www.smartmovers.co.nz/api/meta-leads/webhook
```

## Meta Business and app configuration

1. Create or select a Meta app using **Capture and manage ad leads with Marketing API**.
2. Connect the app to the Business Portfolio that owns the Smart Movers Facebook Page.
3. In Business Settings, create/select a Business System User and assign both the Page and app.
4. Generate a non-expiring System User token.
5. With that System User token, call:

   ```http
   GET /v25.0/me/accounts?fields=id,name,access_token
   ```

6. Find the configured Smart Movers Page and store its returned **Page access token** as `META_PAGE_ACCESS_TOKEN`. Do not store the System User token or a temporary Graph API Explorer token in this variable.
7. Grant these permissions where Meta makes them available for the app/business configuration:

   - `leads_retrieval`
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_ads`
   - `pages_manage_metadata`
   - `ads_management`
   - `ads_read`
   - `business_management`

8. In the Meta app dashboard, configure a **Page** webhook:
   - Callback: `https://www.smartmovers.co.nz/api/meta-leads/webhook`
   - Verify token: the exact `META_WEBHOOK_VERIFY_TOKEN`
   - Field: `leadgen`
9. Subscribe the Page itself using the Page access token:

   ```http
   POST /v25.0/{META_PAGE_ID}/subscribed_apps?subscribed_fields=leadgen
   Authorization: Bearer {META_PAGE_ACCESS_TOKEN}
   ```

10. In **Meta Business Settings → Integrations → Leads Access → Page → CRMs**, assign the new Lead Sync app.
11. Publish the app/live mode and complete any **Review needed** access review.

Both subscription layers are mandatory. Verify them with:

```http
GET /v25.0/{META_APP_ID}/subscriptions
```

The result must contain a Page callback with `leadgen`.

```http
GET /v25.0/{META_PAGE_ID}/subscribed_apps?fields=id,name,subscribed_fields
```

The result must contain this app with `leadgen`.

Run the repository's read-only verifier after configuring local environment variables:

```bash
npm run verify:meta-leads
```

It verifies the Page token, lists active forms, checks both subscription layers, and retrieves one recent lead without printing field values. It never sends anything to MoverMate.

## Field mapping

Meta names are normalized to lowercase snake case. The integration maps common name, email, phone, pickup, drop-off, move date, property type, message, service, and move-type variants. Natural-language questions such as “Where are you moving from?” and “Where are you moving to?” are also recognized.

Every unrecognized custom question and answer is appended to the MoverMate note. Leads with no usable name are marked failed and are not sent because MoverMate requires `firstName`.

MoverMate receives source in this format:

```text
Meta Instant Form - {form name or form ID}
```

The payload metadata includes Meta lead, form, ad, Page, and creation-time identifiers. The Meta lead ID is also sent as `Idempotency-Key`; the Redis record is the primary duplicate guard.

MoverMate must preserve or honor the supplied `Idempotency-Key`/`meta_lead_id` for absolute protection against the rare distributed-systems case where MoverMate accepts a request but the application loses the response before it can mark Redis processed. The application prevents concurrent delivery and normal webhook/cron replays independently.

## Safe testing

These checks do not create MoverMate leads:

```bash
npm test
npm run build
npm run verify:meta-leads
```

Webhook verification after deployment:

```bash
curl -i 'https://www.smartmovers.co.nz/api/meta-leads/webhook?hub.mode=subscribe&hub.verify_token=WRONG&hub.challenge=test'
```

Expect `403`. Use the actual verify token locally or in Meta's dashboard to test the `200` challenge response; do not paste the token into shared logs or shell history.

A POST without a valid `X-Hub-Signature-256` must return `401`.

The automated tests use fake Meta fields, an in-memory fake store, and a fake MoverMate function. They prove that replaying the same `leadgen_id` creates only one outbound call and that reconciliation discovers an unprocessed lead.

Before using Meta's Lead Ads Testing Tool, announce the test because a correctly configured submission creates a real MoverMate lead. Give the test an unmistakable name such as `META TEST - DO NOT CONTACT` and remove/archive it according to business procedure.

## Troubleshooting

### Page token expired or belongs to the wrong Page

- Run `npm run verify:meta-leads`.
- Regenerate a non-expiring Business System User token, call `/me/accounts`, and replace the Page token with the returned token for `META_PAGE_ID`.
- Redeploy after changing Vercel environment variables.

### Missing Leads Access

- Confirm the System User has the Page and app assets assigned.
- In **Business Settings → Integrations → Leads Access → Page → CRMs**, assign the Lead Sync app.
- Confirm `leads_retrieval` is granted and any required app review is complete.

### Missing app-level `leadgen`

- Check `GET /{APP_ID}/subscriptions`.
- Reconfigure the Page webhook callback in the app dashboard and subscribe to `leadgen`.

### Missing Page-level `leadgen`

- Check `GET /{PAGE_ID}/subscribed_apps?fields=id,name,subscribed_fields`.
- Repeat `POST /{PAGE_ID}/subscribed_apps?subscribed_fields=leadgen` with the Page token.

### Signature failures (`401`)

- Confirm `META_APP_SECRET` belongs to `META_APP_ID`.
- Confirm no proxy modifies the raw request body.
- Meta uses `X-Hub-Signature-256: sha256=<hex HMAC>`; the route verifies the untouched bytes before JSON parsing.

### MoverMate rejection

- Confirm `MOVERMATE_API_KEY` is current and server-only.
- Check Vercel logs for the HTTP status and safe error code; no customer details are logged.
- Confirm the form supplies a usable name.
- A failed record remains in Redis and is retried with backoff. Do not delete its Redis record just to force a retry, because that removes duplicate protection.

### Webhook missing but reconciliation succeeds

- Check both Meta subscription layers and Leads Access.
- Cron will recover recent form leads, but fixing webhook delivery keeps latency low.
- Confirm Vercel Cron executions occur every five minutes and return HTTP 200.

## Official references

- [Meta: Retrieving Lead Ads leads](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving/)
- [Meta: Graph API Webhooks setup and signatures](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/)
- [Meta: Graph API v25.0 changelog](https://developers.facebook.com/docs/graph-api/changelog/version25.0/)
- [Meta: Page `subscribed_apps`](https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps/)
- [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi)
