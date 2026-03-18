"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";

interface AuthContextType {
  user: User | any | null;
  loading: boolean;
  logout: () => Promise<void>;
  isSimulation: boolean;
  toggleSimulation: () => void;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER = {
  uid: "sim-elite-001",
  email: "elite.member@navior.com",
  displayName: "Elite Member",
  photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Navior",
  emailVerified: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSimulation, setIsSimulation] = useState(false);

  useEffect(() => {
    const savedSim = localStorage.getItem("navior_simulation_mode") === "true";
    if (savedSim) {
      setIsSimulation(true);
      setUser(MOCK_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Sync with our backend
          await axios.post("/api/user/sync", {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
          setUser(firebaseUser);
        } else {
          setUser(null);
        }
      } catch (error: any) {
        console.error("Auth sync error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthError = (error: any) => {
    console.error("Firebase Auth Error:", error);
    if (error.code === "auth/permission-denied" || error.message?.includes("suspended")) {
       throw new Error("API SUSPENDED: Please use 'Lab Simulation Mode' to bypass this restricted session.");
    }
    throw error;
  };

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      handleAuthError(e);
    }
  };

  const signup = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      handleAuthError(e);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      handleAuthError(e);
    }
  };

  const logout = async () => {
    if (isSimulation) {
      setIsSimulation(false);
      localStorage.removeItem("navior_simulation_mode");
      setUser(null);
      return;
    }
    await firebaseSignOut(auth);
  };

  const toggleSimulation = () => {
    const newState = !isSimulation;
    setIsSimulation(newState);
    if (newState) {
      localStorage.setItem("navior_simulation_mode", "true");
      setUser(MOCK_USER);
    } else {
      localStorage.removeItem("navior_simulation_mode");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout, 
      isSimulation, 
      toggleSimulation,
      login,
      signup,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
