"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useFormValidation, commonValidationRules } from "@/hooks/useFormValidation";
import { useRouter } from "next/navigation";
import axios from "axios";
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
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

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
    const isValid = shippingValidation.validateForm(shippingData);
    if (!isValid) {
      showError("Field Error", "Check your shipping coordinates.");
      return;
    }
    setPaymentStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);

    // SIMULATION MODE BYPASS
    if (isSimulation) {
      setTimeout(() => {
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
      const { data: orderData } = await axios.post("/api/razorpay", {
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
            const verifyRes = await axios.post("/api/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingData,
              items: cart,
              total: getTotal()
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
                                    <img src={item.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt={item.name} />
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
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">Total Station Payload</p>
                          <h4 className="text-6xl font-black tracking-tighter italic">₹{getTotal().toLocaleString('en-IN')}</h4>
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
