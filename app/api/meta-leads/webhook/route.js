import { NextResponse } from "next/server";
import { createMetaLeadProcessor } from "@/lib/metaLeadProcessor";
import {
  extractMetaLeadIds,
  isValidMetaSignature,
  verifyMetaWebhookChallenge,
} from "@/lib/metaWebhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN?.trim();
  const challenge = verifyMetaWebhookChallenge(
    new URL(request.url).searchParams,
    verifyToken,
  );

  if (challenge === null) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return new NextResponse(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request) {
  const rawBody = Buffer.from(await request.arrayBuffer());
  const signature = request.headers.get("x-hub-signature-256");
  const appSecret = process.env.META_APP_SECRET?.trim();

  if (!isValidMetaSignature(rawBody, signature, appSecret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const pageId = process.env.META_PAGE_ID?.trim();
  if (!pageId) {
    console.error("Meta lead webhook configuration error", {
      code: "MISSING_META_PAGE_ID",
    });
    return NextResponse.json({ ok: false, error: "Webhook is not configured." }, { status: 500 });
  }

  const leadIds = extractMetaLeadIds(payload, pageId);
  if (!leadIds.length) {
    return NextResponse.json({ ok: true, received: 0 });
  }

  const processor = createMetaLeadProcessor();
  const results = await Promise.allSettled(
    leadIds.map((leadId) => processor.processLead(leadId)),
  );
  const failed = results.filter((result) => result.status === "rejected").length;

  if (failed) {
    console.error("Meta lead webhook processing incomplete", {
      received: leadIds.length,
      failed,
    });
    return NextResponse.json(
      { ok: false, received: leadIds.length, failed },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, received: leadIds.length });
}
