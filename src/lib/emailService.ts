import nodemailer from "nodemailer";
import { StoredRegistration } from "./registrationStore";

export interface EmailSendResult {
  sent: boolean;
  provider?: "smtp" | "resend";
  messageId?: string;
  error?: string;
}

/**
 * Generates the official HTML Confirmation & E-Bib email for Delhi Dwarka Run 2027
 */
export function buildConfirmationEmailHtml(record: StoredRegistration): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.delhidwarkarun.com";
  const logoUrl = `${siteUrl}/assets/ddr-logo.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed — Delhi Dwarka Run 2027</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:'Segoe UI',Arial,sans-serif;color:#0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F1F5F9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 10px 25px rgba(15,23,42,0.08);">
          
          <!-- Top Banner -->
          <tr>
            <td style="background:linear-gradient(90deg,#0284C7 0%,#F26522 100%);padding:12px 24px;text-align:center;color:#FFFFFF;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">
              🎉 Official Registration Confirmation &amp; E-Bib • 14-Feb-2027
            </td>
          </tr>

          <!-- Header with Logo -->
          <tr>
            <td style="background-color:#0B1D30;padding:28px 28px 24px 28px;color:#FFFFFF;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display:inline-block;background-color:#C5D887;padding:8px 14px;border-radius:12px;border:2px solid #F26522;margin-bottom:12px;">
                      <img src="${logoUrl}" alt="Delhi Dwarka Runners (DDR)" height="44" style="display:block;height:44px;width:auto;" />
                    </div>
                    <h1 style="margin:0;font-size:24px;font-weight:900;letter-spacing:0.5px;text-transform:uppercase;color:#FFFFFF;">
                      4th Edition Dwarka Half Marathon
                    </h1>
                    <p style="margin:4px 0 0 0;font-size:14px;font-weight:700;color:#C5D887;text-transform:uppercase;">
                      Delhi Dwarka Run 2027 • Sunday, 14th February 2027
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 28px 12px 28px;">
              <p style="margin:0 0 10px 0;font-size:16px;font-weight:700;color:#0F172A;">
                Dear ${record.fullName},
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">
                Congratulations! Your registration and payment for the <strong>4th Edition of Dwarka Half Marathon — Delhi Dwarka Run 2027</strong> have been confirmed. Below is your official <strong>Runner E-Bib &amp; Payment Receipt</strong>.
              </p>
            </td>
          </tr>

          <!-- Official E-Bib Card -->
          <tr>
            <td style="padding:12px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg,#0B1D30 0%,#122B46 100%);border:3px solid #F26522;border-radius:18px;padding:22px;color:#FFFFFF;text-align:center;">
                <tr>
                  <td>
                    <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#C5D887;">
                      DELHI DWARKA RUNNERS • OFFICIAL E-BIB
                    </div>
                    <div style="font-size:44px;font-weight:900;letter-spacing:2px;color:#FFFFFF;margin:6px 0;">
                      #${record.bib}
                    </div>
                    <div style="display:inline-block;background-color:#F26522;color:#FFFFFF;font-size:12px;font-weight:800;padding:5px 14px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">
                      ${record.categoryName} (${record.distance})
                    </div>
                    <div style="margin-top:12px;font-size:15px;font-weight:800;color:#C5D887;text-transform:uppercase;">
                      ${record.fullName}
                    </div>
                    <div style="margin-top:4px;font-size:12px;color:#CBD5E1;">
                      Tee Size: <strong>${record.tshirtSize}</strong> &nbsp;|&nbsp; Gender: <strong>${record.gender}</strong> &nbsp;|&nbsp; Blood Group: <strong>${record.bloodGroup}</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Event & Registration Details Table -->
          <tr>
            <td style="padding:16px 28px;">
              <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#0284C7;">
                📋 Registration &amp; Race Day Details
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:13px;">
                <tr>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;width:42%;">Event Date &amp; Flag-Off</td>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;font-weight:700;color:#0F172A;">Sunday, 14-Feb-2027 • ${record.startTime}</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">Starting &amp; Finishing Point</td>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;font-weight:700;color:#0F172A;">Max Hospital, Sector 10, Dwarka, New Delhi</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">Race Category</td>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;font-weight:700;color:#0F172A;">${record.categoryName} (${record.distance})</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">Dry-Fit Event Tee Size</td>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;font-weight:700;color:#0F172A;">Size ${record.tshirtSize}</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">Registered Mobile &amp; Email</td>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;font-weight:700;color:#0F172A;">${record.mobile} • ${record.email}</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">Emergency Contact</td>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;font-weight:700;color:#0F172A;">${record.emergencyName} (${record.emergencyPhone})</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">Amount Paid</td>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;font-weight:800;color:#059669;">₹${record.amountPaid}.00 (PAID)</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">Payment Reference ID</td>
                  <td style="padding:9px 12px;border-bottom:1px solid #E2E8F0;font-family:monospace;font-weight:700;color:#0F172A;">${record.paymentId}${record.orderId ? ` / ${record.orderId}` : ""}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bib Expo & Important Info Box -->
          <tr>
            <td style="padding:8px 28px 24px 28px;">
              <div style="background-color:#F8FAFC;border-left:4px solid #0284C7;border-radius:10px;padding:14px 16px;font-size:12.5px;line-height:1.6;color:#334155;">
                <strong style="color:#0F172A;display:block;margin-bottom:4px;">📦 Bib &amp; Race Kit Distribution Expo:</strong>
                • <strong>Dates:</strong> Friday, 12th Feb &amp; Saturday, 13th Feb 2027 (10:00 AM – 06:00 PM)<br/>
                • <strong>Location:</strong> Sector 10, Dwarka, New Delhi<br/>
                • Please carry this Confirmation Email / E-Bib (#${record.bib}) and a valid Government Photo ID to collect your Race Kit.<br/>
                • 🎁 Your Bib #${record.bib} is automatically entered into the <strong>Race Day Lucky Draw</strong>!
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0F172A;padding:20px 28px;text-align:center;color:#94A3B8;font-size:12px;line-height:1.6;">
              <div style="font-weight:800;color:#FFFFFF;margin-bottom:4px;">
                DELHI DWARKA RUNNERS (DDR) • AMIGO CONNECT (AMIGOCONNECT.COM)
              </div>
              <div>
                📍 Starting Point: Max Hospital, Sector 10, Dwarka, New Delhi
              </div>
              <div style="margin-top:6px;">
                ✉️ <a href="mailto:padam@amigoconnect.com" style="color:#38BDF8;text-decoration:none;">padam@amigoconnect.com</a>
                &nbsp;|&nbsp;
                📞 <a href="tel:+919971299631" style="color:#C5D887;text-decoration:none;">+91 99712 99631</a>
                &nbsp;|&nbsp;
                🌐 <a href="${siteUrl}" style="color:#F26522;text-decoration:none;">www.delhidwarkarun.com</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends the confirmation email to the registered runner (and BCC/copy to organizer)
 * Supports either SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) or Resend API (RESEND_API_KEY)
 */
export async function sendRegistrationConfirmationEmail(
  record: StoredRegistration
): Promise<EmailSendResult> {
  const subject = `Registration Confirmed (Bib #${record.bib}) — Delhi Dwarka Run 2027 (${record.categoryName})`;
  const html = buildConfirmationEmailHtml(record);
  const organizerCopy =
    process.env.ORGANIZER_NOTIFICATION_EMAIL || "padam@amigoconnect.com";

  // Option 1: SMTP via Nodemailer (Hostinger, Gmail App Password, Google Workspace, Brevo, etc.)
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpFrom =
    process.env.SMTP_FROM ||
    `Delhi Dwarka Run 2027 <${smtpUser || "padam@amigoconnect.com"}>`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: record.email,
        bcc: organizerCopy,
        replyTo: "padam@amigoconnect.com",
        subject,
        html,
      });

      return {
        sent: true,
        provider: "smtp",
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.error("SMTP email send error:", err);
      return {
        sent: false,
        provider: "smtp",
        error: err?.message || "Failed to send email via SMTP.",
      };
    }
  }

  // Option 2: Resend HTTP API (if RESEND_API_KEY is configured)
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom =
    process.env.RESEND_FROM ||
    "Delhi Dwarka Run 2027 <noreply@delhidwarkarun.com>";

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [record.email],
          bcc: [organizerCopy],
          reply_to: "padam@amigoconnect.com",
          subject,
          html,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          sent: false,
          provider: "resend",
          error: data?.message || "Resend API error",
        };
      }

      return {
        sent: true,
        provider: "resend",
        messageId: data?.id,
      };
    } catch (err: any) {
      console.error("Resend email error:", err);
      return {
        sent: false,
        provider: "resend",
        error: err?.message || "Failed to send email via Resend.",
      };
    }
  }

  return {
    sent: false,
    error:
      "Email credentials not configured yet (add SMTP_HOST, SMTP_USER, SMTP_PASS or RESEND_API_KEY in Railway Variables).",
  };
}
