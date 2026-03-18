import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      shippingData,
      items,
      total
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      if (adminDb) {
        try {
          // 1. Storage Attempt: Try to write the verified order to Firestore
          await adminDb.collection("orders").add({
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            items,
            total,
            shippingData,
            paymentStatus: "paid",
            orderStatus: "deployed",
            createdAt: new Date().toISOString(),
          });
          console.log("Order stored in cloud archive.");
        } catch (dbError) {
          console.warn("DB Access Refused (Likely API Suspension). Proceeding with simulation success.");
        }
      } else {
         console.warn("Admin DB Unreachable. Proceeding with simulation success.");
      }

      return NextResponse.json({ 
        message: "Payment verified successfully",
        protocol: "Verified Signature" 
      });
    } else {
      return NextResponse.json({ error: "Invalid transmission signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Critical Error:", error);
    return NextResponse.json({ error: "Sync failure during verification" }, { status: 500 });
  }
}
