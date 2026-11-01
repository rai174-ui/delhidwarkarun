import { NextResponse } from "next/server";
import {
  getAllRegistrations,
  saveRegistration,
  convertRegistrationsToCSV,
} from "../../../lib/registrationStore";
import { sendRegistrationConfirmationEmail } from "../../../lib/emailService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "public";
    const format = searchParams.get("format") || "json";
    const passcode = searchParams.get("passcode") || "";

    const expectedPasscode = process.env.ADMIN_PASSCODE || "DDR2027ADMIN";
    const allRecords = getAllRegistrations();

    // Admin mode or CSV export requires passcode
    if (mode === "admin" || format === "csv") {
      if (passcode !== expectedPasscode) {
        return NextResponse.json(
          { error: "Invalid Admin Passcode." },
          { status: 401 }
        );
      }

      if (format === "csv") {
        const csvContent = convertRegistrationsToCSV(allRecords);
        return new NextResponse(csvContent, {
          status: 200,
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="delhi-dwarka-run-2027-registrations-${new Date()
              .toISOString()
              .slice(0, 10)}.csv"`,
          },
        });
      }

      return NextResponse.json({
        totalCount: allRecords.length,
        totalRevenue: allRecords.reduce(
          (sum, r) => sum + (Number(r.amountPaid) || 0),
          0
        ),
        registrations: allRecords,
      });
    }

    // Public mode: only return non-sensitive leaderboard fields
    const publicList = allRecords.map((r) => ({
      bib: r.bib,
      name: r.fullName,
      category: r.categoryName,
      gender: r.gender,
      netTime: "Registered (14-Feb-2027)",
      pace: "Lucky Draw Eligible",
      isNew: true,
      registeredAt: r.registeredAt,
    }));

    return NextResponse.json({
      totalCount: publicList.length,
      registrations: publicList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch registrations." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.email || !body.mobile || !body.categoryName) {
      return NextResponse.json(
        { error: "Missing required registration fields." },
        { status: 400 }
      );
    }

    const saved = saveRegistration({
      fullName: body.fullName,
      email: body.email,
      mobile: body.mobile,
      dob: body.dob || "",
      gender: body.gender || "Male",
      bloodGroup: body.bloodGroup || "O+",
      tshirtSize: body.tshirtSize || "M",
      emergencyName: body.emergencyName || "",
      emergencyPhone: body.emergencyPhone || "",
      categoryId: body.categoryId || "half",
      categoryName: body.categoryName,
      distance: body.distance || "21.097 KM",
      startTime: body.startTime || "05:30 AM",
      originalFee: Number(body.originalFee) || 0,
      discountAmount: Number(body.discountAmount) || 0,
      amountPaid: Number(body.amountPaid) || 0,
      couponCode: body.couponCode || "DDR50",
      paymentId: body.paymentId || `pay_${Date.now()}`,
      orderId: body.orderId || "",
      paymentMode: body.paymentMode || "razorpay",
      paymentStatus: "PAID",
    });

    // Optional external webhook forwarding (e.g., Google Sheets Apps Script / Make / Zapier)
    if (process.env.REGISTRATION_WEBHOOK_URL) {
      fetch(process.env.REGISTRATION_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saved),
      }).catch((err) => console.error("Webhook forwarding error:", err));
    }

    // Send official HTML Confirmation & E-Bib email to the registered runner (and copy to organizer)
    const emailConfirmation = await sendRegistrationConfirmationEmail(saved);

    return NextResponse.json({
      success: true,
      registration: saved,
      emailConfirmation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to save registration." },
      { status: 500 }
    );
  }
}
