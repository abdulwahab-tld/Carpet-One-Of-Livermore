import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, fieldErrorsFrom, type ContactPayload } from "@/lib/contact-schema";
import { business } from "@/lib/site";

function messageBody(data: ContactPayload) {
  return [
    "New flooring estimate request",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Flooring type: ${data.flooringType}`,
    `Project type: ${data.projectType}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "The form could not be read. Please try again." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: fieldErrorsFrom(parsed.error) },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: `Email delivery is not configured yet. Please call ${business.phoneDisplay} or email ${business.email}.`,
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL || business.email;
  const from = process.env.CONTACT_FROM_EMAIL || `${business.name} <onboarding@resend.dev>`;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: parsed.data.email,
    subject: `Flooring estimate request from ${parsed.data.name}`,
    text: messageBody(parsed.data),
  });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: `We could not send your request. Please call ${business.phoneDisplay} or email ${business.email}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
