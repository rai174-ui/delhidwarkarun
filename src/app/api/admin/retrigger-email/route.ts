import { NextResponse } from "next/server";
import { syncAndGetRegistrations } from "../../../../lib/registrationStore";
import { sendRegistrationConfirmationEmail } from "../../../../lib/emailService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRetrigger(request);
}

export async function POST(request: Request) {
  return handleRetrigger(request);
}

async function handleRetrigger(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let passcode = searchParams.get("passcode") || "";
    let targetId = searchParams.get("id") || "";
    let targetRegNo =
      searchParams.get("regNo") || searchParams.get("bib") || "";
    let targetEmail = searchParams.get("email") || "";
    let targetPaymentId = searchParams.get("paymentId") || "";

    // If POST, also check body
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body.passcode) passcode = body.passcode;
        if (body.id) targetId = body.id;
        if (body.regNo || body.bib) targetRegNo = body.regNo || body.bib;
        if (body.email) targetEmail = body.email;
        if (body.paymentId) targetPaymentId = body.paymentId;
      } catch {}
    }

    const expectedPasscode = process.env.ADMIN_PASSCODE || "DDR2027ADMIN";
    if (passcode !== expectedPasscode) {
      return NextResponse.json(
        {
          error:
            "Invalid Admin Passcode. Use ?passcode=DDR2027ADMIN to retrigger.",
        },
        { status: 401 }
      );
    }

    // Fetch all registrations (with live Razorpay sync)
    const { records } = await syncAndGetRegistrations();

    if (!records || records.length === 0) {
      return NextResponse.json(
        {
          error:
            "No registrations found in database or Razorpay payment history.",
          recordsFound: 0,
        },
        { status: 404 }
      );
    }

    // Locate target record or pick the latest registration
    let targetRecord = records[0];

    if (targetId) {
      targetRecord = records.find((r) => r.id === targetId) || targetRecord;
    } else if (targetRegNo) {
      targetRecord =
        records.find(
          (r) =>
            r.bib === targetRegNo || r.registrationNumber === targetRegNo
        ) || targetRecord;
    } else if (targetEmail) {
      targetRecord =
        records.find(
          (r) => r.email.toLowerCase() === targetEmail.toLowerCase()
        ) || targetRecord;
    } else if (targetPaymentId) {
      targetRecord =
        records.find((r) => r.paymentId === targetPaymentId) || targetRecord;
    }

    if (!targetRecord) {
      return NextResponse.json(
        { error: "Could not find a registration to retrigger." },
        { status: 404 }
      );
    }

    // Send the confirmation email
    const emailResult = await sendRegistrationConfirmationEmail(targetRecord);

    return NextResponse.json({
      success: emailResult.sent,
      message: emailResult.sent
        ? `Confirmation email triggered successfully for Registration ${
            targetRecord.registrationNumber || targetRecord.bib
          }!`
        : `Email delivery issue encountered. See diagnostics below.`,
      targetRegistration: {
        registrationNumber: targetRecord.registrationNumber || targetRecord.bib,
        fullName: targetRecord.fullName,
        email: targetRecord.email,
        mobile: targetRecord.mobile,
        category: targetRecord.categoryName,
        distance: targetRecord.distance,
        amountPaid: targetRecord.amountPaid,
        paymentId: targetRecord.paymentId,
        registeredAt: targetRecord.registeredAt,
      },
      emailDiagnostics: emailResult,
      envCheck: {
        resendConfigured: Boolean(process.env.RESEND_API_KEY),
        resendFromConfigured: process.env.RESEND_FROM || "(default: noreply@delhidwarkarun.com)",
        smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
        organizerNotificationEmail:
          process.env.ORGANIZER_NOTIFICATION_EMAIL || "padam@amigoconnect.com",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to retrigger email confirmation." },
      { status: 500 }
    );
  }
}
