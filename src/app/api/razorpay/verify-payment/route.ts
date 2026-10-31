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

    if (!razorpay_payment_id) {
      return NextResponse.json(
        { verified: false, error: "Missing razorpay_payment_id" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify cryptographic signature when order_id, signature, and secret are present
    if (keySecret && razorpay_order_id && razorpay_signature) {
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(payload)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json(
          {
            verified: false,
            error: "Invalid Razorpay payment signature verification failed.",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { verified: false, error: error?.message || "Verification error" },
      { status: 500 }
    );
  }
}
