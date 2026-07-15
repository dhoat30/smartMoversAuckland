import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  PORTAL_COOKIE_NAME,
  portalSessionIsValid,
} from "@/lib/internalPortalAuth";
import { uploadOfflineConversion } from "@/lib/googleDataManager";

export const runtime = "nodejs";

export async function POST(request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(PORTAL_COOKIE_NAME)?.value;

  if (!portalSessionIsValid(session)) {
    return NextResponse.json(
      { ok: false, error: "Your session has expired. Sign in again." },
      { status: 401 },
    );
  }

  try {
    const input = await request.json();
    const result = await uploadOfflineConversion(input);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Offline conversion upload failed", {
      message: error?.message,
      status: error?.status,
      googleDetails: error?.googleDetails,
    });

    const status =
      Number.isInteger(error?.status) && error.status >= 400 && error.status < 600
        ? error.status
        : 400;

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "The conversion could not be sent to Google.",
      },
      { status },
    );
  }
}
