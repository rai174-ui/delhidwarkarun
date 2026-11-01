import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = "INR",
      receipt,
      categoryName,
      runnerName,
      email,
      mobile,
    } = body;

    const amountInPaise = Math.round(Number(amount));

    // Validate amount >= 100 paise (₹1.00 minimum required by Razorpay)
    if (!amount || Number.isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 paise (INR 1.00)." },
        { status: 400 }
      );
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay API credentials are not configured." },
        { status: 401 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receiptId = receipt || `ddr27_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receiptId,
      notes: {
        event: "4th Edition Dwarka Half Marathon (14-Feb-2027)",
        category: categoryName || "",
        runnerName: runnerName || "",
        email: email || "",
        mobile: mobile || "",
      },
    });

    return NextResponse.json({
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      mode: "live_order",
      keyId,
    });
  } catch (error: any) {
    const statusCode = error?.statusCode === 401 ? 401 : 500;
    const message =
      error?.error?.description ||
      error?.message ||
      "Failed to create Razorpay order.";

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
