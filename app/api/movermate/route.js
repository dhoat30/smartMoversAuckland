import { NextResponse } from "next/server";
import { createMoverMateLead } from "@/lib/moverMate";

export async function POST(req) {
  try {
    const { body } = await req.json();
    const data = await createMoverMateLead(
      { ...body, source: body.source ?? body.Source },
      { sendInventoryLink: body.sendInventoryLink === true },
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error?.message || "Unknown error" },
      { status: error?.status || 500 },
    );
  }
}
