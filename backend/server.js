const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (Standalone)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log("🔥 Firebase Admin Linked to Station Hub");
  } catch (e) {
    console.error("Firebase Admin Error:", e.message);
  }
}
const db = admin.firestore();

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- CORE ROUTES ---
app.get('/health', (req, res) => {
  res.json({ status: "Navior Station Online", timestamp: new Date() });
});

// --- USER SYNCHRONIZATION ---
app.post('/api/user/sync', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      email,
      displayName,
      photoURL,
      lastSeen: admin.firestore.FieldValue.serverTimestamp(),
      role: "member"
    }, { merge: true });
    res.json({ message: "User synced to station", status: "active" });
  } catch (error) {
    res.json({ message: "User sync simulated", status: "simulated" });
  }
});

// --- RAZORPAY ORDER CREATION ---
app.post('/api/razorpay', async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to broadcast order to Razorpay" });
  }
});

// --- PAYMENT VERIFICATION & LOGISTICS SYNC ---
app.post('/api/razorpay/verify', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      shippingData,
      userId,
      items,
      total
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      try {
        const orderDoc = {
          userId,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          items,
          total,
          shippingData,
          status: "deployed",
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
        await db.collection("orders").add(orderDoc);

        // Decrement Inventory
        const batch = db.batch();
        for (const item of items) {
           const productRef = db.collection('products').doc(item.id);
           batch.update(productRef, {
              stock: admin.firestore.FieldValue.increment(-item.quantity)
           });
        }
        await batch.commit();
        console.log(`📉 [INVENTORY]: Stock decanted for items in ${razorpay_order_id}`);
      } catch (dbErr) {
        console.warn("⚠️ [STATION_ERROR]: DB write restricted.");
      }
      res.json({ message: "Payment verified successfully", protocol: "Secure" });
    } else {
      res.status(400).json({ error: "Transmission Signature Tampered" });
    }
  } catch (error) {
    res.status(500).json({ error: "System Sync Failure" });
  }
});

// --- STATION HUB: PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
     const snapshot = await db.collection("products").get();
     const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     res.json(products);
  } catch (err) {
     res.status(500).json({ error: "Product Manifest Failure" });
  }
});

// --- STATION HUB: SEEDING ---
app.post('/api/products/seed', async (req, res) => {
  try {
     const rawData = fs.readFileSync(path.join(__dirname, 'products.json'));
     const products = JSON.parse(rawData.toString());
     const batch = db.batch();

     const snapshot = await db.collection("products").get();
     snapshot.docs.forEach(doc => batch.delete(doc.ref));

     products.forEach(p => {
        const ref = db.collection("products").doc(p.id);
        batch.set(ref, { 
           ...p, 
           updatedAt: admin.firestore.FieldValue.serverTimestamp() 
        });
     });

     await batch.commit();
     res.json({ message: "Manifest Synced", status: "AUTHORIZED" });
  } catch (err) {
     res.status(500).json({ error: "Seeding Node Failed" });
  }
});

// --- STATION HUB: ORDERS ---
app.get('/api/orders', async (req, res) => {
  try {
     const snapshot = await db.collection("orders").orderBy('timestamp', 'desc').get();
     const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     res.json(orders);
  } catch (err) {
     res.status(500).json({ error: "Archival Access Refused" });
  }
});

// --- MARKET BEACON (SOCIAL PROOF) ---
app.get('/api/market-activity', async (req, res) => {
  try {
     const snapshot = await db.collection('orders').orderBy('timestamp', 'desc').limit(10).get();
     const activities = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
           name: data.shippingData?.name?.split(' ')[0] || "Operative",
           location: data.shippingData?.city || "Unknown Node",
           product: data.items?.[0]?.name || "Classified Gear",
           time: "Just Now",
           type: "DEPLOYMENT"
        };
     });
     res.json(activities);
  } catch (error) {
     res.status(500).json({ error: "Beacon Offline" });
  }
});

// --- ASSET OVERRIDE (ADMIN) ---
app.post('/api/products/update', async (req, res) => {
  try {
     const { id, price, stock } = req.body;
     const productRef = db.collection('products').doc(id);
     await productRef.update({
        price: Number(price),
        stock: Number(stock),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
     });
     res.json({ message: "Asset Manifest Updated" });
  } catch (error) {
     res.status(500).json({ error: "Refraction Failed" });
  }
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 NAVIOR BACKEND HUB: Port ${PORT}`);
});
