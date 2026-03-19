"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Globe, 
  Package,
  Activity,
  CreditCard,
  ChevronRight,
  Sparkles,
  Search,
  ArrowUpRight,
  MapPin,
  Briefcase,
  Heart,
  Edit3
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";

const DashboardPage = () => {
  const { user, logout, isSimulation } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: "N/A"
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      // Handle Simulation Mode Data
      if (isSimulation) {
          const simOrders = JSON.parse(localStorage.getItem("navior_simulated_orders") || "[]");
          const total = simOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
          setStats({
            totalOrders: simOrders.length + 1, // +1 for the hardcoded one
            totalSpent: total + 12499,
            memberSince: "Simulation Active"
          });
          setRecentOrders(simOrders.slice(0, 3));
          setLoading(false);
          return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setRecentOrders(orders);
        setStats({
          totalOrders: querySnapshot.size,
          totalSpent: orders.reduce((sum, o: any) => sum + (o.total || 0), 0),
          memberSince: user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"
        });
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isSimulation]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
        <Navbar />

        <div className="pt-32 pb-40 px-6 container mx-auto max-w-[1400px]">
          
          {/* Header Section */}
          <header className="mb-20 space-y-12">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="space-y-6">
                   <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/20 italic">Command Center Accessible</span>
                   </div>
                   <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] underline decoration-white/5 underline-offset-[20px]">
                      Hello, <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white/10 italic">Member.</span>
                   </h1>
                </div>

                <div className="flex items-center gap-6">
                   <div className="text-right hidden md:block">
                      <p className="text-[9px] uppercase tracking-[0.5em] font-black text-white/20 italic">Access Level</p>
                      <p className="text-2xl font-black italic uppercase tracking-tighter">Elite Tier // 01</p>
                   </div>
                   <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center group hover:bg-white transition-all cursor-pointer">
                      <User size={32} className="text-white/20 group-hover:text-black transition-colors" />
                   </div>
                </div>
             </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             
             {/* Left Column: Stats & Profile */}
             <div className="lg:col-span-4 space-y-12">
                {/* Profile Card */}
                <div className="p-10 rounded-[50px] bg-white text-black space-y-10 relative overflow-hidden group">
                   <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                         <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
                            <Zap size={32} className="text-white" />
                         </div>
                         <div className="bg-black/5 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic border border-black/5">
                            Verified Station
                         </div>
                      </div>
                      
                      <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <h2 className="text-4xl font-black italic tracking-tighter truncate uppercase">{user?.displayName || "Elite User"}</h2>
                            <Edit3 size={14} className="opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
                         </div>
                         <p className="text-[10px] uppercase tracking-widest font-black text-black/40 italic">{user?.email}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-black/5">
                         <div>
                            <p className="text-[8px] uppercase tracking-widest font-black text-black/30">Missions</p>
                            <p className="text-2xl font-black italic tracking-tighter">{stats.totalOrders} Units</p>
                         </div>
                         <div>
                            <p className="text-[8px] uppercase tracking-widest font-black text-black/30">Sync Date</p>
                            <p className="text-2xl font-black italic tracking-tighter">2026.03</p>
                         </div>
                      </div>
                   </div>
                   
                   {/* Abstract Detail */}
                   <div className="absolute top-0 right-0 p-12 text-black/[0.03] font-black text-9xl italic tracking-tighter pointer-events-none select-none">
                      NAV
                   </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-6">
                   <Link href="/order-history" className="p-8 rounded-[40px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all space-y-6 group">
                      <Package size={24} className="text-white/20 group-hover:text-white transition-colors" />
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black italic">Asset History</p>
                   </Link>
                   <Link href="/wishlist" className="p-8 rounded-[40px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all space-y-6 group">
                      <Heart size={24} className="text-white/20 group-hover:text-white transition-colors" />
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black italic">Saved Gear</p>
                   </Link>
                </div>

                {/* Logistics Coordinates (Address Book) - Amazon Tier Integration */}
                <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <MapPin size={18} className="text-blue-500" />
                          <h3 className="text-[10px] uppercase tracking-[0.6em] font-black italic">Logistics Hub</h3>
                       </div>
                       <button className="text-[8px] font-black uppercase text-white/20 hover:text-white transition-colors italic underline underline-offset-4 decoration-white/10">Add Coordinate</button>
                    </div>
                    
                    <div className="space-y-4">
                       {[
                          { type: "PRIMARY_LAB", addr: "Sector 7, Lab District, Suite 402", city: "Neo Delhi, IN", primary: true },
                          { type: "STORAGE_V_01", addr: "Warehouse 88, Port Sector", city: "Mumbai ARC, IN", primary: false }
                       ].map((addr, i) => (
                          <div key={i} className={`p-8 rounded-[40px] bg-white/[0.02] border transition-all cursor-pointer group flex flex-col items-start ${addr.primary ? 'border-white/20 bg-white/[0.04]' : 'border-white/5 hover:border-white/10'}`}>
                             <div className="flex justify-between w-full">
                                <span className={`text-[8px] font-black tracking-[0.3em] uppercase italic ${addr.primary ? 'text-blue-400' : 'text-white/20'}`}>
                                   {addr.type} {addr.primary && "// DEFAULT"}
                                </span>
                                <Settings size={10} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                             </div>
                             <p className="text-[11px] font-black uppercase tracking-tight mt-4 italic group-hover:text-white transition-colors">{addr.addr}</p>
                             <p className="text-[9px] font-medium text-white/40 uppercase tracking-widest mt-1">{addr.city}</p>
                          </div>
                       ))}
                    </div>
                </div>

                <button 
                   onClick={handleLogout}
                   className="w-full p-8 rounded-[40px] bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-all flex items-center justify-center space-x-6 group text-rose-500"
                >
                   <LogOut size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   <p className="text-[10px] uppercase tracking-[1em] font-black italic">Shutdown Session</p>
                </button>
             </div>

             {/* Right Column: Dynamic Feed */}
             <div className="lg:col-span-8 space-y-12">
                
                {/* Technical Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                      { label: "Assets Manifetsed", value: stats.totalOrders, icon: Cpu, unit: "Units" },
                      { label: "Payload Value", value: `₹${stats.totalSpent.toLocaleString('en-IN')}`, icon: CreditCard, unit: "Total" },
                      { label: "Station Connection", value: "99.9%", icon: Activity, unit: "Secure" }
                   ].map((item, i) => (
                      <div key={i} className="p-10 rounded-[45px] bg-white/[0.02] border border-white/5 space-y-6 hover:border-white/10 transition-colors">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                            <item.icon size={20} className="text-white/20" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">{item.label}</p>
                            <div className="flex items-end space-x-2">
                               <p className="text-4xl font-black italic tracking-tighter">{item.value}</p>
                               <span className="text-[9px] uppercase tracking-widest font-black text-white/10 pb-2">{item.unit}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Recent Missions Feed */}
                <div className="space-y-8">
                   <div className="flex items-center justify-between px-4">
                      <div className="flex items-center space-x-4">
                         <ShieldCheck size={20} className="text-blue-500" />
                         <h3 className="text-xl font-black uppercase tracking-widest italic">Asset Transmissions</h3>
                      </div>
                      <Link href="/order-history" className="text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-white transition-colors flex items-center space-x-2">
                         <span>Examine Full Archive</span>
                         <ArrowUpRight size={12} />
                      </Link>
                   </div>

                   <div className="space-y-4">
                      {loading ? (
                         Array(2).fill(0).map((_, i) => (
                            <div key={i} className="h-32 bg-white/5 rounded-[40px] animate-pulse" />
                         ))
                      ) : recentOrders.length > 0 ? (
                         recentOrders.map((order, i) => (
                            <div key={i} className="group p-10 rounded-[45px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex items-center justify-between">
                               <div className="flex items-center space-x-8">
                                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center relative overflow-hidden">
                                     <Package size={28} className="text-white/10 relative z-10" />
                                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[9px] uppercase tracking-widest font-black text-white/20">Transmission ID</p>
                                     <p className="text-2xl font-black italic uppercase tracking-tighter">{order.id.slice(-8)}</p>
                                  </div>
                               </div>
                               
                               <div className="flex items-center space-x-12">
                                  <div className="text-right hidden sm:block">
                                     <p className="text-[9px] uppercase tracking-widest font-black text-white/20">Sync Status</p>
                                     <p className="text-sm font-black italic uppercase tracking-widest text-emerald-400">Deployed</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[9px] uppercase tracking-widest font-black text-white/20">Value</p>
                                     <p className="text-3xl font-black italic tracking-tighter">₹{order.total?.toLocaleString('en-IN')}</p>
                                  </div>
                                  <ChevronRight size={24} className="text-white/5 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                               </div>
                            </div>
                         ))
                      ) : (
                         <div className="py-32 text-center bg-white/[0.01] rounded-[60px] border border-dashed border-white/5 space-y-6">
                            <Sparkles size={32} className="mx-auto text-white/5" />
                            <p className="text-[10px] uppercase tracking-widest font-black text-white/20 italic">No historical data manifested yet.</p>
                            <Link href="/collection" className="inline-block px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-neutral-200 transition-all">
                               Start First Mission
                            </Link>
                         </div>
                      )}
                   </div>
                </div>

                {/* Quick Access Hub (The 'Flipkart' Advantage) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 rounded-[50px] bg-gradient-to-br from-white/5 to-transparent border border-white/5 space-y-8 group hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start">
                           <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                              <ShieldCheck size={28} className="text-blue-500" />
                           </div>
                           <ArrowUpRight size={20} className="text-white/10 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                        <div className="space-y-3">
                           <h4 className="text-3xl font-black italic uppercase tracking-tighter">Support Terminal</h4>
                           <p className="text-[10px] font-medium text-white/40 leading-relaxed italic uppercase tracking-widest">Connect with Navior Architects for gear alignment and asset protection queries.</p>
                        </div>
                    </div>

                    <div className="p-10 rounded-[50px] bg-gradient-to-br from-white/5 to-transparent border border-white/5 space-y-8 group hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start">
                           <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                              <Search size={28} className="text-white/20" />
                           </div>
                           <ArrowUpRight size={20} className="text-white/10 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                        <div className="space-y-3">
                           <h4 className="text-3xl font-black italic uppercase tracking-tighter">Examine Lab</h4>
                           <p className="text-[10px] font-medium text-white/40 leading-relaxed italic uppercase tracking-widest">Browse the latest Series 10 asset variants and experimental prototypes.</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        <footer className="p-20 text-center border-t border-white/5">
          <p className="text-[9px] uppercase tracking-[1.5em] font-black text-white/10 italic">
            Navior Studios | Station User Management Unit
          </p>
        </footer>
      </main>
    </ProtectedRoute>
  );
};

export default DashboardPage;
