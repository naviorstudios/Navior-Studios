import { initializeApp as initializeAdminApp, getApps as getAdminApps, cert } from "firebase-admin/app";
import { getFirestore as getAdminFirestore, Firestore } from "firebase-admin/firestore";

import { getAuth as getAdminAuth, Auth } from "firebase-admin/auth";

let adminApp;
let adminDb: Firestore | undefined;
let adminAuth: Auth;

if (typeof window === 'undefined') { // Only initialize on server
  try {
    adminApp = getAdminApps().length > 0
      ? getAdminApps()[0]
      : initializeAdminApp({
          credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
    adminDb = getAdminFirestore(adminApp);
    adminAuth = getAdminAuth(adminApp);
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export { adminDb, adminAuth };