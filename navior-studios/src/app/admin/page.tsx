"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { 
  BarChart3, 
  Package, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  ArrowUpRight, 
  Settings,
  Plus,
  Edit2,
  Trash2,
  RefreshCcw,
  ShoppingBag,
  Zap,
  Lock,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

interface AdminOrder {
  name: string;
  location: string;
  product: string;
  time: string;
  type: string;
}

const AdminTerminal = () => {
  const { user } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Asset Override State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Security Verification (Simulation Mode: Always Allow)
  const isAdmin = user?.email === "admin@navior.com" || user?.role === "director" || true;

  useEffect(() => {
    if (!isAdmin) return;
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: prodData } = await axios.get('http://localhost:5000/api/products');
      setProducts(prodData);
      const { data: orderData } = await axios.get('http://localhost:5000/api/market-activity');
      setOrders(orderData);
    } catch (err) {
      showError("Station Comms Failure", "Could not synchronize with the admin hub.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsset = async () => {
    if (!editingProduct) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/products/update', {
        id: editingProduct.id,
        price: editingProduct.price,
        stock: editingProduct.stock
      });
      showSuccess("Asset Refracted", "The manifest has been updated successfully.");
      setIsModalOpen(false);
      fetchAdminData(); // Refresh table
    } catch (err) {
      showError("Refraction Refused", "Station DB rejected the asset override.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
         <div className="space-y-4 max-w-sm">
            <Lock size={60} className="mx-auto text-rose-500/20" />
            <h1 className="text-3xl font-black italic uppercase italic">Access Restricted.</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">Authentication node rejected. Mission Director signature required.</p>
         </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="pt-32 pb-40 px-6 container mx-auto max-w-[1400px]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-white/5 pb-16">
           <div className="space-y-6">
              <div className="flex items-center space-x-3 text-emerald-500">
                 <ShieldAlert size={14} className="animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Station Director Terminal</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase leading-none">
                 Global <br/> <span className="text-white/20">Control.</span>
              </h1>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={fetchAdminData}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                 <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
              </button>
              <div className="bg-white text-black px-8 py-5 rounded-2xl flex items-center space-x-4 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                 <Plus size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest italic">Inject New Asset</span>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
           {[
             { label: "Archival Revenue", value: "₹2,84,391", trend: "+12.4%", icon: TrendingUp, color: "text-emerald-500" },
             { label: "Active Deployments", value: "841 Units", trend: "+5.1%", icon: Package, color: "text-blue-500" },
             { label: "Certified Operatives", value: "3,102", trend: "+0.8%", icon: Users, color: "text-purple-500" },
             { label: "Station Efficiency", value: "99.9%", trend: "Stable", icon: BarChart3, color: "text-white" }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-4 group hover:bg-white/[0.04] transition-all"
             >
                <div className="flex items-center justify-between">
                   <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                      <stat.icon size={24} />
                   </div>
                   <div className="text-[10px] font-black italic text-emerald-400">{stat.trend}</div>
                </div>
                <div>
                   <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic mb-1">{stat.label}</p>
                   <h3 className="text-4xl font-black tracking-tighter italic">{stat.value}</h3>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Console Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
           
           {/* Sidebar Navigation */}
           <div className="lg:col-span-3 space-y-4">
              {[
                { id: "overview", label: "Station Status", icon: BarChart3 },
                { id: "inventory", label: "Asset Manifest", icon: Package },
                { id: "deployments", label: "Live Deployments", icon: Zap },
                { id: "operatives", label: "Operative Ranks", icon: Users },
                { id: "settings", label: "Protocol Settings", icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-6 text-left rounded-3xl flex items-center space-x-4 border transition-all uppercase tracking-widest text-[10px] font-black italic ${
                    activeTab === tab.id 
                      ? "bg-white text-black border-white" 
                      : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"
                  }`}
                >
                   <tab.icon size={16} />
                   <span>{tab.label}</span>
                </button>
              ))}
           </div>

           {/* Main Console Content */}
           <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                 {activeTab === "inventory" && (
                   <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key="inventory"
                    className="space-y-8"
                   >
                       <div className="flex items-center justify-between">
                          <h2 className="text-3xl font-black italic uppercase italic">Asset Manifest.</h2>
                          <div className="flex items-center space-x-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                             <Search size={14} />
                             <input placeholder="SEARCH ARCHIVE..." className="bg-transparent border-none focus:outline-none placeholder:text-white/10" />
                          </div>
                       </div>

                       <div className="rounded-[40px] border border-white/5 bg-white/[0.01] overflow-hidden">
                          <table className="w-full text-left border-collapse">
                             <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                   <th className="p-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Unit</th>
                                   <th className="p-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Archived Stock</th>
                                   <th className="p-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Pricing</th>
                                   <th className="p-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Sync Rate</th>
                                   <th className="p-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Control</th>
                                </tr>
                             </thead>
                             <tbody>
                                {products.map((prod) => (
                                  <tr key={prod.id} className="border-b border-white/5 hover:bg-white/[0.02] group transition-all">
                                     <td className="p-8 flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center relative">
                                           {prod.image && <img src={prod.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />}
                                           <span className="relative z-10 text-[7px] font-black text-white/10 uppercase italic">S01</span>
                                        </div>
                                        <div>
                                           <p className="text-sm font-black uppercase tracking-tight">{prod.name}</p>
                                           <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">ID: {prod.id}</p>
                                        </div>
                                     </td>
                                     <td className="p-8">
                                        <div className="flex flex-col">
                                          <span className={`text-sm font-black italic tracking-tighter ${prod.stock < 10 ? "text-rose-500" : "text-white"}`}>{prod.stock} Units</span>
                                          <div className="w-20 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                             <div className={`h-full bg-blue-500`} style={{ width: `${(prod.stock / 50) * 100}%` }} />
                                          </div>
                                        </div>
                                     </td>
                                     <td className="p-8 text-sm font-black italic tracking-tighter text-white/60">₹{prod.price.toLocaleString('en-IN')}</td>
                                     <td className="p-8">
                                        <div className="flex items-center space-x-4">
                                           <button 
                                              onClick={() => { setEditingProduct(prod); setIsModalOpen(true); }}
                                              className="p-3 bg-white/5 rounded-xl hover:bg-white text-white hover:text-black transition-all"
                                           >
                                              <Edit2 size={14}/>
                                           </button>
                                           <button className="p-3 bg-white/5 rounded-xl hover:bg-rose-500/20 text-white/40 hover:text-rose-500 transition-all"><Trash2 size={14}/></button>
                                        </div>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                   </motion.div>
                 )}

                 {activeTab === "overview" && (
                   <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key="overview"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                   >
                      <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
                         <h3 className="text-xl font-black italic uppercase border-b border-white/5 pb-6">Logistics Stream.</h3>
                         <div className="space-y-6">
                            {orders.length > 0 ? orders.map((order, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                       <ShoppingBag size={18} className="text-white/20" />
                                    </div>
                                    <div>
                                       <p className="text-xs font-black uppercase tracking-tight italic">{order.name} <span className="text-white/20">deployed</span> {order.product}</p>
                                       <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">{order.location}</p>
                                    </div>
                                 </div>
                                 <div className="text-[7px] font-black text-emerald-400 uppercase tracking-widest italic">{order.type}</div>
                              </div>
                            )) : (
                              <div className="text-center py-20 opacity-20 uppercase tracking-[0.4em] italic text-[10px]">No Deployments Captured.</div>
                            )}
                         </div>
                      </div>

                      <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
                         <h3 className="text-xl font-black italic uppercase border-b border-white/5 pb-6">Station Health.</h3>
                         <div className="space-y-8">
                            {[
                              { label: "Memory Archive", level: 84 },
                              { label: "Neural Load", level: 12 },
                              { label: "User Concurrency", level: 64 },
                              { label: "DB Transmission", level: 92 }
                            ].map((stat, i) => (
                              <div key={i} className="space-y-3">
                                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                    <span className="text-white/20 italic">{stat.label}</span>
                                    <span className="text-white">{stat.level}%</span>
                                 </div>
                                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                     <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${stat.level}%` }}
                                      className="h-full bg-white/20 rounded-full"
                                     />
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Asset Override Modal */}
      <AnimatePresence>
         {isModalOpen && editingProduct && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[50px] p-12 space-y-8 text-center relative overflow-hidden"
               >
                  <p className="text-[10px] uppercase tracking-[0.5em] font-black text-blue-500 italic">High Clearance Overide</p>
                  <h2 className="text-5xl font-black tracking-tighter italic uppercase underline decoration-white/5 underline-offset-[10px]">Asset Refractor.</h2>
                  
                  <div className="space-y-8 text-left py-8">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/20 px-2 italic">Unit Signature</label>
                        <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 text-lg font-black italic">{editingProduct.name}</div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className="text-[9px] font-black uppercase tracking-widest text-white/20 px-2 italic">Override Price (₹)</label>
                           <input 
                              type="number"
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                              className="w-full p-6 bg-white/[0.03] rounded-3xl border border-white/5 text-xl font-black focus:border-white/20 transition-all outline-none"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[9px] font-black uppercase tracking-widest text-white/20 px-2 italic">Stock Manifest</label>
                           <input 
                              type="number"
                              value={editingProduct.stock}
                              onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                              className="w-full p-6 bg-white/[0.03] rounded-3xl border border-white/5 text-xl font-black focus:border-white/20 transition-all outline-none"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <button
                        onClick={handleSaveAsset}
                        className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-[30px] hover:bg-emerald-500 hover:text-white transition-all transform active:scale-95 shadow-2xl italic group flex items-center justify-center space-x-3"
                     >
                        <RefreshCcw size={16} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"} />
                        <span>Commit Override</span>
                     </button>
                     <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-[9px] font-black uppercase tracking-widest text-white/10 hover:text-white/40 transition-all"
                     >
                        Abort Protocol
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </main>
  );
};

export default AdminTerminal;
