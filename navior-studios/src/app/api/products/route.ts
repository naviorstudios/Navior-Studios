import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const MOCK_PRODUCTS = [
  {
    id: "mock-1",
    name: "AERO-X CASE",
    category: "Cases",
    price: 4999,
    image: "https://images.unsplash.com/photo-1592890678914-71086c6799c2?auto=format&fit=crop&q=80&w=800",
    description: "Premium aerospace-grade carbon fiber protection.",
    featured: true,
    stock: 50
  },
  {
    id: "mock-2",
    name: "TITAN LINK",
    category: "Accessories",
    price: 2499,
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800",
    description: "Military-grade titanium cable system.",
    featured: true,
    stock: 120
  },
  {
    id: "mock-3",
    name: "NEON SHIELD",
    category: "Cases",
    price: 3999,
    image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&q=80&w=800",
    description: "Impact-resistant polycarbonate with UV protection.",
    featured: false,
    stock: 30
  },
  {
    id: "mock-4",
    name: "VOID GLASS",
    category: "Protection",
    price: 1499,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
    description: "9H sapphire coated screen protection.",
    featured: true,
    stock: 200
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryQuery = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "price";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    // FALLBACK LOGIC: If DB is not available or auth fails, use Mock Data
    if (!adminDb) {
      console.warn("Firebase Admin DB not initialized. Using MOCK_PRODUCTS fallback.");
      let filtered = [...MOCK_PRODUCTS];
      if (categoryQuery && categoryQuery !== "All") {
        filtered = filtered.filter(p => p.category === categoryQuery);
      }
      return NextResponse.json(filtered);
    }

    try {
      const productsRef = adminDb.collection("products");
      let query: FirebaseFirestore.Query = productsRef;

      if (categoryQuery && categoryQuery !== "All") {
        query = query.where("category", "==", categoryQuery);
      }

      query = query.orderBy(sortBy, order as "asc" | "desc");

      const snapshot = await query.get();
      
      // If collection is empty, return mock data for better first-time experience
      if (snapshot.empty) {
        return NextResponse.json(MOCK_PRODUCTS);
      }

      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json(products);
    } catch (innerError: any) {
       console.error("Firestore specific error:", innerError.message);
       // Fallback to mock data on DB errors (like auth issues)
       return NextResponse.json(MOCK_PRODUCTS);
    }
  } catch (error: any) {
    console.error("CRITICAL Products GET Error:", error);
    return NextResponse.json(MOCK_PRODUCTS); // Absolute fallback
  }
}

export async function POST(req: NextRequest) {
  // POST still requires real auth and DB
  return NextResponse.json({ error: "Operation not permitted in simulation mode." }, { status: 403 });
}
