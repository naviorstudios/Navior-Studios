"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { 
  Package, 
  ChevronRight, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowLeft,
  Zap,
  Cpu,
  ShieldCheck,
  Search,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: any;
  shippingData?: any;
}

const OrderHistoryPage = () => {
  const { user, isSimulation } = useAuth();
  const { error: toastError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // MOCK ORDERS FOR SIMULATION MODE
  const mockOrders: Order[] = [
    {
      id: "NAV-882-SYNC",
      total: 12499,
      paymentStatus: "verified",
      orderStatus: "deployed",
      createdAt: new Date().toISOString(),
      items: [
        { id: "1", name: "Titan Shield Pro", price: 2499, quantity: 2, images: [] },
        { id: "2", name: "Aero Carbon Case", price: 3499, quantity: 1, images: [] }
      ],
      shippingData: { name: "Elite Member", address: "Sector 7, Lab District", city: "Neo Delhi" }
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      if (isSimulation) {
          setTimeout(() => {
              const savedSims = JSON.parse(localStorage.getItem("navior_simulated_orders") || "[]");
              setOrders([...savedSims, ...mockOrders]);
              setLoading(false);
          }, 1000);
          return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isSimulation]);

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'deployed' || s === 'delivered' || s === 'completed' || s === 'verified') 
        return { icon: ShieldCheck, color: "text-emerald-400", label: "Deployed", bg: "bg-emerald-500/10" };
    if (s === 'shipped' || s === 'transit') 
        return { icon: Truck, color: "text-blue-400", label: "In Transit", bg: "bg-blue-500/10" };
    if (s === 'synchronizing' || s === 'processing' || s === 'pending') 
        return { icon: Clock, color: "text-amber-400", label: "Syncing", bg: "bg-amber-500/10" };
    return { icon: Package, color: "text-white/40", label: "Archive", bg: "bg-white/5" };
  };

  const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return "N/A";
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
        <Navbar />

        <div className="pt-32 pb-40 px-6 container mx-auto max-w-[1400px]">
          <header className="mb-20 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                     <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/20 italic">Member Assets</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                  <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic underline decoration-white/5 underline-offset-[20px]">
                     Asset.<br/>History.
                  </h1>
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
             
             {/* Main Orders List */}
             <div className="lg:col-span-8 space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-40 bg-white/[0.02] rounded-[40px] border border-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order, idx) => {
                       const config = getStatusConfig(order.orderStatus || order.paymentStatus);
                       return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => setSelectedOrder(order)}
                          className={`group p-10 rounded-[45px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer relative overflow-hidden ${selectedOrder?.id === order.id ? 'ring-2 ring-white/20 bg-white/[0.06]' : ''}`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                             <div className="flex items-center space-x-10">
                                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center relative overflow-hidden">
                                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                   {order.items[0]?.images?.[0] ? (
                                      <img src={order.items[0].images[0]} alt="Gear" className="w-full h-full object-cover" />
                                   ) : (
                                       <Zap size={32} className="text-white/10 group-hover:text-white/40 transition-colors" />
                                   )}
                                </div>
                                <div className="space-y-3">
                                   <div className="flex items-center space-x-4">
                                      <p className="text-2xl font-black italic tracking-tighter uppercase">{order.id.slice(-8)}</p>
                                      <div className={`${config.bg} ${config.color} px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] italic flex items-center space-x-2`}>
                                         <config.icon size={10} />
                                         <span>{config.label}</span>
                                      </div>
                                   </div>
                                   <div className="flex items-center space-x-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/20 italic">
                                      <span>{formatDate(order.createdAt)}</span>
                                      <div className="w-1 h-1 rounded-full bg-white/5" />
                                      <span>{order.items.length} Units Payload</span>
                                   </div>
                                </div>
                             </div>

                             <div className="flex items-center space-x-12">
                                <div className="text-right">
                                   <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic mb-1">Payload Value</p>
                                   <p className="text-4xl font-black italic tracking-tighter">₹{order.total.toLocaleString('en-IN')}</p>
                                </div>
                                <ChevronRight className="text-white/5 group-hover:text-white transition-colors group-hover:translate-x-2" size={24} />
                             </div>
                          </div>
                        </motion.div>
                       );
                    })}
                  </div>
                ) : (
                  <div className="py-40 text-center space-y-10 bg-white/[0.01] rounded-[60px] border border-dashed border-white/5">
                    <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/5 ring-inset">
                      <ShoppingBag size={48} className="text-white/10" strokeWidth={1} />
                    </div>
                    <div className="space-y-4">
                      <p className="text-4xl font-black italic tracking-tighter uppercase">No Transmissions Found</p>
                      <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 italic max-w-xs mx-auto">
                        Your orbital deployment history will manifest here upon initial acquisition.
                      </p>
                    </div>
                    <button 
                       onClick={() => window.location.href = '/collection'}
                       className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-neutral-200 transition-all"
                    >
                       Initialize Collection
                    </button>
                  </div>
                )}
             </div>

             {/* Dynamic Sidebar: Asset Details */}
             <div className="lg:col-span-4">
                <AnimatePresence mode="wait">
                   {selectedOrder ? (
                      <motion.div
                        key={selectedOrder.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-12 rounded-[50px] bg-white/5 border border-white/5 sticky top-32 space-y-12"
                      >
                         <div className="flex items-center justify-between border-b border-white/5 pb-10">
                            <div>
                               <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">Transmission Signature</p>
                               <h3 className="text-2xl font-black tracking-tighter italic uppercase">{selectedOrder.id}</h3>
                            </div>
                         </div>

                         <div className="space-y-10">
                            <h4 className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">Manifest Info</h4>
                            <div className="space-y-6">
                               {selectedOrder.items.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center group">
                                     <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all overflow-hidden">
                                           {item.images?.[0] ? (
                                              <img src={item.images[0]} alt="Unit" className="w-full h-full object-cover" />
                                           ) : (
                                              <Package size={20} className="text-white/20 group-hover:text-white transition-colors" />
                                           )}
                                        </div>
                                        <div className="space-y-1">
                                           <p className="text-sm font-black uppercase tracking-tight italic">{item.name}</p>
                                           <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-black italic">Qty: {item.quantity}</p>
                                        </div>
                                     </div>
                                     <span className="text-lg font-black italic tracking-tighter">₹{item.price.toLocaleString('en-IN')}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="pt-10 border-t border-white/5 space-y-12">
                            <div className="space-y-6">
                               <h4 className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">Tracking Timeline</h4>
                               <div className="space-y-6 relative ml-1">
                                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                                  {[
                                     { label: "Deployment Initiated", date: formatDate(selectedOrder.createdAt), active: true },
                                     { label: "Station Processing", date: "Verified", active: true },
                                     { label: "Orbital Transit", date: "Scheduled", active: false },
                                     { label: "Final Manifest", date: "Pending", active: false }
                                  ].map((step, i) => (
                                     <div key={i} className="flex items-start space-x-6 relative z-10">
                                        <div className={`w-4 h-4 rounded-full border-2 ${step.active ? 'bg-blue-500 border-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-black border-white/20'}`} />
                                        <div className="space-y-1">
                                           <p className={`text-[10px] uppercase font-black tracking-widest ${step.active ? 'text-white' : 'text-white/20'}`}>{step.label}</p>
                                           <p className="text-[8px] uppercase tracking-widest text-white/20 italic">{step.date}</p>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>

                            <div className="space-y-4">
                               <h4 className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">Logistics Station</h4>
                               <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-4">
                                  <div className="flex items-center space-x-3 text-blue-500">
                                     <Truck size={14} />
                                     <p className="text-[10px] font-black uppercase italic tracking-widest">{selectedOrder.shippingData?.name || "Member UNK"}</p>
                                  </div>
                                  <p className="text-[10px] font-medium uppercase italic text-white/40 tracking-tight leading-relaxed">
                                     {selectedOrder.shippingData?.address}, {selectedOrder.shippingData?.city}
                                  </p>
                               </div>
                            </div>
                            
                            <div className="p-10 rounded-[40px] bg-white flex flex-col items-center space-y-2">
                               <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black italic">Final Payload Sync</p>
                               <p className="text-5xl font-black text-black tracking-tighter italic">₹{selectedOrder.total.toLocaleString('en-IN')}</p>
                            </div>
                         </div>
                      </motion.div>
                   ) : (
                      <div className="p-12 rounded-[50px] border border-white/5 bg-white/[0.01] sticky top-32 flex flex-col items-center justify-center space-y-6 text-center h-[600px]">
                         <Cpu size={48} className="text-white/5 animate-pulse" />
                         <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/10 italic">Select a transmission signature to view manifests.</p>
                      </div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </div>

        <footer className="p-20 text-center border-t border-white/5">
          <p className="text-[9px] uppercase tracking-[1em] font-black text-white/10 italic">
            Navior Studios Logistics Center | Terminal 01
          </p>
        </footer>
      </main>
    </ProtectedRoute>
  );
};

export default OrderHistoryPage;