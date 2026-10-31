import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, categoryName, runnerName, email, mobile } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid registration amount." },
        { status: 400 }
      );
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const amountInPaise = Math.round(Number(amount) * 100);

    // 1. Full Server-Side Razorpay Order Creation (when both Key ID & Secret are set)
    if (keyId && keySecret) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const receiptId = `ddr27_${Date.now()}`;

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: receiptId,
          notes: {
            event: "4th Edition Dwarka Half Marathon (14-Feb-2027)",
            category: categoryName || "",
            runnerName: runnerName || "",
            email: email || "",
            mobile: mobile || "",
          },
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            error:
              orderData?.error?.description ||
              "Failed to create Razorpay order.",
          },
          { status: response.status }
        );
      }

      return NextResponse.json({
        mode: "live_order",
        keyId,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
      });
    }

    // 2. Client-Side Key Mode (if only RAZORPAY_KEY_ID / NEXT_PUBLIC_RAZORPAY_KEY_ID is set)
    if (keyId) {
      return NextResponse.json({
        mode: "client_key",
        keyId,
        amount: amountInPaise,
        currency: "INR",
      });
    }

    // 3. Fallback Demo Mode when environment variables are not configured yet
    return NextResponse.json({
      mode: "demo",
      amount: amountInPaise,
      currency: "INR",
      message:
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not set in environment variables yet.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
