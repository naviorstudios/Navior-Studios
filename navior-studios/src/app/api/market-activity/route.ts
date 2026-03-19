import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    if (!adminDb) {
       return NextResponse.json([{ name: "Operative", location: "Global Node", product: "S_01 Unit", time: "Just Now", type: "SYNC" }]);
    }

    const snapshot = await adminDb.collection('orders')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const activities = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        name: data.shippingData?.name?.split(' ')[0] || "Operative",
        location: data.shippingData?.city || "Unknown Node",
        product: data.items?.[0]?.name || "Classified Gear",
        time: "Just Now",
        type: data.status === "deployed" ? "DEPLOYMENT" : "SYNC"
      };
    });

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: "Beacon Offline" }, { status: 500 });
  }
}
