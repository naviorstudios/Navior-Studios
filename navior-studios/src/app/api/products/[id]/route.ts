import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const { id } = await params;
    const doc = await adminDb.doc(`products/${id}`).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Product Detail Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!adminDb || !adminAuth) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader?.startsWith("Bearer ")) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = await req.json();
    await adminDb.doc(`products/${id}`).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Product update Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!adminDb || !adminAuth) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader?.startsWith("Bearer ")) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await adminDb.doc(`products/${id}`).delete();

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product delete Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
