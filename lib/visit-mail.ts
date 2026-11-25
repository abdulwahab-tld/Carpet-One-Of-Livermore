import { Resend } from "resend";
import { business } from "@/lib/site";

type VisitDetails = {
  name: string;
  email: string;
  phone: string;
  flooringType: string;
  projectType: string;
  notes?: string;
  label: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function visitText(details: VisitDetails, intro: string) {
  return [
    intro,
    "",
    `When: ${details.label}`,
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    `Flooring: ${details.flooringType}`,
    `Project: ${details.projectType}`,
    details.notes ? `Notes: ${details.notes}` : "",
    "",
    business.name,
    `${business.street}, ${business.city}, ${business.region} ${business.postalCode}`,
    business.phoneDisplay,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function visitHtml(details: VisitDetails, title: string, intro: string) {
  const rows = [
    ["When", details.label],
    ["Name", details.name],
    ["Email", details.email],
    ["Phone", details.phone],
    ["Flooring", details.flooringType],
    ["Project", details.projectType],
  ];
  if (details.notes) rows.push(["Notes", details.notes]);

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ddd1;color:#6f675f;font-size:13px;width:120px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ddd1;color:#1c1916;font-size:15px;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4efe8;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#faf7f2;border:1px solid #e6ddd1;">
            <tr>
              <td style="padding:28px 28px 12px;background:#5c4033;color:#f4efe8;">
                <div style="font-size:28px;line-height:1.1;">${escapeHtml(business.name)}</div>
                <div style="margin-top:8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#e6ddd1;">${escapeHtml(title)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 8px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1c1916;">
                ${escapeHtml(intro)}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-family:Arial,sans-serif;">
                  ${tableRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#6f675f;">
                ${escapeHtml(`${business.street}, ${business.city}, ${business.region} ${business.postalCode}`)}<br />
                ${escapeHtml(business.phoneDisplay)} · ${escapeHtml(business.email)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendVisitEmails(details: VisitDetails) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { shopNotified: false, visitorNotified: false };

  const resend = new Resend(apiKey);
  const shop = process.env.CONTACT_TO_EMAIL || business.email;
  const from =
    process.env.CONTACT_FROM_EMAIL || `${business.name} <onboarding@resend.dev>`;

  async function deliver(input: {
    to: string;
    subject: string;
    intro: string;
    title: string;
    replyTo?: string;
  }) {
    try {
      const result = await resend.emails.send({
        from,
        to: [input.to],
        replyTo: input.replyTo,
        subject: input.subject,
        text: visitText(details, input.intro),
        html: visitHtml(details, input.title, input.intro),
      });
      if (result.error) {
        console.error("Showroom visit email failed", result.error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Showroom visit email failed", error);
      return false;
    }
  }

  const shopNotified = await deliver({
    to: shop,
    subject: `Showroom visit from ${details.name}`,
    title: "New showroom visit",
    intro: "A showroom visit was booked through the website assistant.",
    replyTo: details.email,
  });
  const visitorNotified = await deliver({
    to: details.email,
    subject: "Your Living Floors showroom visit",
    title: "Visit confirmation",
    intro: `Thank you, ${details.name}. Your showroom visit is confirmed.`,
  });

  return { shopNotified, visitorNotified };
}
