import { NextResponse } from "next/server";

const MOVERMATE_BASE_URL = "https://server.movermate.com.au";
const MOVERMATE_TOKEN = process.env.MOVERMATE_TOKEN;

function pruneEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (v === null || v === undefined) return false;
      if (typeof v === "string" && v.trim() === "") return false;
      return true;
    }),
  );
}

export async function POST(req) {
  try {
    if (!MOVERMATE_TOKEN) {
      return NextResponse.json(
        { success: false, message: "Missing MOVERMATE_TOKEN in env" },
        { status: 500 },
      );
    }

    const { body } = await req.json();

    // Required: firstName + email
    const firstName = body.firstName;
    const email = body.email;

    const missing = [];
    if (!firstName) missing.push("firstName");
    if (!email) missing.push("email");

    if (missing.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Optional fields (include only if provided)
    const payload = pruneEmpty({
      firstName,
      lastName: body.lastName,
      email,
      phone: body.phone,
      pickup: body.pickup,
      dropoff: body.dropoff,
      date: body.date ? body.date : null,
      Source: body.source ?? body.Source, // accept either casing from frontend
      note: body.note,
      // if their API supports extra keys you can keep adding here
    });

    const url = new URL(`${MOVERMATE_BASE_URL}/webhook/leads`);
    if (body.sendInventoryLink === true) {
      url.searchParams.set("sendInventoryLink", "true");
    }

    const resp = await fetch(url.toString(), {
      method: "POST",
      headers: {
        token: MOVERMATE_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "MoverMate request failed",
          status: resp.status,
          data,
          sent: payload, // helpful for debugging
        },
        { status: resp.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
