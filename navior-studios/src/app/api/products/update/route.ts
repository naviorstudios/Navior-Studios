import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { id, price, stock } = await req.json();
    if (!id || !adminDb) return NextResponse.json({ error: "Missing Unit ID or DB connection" }, { status: 400 });

    const productRef = adminDb.collection('products').doc(id);
    await productRef.update({
      price: Number(price),
      stock: Number(stock),
      updatedAt: FieldValue.serverTimestamp()
    });

    console.log(`🛠️ [ASSET_REFRACTOR]: Unit ${id} updated - Price: ${price}, Stock: ${stock}`);
    return NextResponse.json({ message: "Asset Manifest Updated", status: "SYNCED" });
  } catch (error) {
    return NextResponse.json({ error: "Refraction Failed" }, { status: 500 });
  }
}
