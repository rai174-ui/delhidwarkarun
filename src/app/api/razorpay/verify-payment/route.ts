import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // Missing fields: return 400
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          verified: false,
          success: false,
          error:
            "Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
        },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        {
          verified: false,
          success: false,
          error: "Server configuration error: missing RAZORPAY_KEY_SECRET.",
        },
        { status: 500 }
      );
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    // Signature mismatch: return 400, do NOT mark as paid
    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          verified: false,
          success: false,
          error: "Payment verification failed: invalid signature.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        verified: false,
        success: false,
        error: error?.message || "Payment verification error.",
      },
      { status: 500 }
    );
  }
}
