const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
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

// Routes
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
    console.warn("User sync DB restricted (Simulation Mode Active)");
    res.json({ message: "User synced (Simulated)", status: "simulated" });
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
        await db.collection("orders").add({
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          items,
          total,
          shippingData,
          status: "deployed",
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (dbErr) {
        console.warn("DB Storage Refused (API Suspension Detected)");
      }
      res.json({ message: "Payment verified successfully", protocol: "Secure" });
    } else {
      res.status(400).json({ error: "Transmission Signature Tampered" });
    }
  } catch (error) {
    res.status(500).json({ error: "System Sync Failure" });
  }
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 NAVIOR BACKEND HUB: ONLINE on Port ${PORT}`);
    console.log(`🛰️ Mission Control Status: Active`);
});
