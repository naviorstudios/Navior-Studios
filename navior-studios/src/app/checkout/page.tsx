"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useFormValidation, commonValidationRules } from "@/hooks/useFormValidation";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  ChevronRight, 
  Package, 
  MapPin, 
  Lock,
  Cpu,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CheckoutPage = () => {
  const { cart, getTotal, clearCart } = useCartStore();
  const { user, isSimulation } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const shippingValidation = useFormValidation({
    name: commonValidationRules.name,
    email: commonValidationRules.email,
    phone: commonValidationRules.phone,
    address: commonValidationRules.address,
    city: commonValidationRules.city,
    state: commonValidationRules.state,
    zip: commonValidationRules.zipCode
  });

  const [shippingData, setShippingData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        name: prev.name || user.displayName || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cart.length === 0 && paymentStep !== 3) {
      router.push("/collection");
    }
  }, [cart, router, paymentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize data before validation (strip spaces/dashes from phone/zip)
    const sanitizedData = {
      ...shippingData,
      phone: shippingData.phone.replace(/[\s\-\(\)]/g, ''),
      zip: shippingData.zip.replace(/[\s\-]/g, '')
    };

    const isValid = shippingValidation.validateForm(sanitizedData);
    if (!isValid) {
      // Find the first specific error message
      const firstErrorField = Object.keys(shippingValidation.errors)[0];
      const errorMessage = shippingValidation.errors[firstErrorField] || "Check your logistical coordinates.";
      showError("Field Error", errorMessage);
      return;
    }
    setPaymentStep(2);
  };

  const handleApplyPromo = () => {
     if (promoCode.toUpperCase() === "NAVIOR_AI") {
        setDiscount(500);
        showSuccess("Mission Authorized", "Archival reward of ₹500 has been synchronized.");
     } else {
        showError("Invalid Code", "This mission code is not in the archive manifest.");
     }
  };

  const handlePayment = async () => {
    setLoading(true);

    // SIMULATION MODE BYPASS
    if (isSimulation) {
      setTimeout(() => {
        // Log to simulated history
        const simOrder = {
          id: `SIM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          userId: user?.uid || "SIM_GUEST",
          items: cart,
          total: getTotal() - discount,
          shippingData,
          paymentStatus: "verified",
          orderStatus: "deployed",
          createdAt: new Date().toISOString()
        };
        const prevSims = JSON.parse(localStorage.getItem("navior_simulated_orders") || "[]");
        localStorage.setItem("navior_simulated_orders", JSON.stringify([simOrder, ...prevSims]));

        showSuccess("Simulation Verified", "Payment processed via Lab Simulation Protocol.");
        clearCart();
        setPaymentStep(3);
        setLoading(false);
      }, 2000);
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      showError("Payment Error", "Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      const { data: orderData } = await api.post("/api/razorpay", {
        amount: getTotal(),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NAVIOR STUDIOS",
        description: "Premium Gear Checkout",
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post("/api/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingData,
              userId: user?.uid || "GUEST",
              items: cart,
              total: (getTotal() - discount) 
            });

            if (verifyRes.data.message === "Payment verified successfully") {
              clearCart();
              setPaymentStep(3);
            } else {
              showError("Payment Verification Failed", "Check your transmission signature.");
            }
          } catch (verificationError) {
             showError("Verification Error", "Sync lost during payment verification.");
          }
        },
        prefill: {
          name: shippingData.name,
          email: shippingData.email,
          contact: shippingData.phone,
        },
        theme: { color: "#000000" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (paymentError) {
      showError("Payment Failed", "Transaction rejected by Gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="pt-32 pb-40 px-6 container mx-auto max-w-[1400px]">
        {/* Step Indicator */}
        <div className="mb-20 flex items-center space-x-4 overflow-x-auto no-scrollbar pb-4">
           {[
             { id: 1, label: "Logistics", icon: MapPin },
             { id: 2, label: "Payment", icon: CreditCard },
             { id: 3, label: "Success", icon: ShieldCheck }
           ].map((step, i) => (
             <React.Fragment key={step.id}>
               <div className={`flex items-center space-x-3 shrink-0 ${paymentStep === step.id ? "text-white" : "text-white/20"}`}>
                 <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-colors ${
                   paymentStep >= step.id ? "bg-white text-black border-white" : "bg-white/5 border-white/5"
                 }`}>
                   <step.icon size={18} />
                 </div>
                 <span className="text-[10px] uppercase tracking-[0.4em] font-black italic">{step.label}</span>
               </div>
               {i < 2 && <div className="w-8 h-px bg-white/5" />}
             </React.Fragment>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
          
          {/* Left: Main Form Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {paymentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-16"
                >
                  <header className="space-y-4">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase underline decoration-white/10 underline-offset-[20px]">
                        Lgs.<br/>Sync.
                    </h1>
                  </header>

                  <form onSubmit={handleShippingSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                       <div className="space-y-3">
                         <label className="text-[9px] uppercase tracking-[0.5em] font-black text-white/30">Member Name</label>
                         <input
                           name="name"
                           value={shippingData.name}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 focus:outline-none focus:border-white/20 transition-all text-xs font-black tracking-widest uppercase italic"
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[9px] uppercase tracking-[0.5em] font-black text-white/30">Contact Frequency</label>
                         <input
                           name="phone"
                           placeholder="+91"
                           value={shippingData.phone}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 focus:outline-none focus:border-white/20 transition-all text-xs font-black tracking-widest uppercase italic"
                         />
                       </div>
                       <div className="space-y-3 md:col-span-2">
                         <label className="text-[9px] uppercase tracking-[0.5em] font-black text-white/30">Station Address</label>
                         <input
                           name="address"
                           value={shippingData.address}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 focus:outline-none focus:border-white/20 transition-all text-xs font-black tracking-widest uppercase italic"
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[9px] uppercase tracking-[0.5em] font-black text-white/30">City</label>
                         <input
                           name="city"
                           value={shippingData.city}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 focus:outline-none focus:border-white/20 transition-all text-xs font-black tracking-widest uppercase italic"
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[9px] uppercase tracking-[0.5em] font-black text-white/30">ZIP Coordinates</label>
                         <input
                           name="zip"
                           value={shippingData.zip}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 focus:outline-none focus:border-white/20 transition-all text-xs font-black tracking-widest uppercase italic"
                         />
                       </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl flex items-center justify-center space-x-6 hover:bg-neutral-200 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)] active:scale-95 group"
                    >
                      <span>Lock Logistics</span>
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              )}

              {paymentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-16"
                >
                  <header className="space-y-4">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase underline decoration-white/10 underline-offset-[20px]">
                        Pymt.<br/>Auth.
                    </h1>
                  </header>

                  <div className="space-y-8">
                     <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-white/5">
                           <Lock size={120} strokeWidth={0.5} />
                        </div>
                        <div className="relative z-10 space-y-6">
                           <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl">
                                 <Zap size={32} className="text-black" />
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-2xl font-black uppercase italic">Razorpay Protocol</h3>
                                 <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 italic">Secure Encrypted Frequency</p>
                              </div>
                           </div>
                           <p className="text-xs text-white/40 max-w-sm leading-relaxed uppercase tracking-tighter font-medium">
                              You will be redirected to the secure portal to finalize the transaction. All transmissions are end-to-end encrypted.
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                           <ShieldCheck size={20} className="text-white/30" />
                           <h4 className="text-[10px] font-black uppercase tracking-widest">Encrypted</h4>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                           <Cpu size={20} className="text-white/30" />
                           <h4 className="text-[10px] font-black uppercase tracking-widest">Validated</h4>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col space-y-6">
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl flex items-center justify-center space-x-6 hover:bg-neutral-200 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{isSimulation ? "Simulate Payment" : "Authenticate & Pay"}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setPaymentStep(1)}
                      className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 hover:text-white transition-colors italic"
                    >
                      Modify Logistics Coordinates
                    </button>
                  </div>
                </motion.div>
              )}

              {paymentStep === 3 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-12"
                >
                  <div className="w-40 h-40 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 ring-1 ring-white/5 ring-inset shadow-2xl">
                    <ShieldCheck size={80} className="text-white animate-pulse" strokeWidth={1} />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic underline decoration-white/10 underline-offset-[20px]">Success.</h2>
                    <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-black max-w-sm mx-auto leading-relaxed italic">
                      Gear synchronization complete. Transmission sent to <span className="text-white">{shippingData.email}</span>. Your units are being prepared for deployment.
                    </p>
                  </div>

                  {/* AI Digital Passport Hub */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-md mx-auto p-10 bg-white/[0.02] border border-white/10 rounded-[40px] relative overflow-hidden group"
                  >
                     <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Cpu size={120} />
                     </div>
                     <div className="relative z-10 space-y-6 text-left">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-3 text-blue-400">
                              <ShieldCheck size={14} />
                              <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Archival Asset Passport</span>
                           </div>
                           <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-[7px] font-black text-emerald-400 italic">SERIALIZED</div>
                        </div>
                        
                        <div className="py-6 border-y border-white/5 space-y-4">
                           <div className="space-y-1">
                              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Neural Access Key</p>
                              <p className="text-2xl font-mono font-black text-white tracking-[0.2em]">NAV-{Math.floor(100 + Math.random() * 899)}-A-SYNC</p>
                           </div>
                           <div className="flex justify-between items-end">
                              <div className="space-y-1">
                                 <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Archival Tier</p>
                                 <p className="text-xs font-black italic uppercase">Series 01 // V.1.0</p>
                              </div>
                              <div className="text-right space-y-1">
                                 <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Logistics Node</p>
                                 <p className="text-xs font-black italic uppercase">{shippingData.city}, IN</p>
                              </div>
                           </div>
                        </div>
                        <p className="text-[7px] font-bold text-white/10 uppercase tracking-[0.3em] leading-relaxed italic">The above key provides neural authentication for all future archival firmware updates for your S_01 unit.</p>
                     </div>
                  </motion.div>

                  <button
                    onClick={() => router.push("/collection")}
                    className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl hover:bg-neutral-200 transition-all shadow-2xl active:scale-95"
                  >
                    Return to Station
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Summary Sidebar */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
             <div className="p-12 rounded-[50px] bg-white/5 border border-white/5 backdrop-blur-3xl space-y-12 relative overflow-hidden">
                {/* Abstract Line Detail */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

                <h3 className="text-[10px] uppercase tracking-[0.8em] font-black text-white/20 italic border-b border-white/5 pb-8">Bag Contents</h3>
                
                <div className="space-y-10">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center group">
                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-24 bg-white/5 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative">
                                    {item.images?.[0] ? (
                                        <img src={item.images[0]} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt={item.name} />
                                    ) : (
                                        <div className="absolute inset-0 bg-white/5" />
                                    )}
                                    <span className="relative z-10 text-[9px] font-black text-white mix-blend-difference italic">x{item.quantity}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black uppercase tracking-tight group-hover:italic transition-all">{item.name}</p>
                                    <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black font-mono">ID: {item.id.split('-')[1] || "ARC"}</p>
                                </div>
                            </div>
                            <span className="text-lg font-black italic tracking-tighter">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-6 pt-12 border-t border-white/5">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                           <input 
                              type="text" 
                              placeholder="MISSION_CODE" 
                              value={promoCode}
                              disabled={discount > 0}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10 italic"
                           />
                           <button 
                             onClick={handleApplyPromo}
                             disabled={discount > 0}
                             className={`px-8 py-4 ${discount > 0 ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'} text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all italic underline decoration-white/20 underline-offset-4`}
                           >
                              {discount > 0 ? "SYNCED" : "Lock In"}
                           </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                       <div className="space-y-1 w-full">
                          <div className="flex justify-between items-center mb-4">
                             <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">Archive Core Total</p>
                             <p className="text-sm font-black italic tracking-tighter">₹{getTotal().toLocaleString('en-IN')}</p>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between items-center mb-8 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                               <p className="text-[9px] uppercase tracking-[0.4em] font-black text-emerald-400 italic">Neural Reward Applied</p>
                               <p className="text-sm font-black italic tracking-tighter text-emerald-400">- ₹{discount.toLocaleString('en-IN')}</p>
                            </div>
                          )}
                          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">Final Station Payload</p>
                          <h4 className="text-6xl font-black tracking-tighter italic text-white">₹{(getTotal() - discount).toLocaleString('en-IN')}</h4>
                       </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                       <Zap size={12} />
                       <span>Standard Air Deployment Included</span>
                    </div>
                </div>
             </div>

             <div className="mt-12 flex justify-center items-center space-x-12 opacity-20 hover:opacity-100 transition-opacity">
                 <div className="flex flex-col items-center space-y-2">
                    <ShieldCheck size={20} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Vaulted</span>
                 </div>
                 <div className="flex flex-col items-center space-y-2">
                    <Package size={20} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Inspected</span>
                 </div>
                 <div className="flex flex-col items-center space-y-2">
                    <Cpu size={20} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Automated</span>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
