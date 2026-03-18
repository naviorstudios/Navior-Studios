"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { Mail, Lock, User, Chrome, ArrowRight, Sparkles, Phone, ShieldCheck, Globe, Cpu, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToast();
  const { isSimulation, toggleSimulation, user, login, signup, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        showSuccess("Identity Verified", "Welcome to the Lab.");
      } else {
        await signup(email, password);
        showSuccess("Protocol Initialized", "Member ID created successfully.");
      }
      router.push("/");
    } catch (err: any) {
      showError("Access Denied", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      showSuccess("Google Verified", "Access granted.");
      router.push("/");
    } catch (err: any) {
      showError("Auth Failure", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      {/* Futuristic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center pt-24 px-6 md:px-12 gap-12 lg:gap-24 relative z-10 w-full max-w-[1400px] mx-auto">
        
        {/* Left Side: Storytelling */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 hidden lg:flex flex-col space-y-12"
        >
          <div className="space-y-4">
             <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.6em] font-black text-white/30">
               <span className="w-8 h-px bg-white/20" />
               <span>Identity System v2.1</span>
             </div>
             <h2 className="text-8xl font-black tracking-tighter leading-none italic">
               THE LAB <br/> IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/10 uppercase">Open.</span>
             </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 max-w-md">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-white/40">
                <Globe size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Sync</span>
              </div>
              <p className="text-xs text-white/20 leading-relaxed font-medium italic">Synchronize your engineered gear across all orbital stations.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-white/40">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Link</span>
              </div>
              <p className="text-xs text-white/20 leading-relaxed font-medium italic">End-to-end encrypted protocol for high-value membership assets.</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-md lg:w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 md:p-14 rounded-[50px] bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden group"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-12">
              <header className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                    {isLogin ? "Access." : "Initiate."}
                </h1>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] italic">
                   System Protocol Authorization
                </p>
              </header>

              <div className="space-y-10">
                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative"
                      >
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input
                          type="text"
                          placeholder="MEMBER-NAME"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 pl-14 pr-8 focus:outline-none focus:border-white/20 transition-all text-[10px] font-black tracking-[0.2em] uppercase italic"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input
                      type="email"
                      placeholder="LAB-ID@NAVIOR.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 pl-14 pr-8 focus:outline-none focus:border-white/20 transition-all text-[10px] font-black tracking-[0.2em] uppercase italic"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input
                      type="password"
                      placeholder="ENCRYPTION-KEY"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 pl-14 pr-8 focus:outline-none focus:border-white/20 transition-all text-[10px] font-black tracking-[0.2em] uppercase italic"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl flex items-center justify-center space-x-6 hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_20px_60px_rgba(255,255,255,0.1)] group/btn"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isLogin ? "Authenticate" : "Create Identity"}</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* External Sync */}
                <div className="space-y-8">
                  <div className="flex items-center space-x-8">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[9px] uppercase tracking-[0.6em] font-black text-white/10 italic">External</span>
                      <div className="flex-1 h-px bg-white/5" />
                  </div>

                  <button
                      onClick={handleGoogleSignIn}
                      className="w-full py-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center space-x-4 hover:bg-white/10 transition-all group/google active:scale-95"
                  >
                      <Chrome size={18} className="text-white/20 group-hover:text-white transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Sign in with Portal</span>
                  </button>
                </div>
              </div>

              {/* Lab Fallback Area */}
              <footer className="pt-10 border-t border-white/5 space-y-6">
                <div className="flex justify-center">
                   <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 hover:text-white transition-colors italic"
                   >
                     {isLogin ? "Join the Collective Archive" : "Return to Access Portal"}
                   </button>
                </div>

                <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-4">
                   <div className="flex items-center space-x-3 text-red-500/60">
                      <AlertTriangle size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest italic">Dev Alert: API Suspension</span>
                   </div>
                   <p className="text-[9px] text-white/20 leading-relaxed italic uppercase font-medium">
                      If your session is restricted by Google APIs, bypass the protocol below to enter the simulation lab.
                   </p>
                   <button
                    onClick={toggleSimulation}
                    className="w-full py-5 bg-white text-black rounded-2xl flex items-center justify-center space-x-4 hover:bg-neutral-200 transition-all group/sim shadow-xl"
                   >
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-[0.5em] italic">Enter Simulation Lab</span>
                   </button>
                </div>
              </footer>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
