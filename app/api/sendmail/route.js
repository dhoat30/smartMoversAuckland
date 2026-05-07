import { NextResponse } from "next/server";

const DOMAIN = process.env.MAILGUN_DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY;
const EMAIL_TO = process.env.EMAIL_TO;
const MAILGUN_FROM_EMAIL =
  process.env.MAILGUN_FROM_EMAIL ||
  (DOMAIN ? `leads@${DOMAIN.replace(/^mail\./, "")}` : undefined);
const MAILGUN_FROM_NAME = process.env.MAILGUN_FROM_NAME || "Smart Movers";

export const runtime = "nodejs";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req) {
  const { email, message, formName } = await req.json();

  if (!DOMAIN || !API_KEY || !EMAIL_TO || !MAILGUN_FROM_EMAIL) {
    return NextResponse.json(
      { message: "Missing Mailgun configuration", success: false },
      { status: 500 }
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { message: "A valid customer email is required", success: false },
      { status: 400 }
    );
  }

  const subject = formName || "Smart Movers form submission";
  const safeMessage = String(message || "");
  const htmlMessage = escapeHtml(safeMessage).replaceAll("\n", "<br>");
  const url = `https://api.mailgun.net/v3/${DOMAIN}/messages`;
  const formData = new URLSearchParams();

  formData.append("from", `${MAILGUN_FROM_NAME} <${MAILGUN_FROM_EMAIL}>`);
  formData.append("to", EMAIL_TO);
  formData.append("h:Reply-To", email);
  formData.append("subject", subject);
  formData.append("text", safeMessage);
  formData.append("o:tracking", "false");
  formData.append("o:tracking-clicks", "false");
  formData.append("o:tracking-opens", "false");
  formData.append(
    "html",
    `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#222;">${htmlMessage}</div>`
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`api:${API_KEY}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to send email", success: false, data },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Email sent", success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to send email", success: false },
      { status: 500 }
    );
  }
}
