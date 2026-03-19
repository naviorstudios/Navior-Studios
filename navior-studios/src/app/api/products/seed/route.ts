import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const SEED_MANIFEST = [
  {
    "id": "aero-x",
    "name": "AERO-X CASE",
    "category": "Cases",
    "price": 4999,
    "image": "https://images.unsplash.com/photo-1592890678914-71086c6799c2?auto=format&fit=crop&q=80&w=800",
    "description": "Premium aerospace-grade carbon fiber protection for elite field operatives.",
    "featured": true,
    "stock": 50,
    "compatibility": ["iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 14 Pro"]
  },
  {
    "id": "titan-link",
    "name": "TITAN LINK",
    "category": "Accessories",
    "price": 2499,
    "image": "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800",
    "description": "Military-grade titanium cable system with high-speed neural sync.",
    "featured": true,
    "stock": 120,
    "compatibility": ["Universal USB-C", "Thunderbolt 4"]
  },
  {
    "id": "neon-shield",
    "name": "NEON SHIELD",
    "category": "Cases",
    "price": 3999,
    "image": "https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&q=80&w=800",
    "description": "Impact-resistant polycarbonate with UV-reactive protection nodes.",
    "featured": false,
    "stock": 30,
    "compatibility": ["iPhone 15", "Samsung S24 Ultra"]
  },
  {
    "id": "void-glass",
    "name": "VOID GLASS",
    "category": "Protection",
    "price": 1499,
    "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
    "description": "9H sapphire coated screen protection with anti-reflective void-coat.",
    "featured": true,
    "stock": 200,
    "compatibility": ["All 6.7 inch Displays"]
  },
  {
    "id": "orbital-nexus",
    "name": "ORBITAL NEXUS",
    "category": "Accessories",
    "price": 7999,
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
    "description": "Magnetic levitation dock with 30W rapid deployment charging.",
    "featured": true,
    "stock": 15,
    "compatibility": ["MagSafe Compatible"]
  }
];

export async function POST() {
  try {
     if (!adminDb) return NextResponse.json({ error: "DB Refused" }, { status: 500 });

     const batch = adminDb.batch();

     // Optional: Clear existing manifest for a clean sync
     const snapshot = await adminDb.collection("products").get();
     snapshot.docs.forEach(doc => batch.delete(doc.ref));

     SEED_MANIFEST.forEach(p => {
        const ref = adminDb.collection("products").doc(p.id);
        batch.set(ref, { 
           ...p, 
           updatedAt: FieldValue.serverTimestamp() 
        });
     });

     await batch.commit();
     console.log("🚀 [STATION]: Manifest Seeded for Vercel Cloud Mission");
     return NextResponse.json({ message: "Cloud Manifest Synced", status: "AUTHORIZED" });
  } catch (err) {
     console.error("Seeding error:", err);
     return NextResponse.json({ error: "Seeding Node Failed" }, { status: 500 });
  }
}
