import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No auth token provided" }, { status: 401 });
    }

    if (!adminDb || !adminAuth) {
      return NextResponse.json({ error: "Firebase Services not initialized" }, { status: 500 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    const userRef = adminDb.doc(`users/${uid}`);
    const userSnap = await userRef.get();

    const userData = {
      email: email || "",
      displayName: name || "",
      photoURL: picture || "",
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!userSnap.exists) {
      await userRef.set({
        ...userData,
        role: "user",
        createdAt: new Date().toISOString(),
        wishlist: [],
        orders: [],
      });
    } else {
      await userRef.update(userData);
    }

    return NextResponse.json({ 
        message: userSnap.exists ? "User synced" : "User created",
        role: (userSnap.data()?.role) || "user"
    });
  } catch (error) {
    console.error("User Sync Error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
