import { NextResponse } from "next/server";
import { createMetaLeadProcessor } from "@/lib/metaLeadProcessor";
import { safeSecretEqual } from "@/lib/metaWebhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") || "";
  const suppliedSecret = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!safeSecretEqual(suppliedSecret, cronSecret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const summary = await createMetaLeadProcessor().reconcile();
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    console.error("Meta lead reconciliation failed", {
      code: error?.code || "RECONCILIATION_FAILED",
      status: error?.status,
    });
    return NextResponse.json(
      { ok: false, error: "Reconciliation failed." },
      { status: 500 },
    );
  }
}
