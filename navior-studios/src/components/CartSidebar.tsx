"use client";

import React, { useRef, useEffect } from "react";
import { useCartStore, Product } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const CartSidebar = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, addToCart } = useCartStore();
  const { isCartOpen, setCartOpen } = useUIStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const upsellProducts = [
    { id: "charger-1", name: "Lunar MagSafe", price: 1899, category: "Power", images: [], compatibility: [], description: "" },
    { id: "lens-1", name: "Quantum Lens", price: 999, category: "Accessories", images: [], compatibility: [], description: "" },
  ].filter(p => !cart.find(item => item.id === p.id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, setCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60"
          />
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-white/10 z-70 flex flex-col shadow-2xl"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between relative overflow-hidden">
               {/* Reservation Timer - FOMO DNA */}
               <div className="absolute top-0 left-0 w-full h-1 bg-white/[0.02]">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 600, ease: "linear" }}
                    className="h-full bg-blue-500"
                  />
               </div>
               
              <div className="flex items-center space-x-3">
                <ShoppingBag size={24} strokeWidth={1.5} />
                <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Your Bag</h2>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">10:00 MINS LEFT</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors ml-4"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Free Deployment Progress Hub */}
            {cart.length > 0 && (
              <div className="px-8 pt-8 pb-4 space-y-4">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] italic">
                    <span className={getTotal() >= 999 ? "text-emerald-400" : "text-white/30"}>
                       {getTotal() >= 999 ? "MISSION SUCCESS: FREE DEPLOYMENT UNLOCKED" : `ADD ₹${(999 - getTotal()).toLocaleString()} MORE FOR FREE DEPLOYMENT`}
                    </span>
                    <span className="text-white/10">GOAL: ₹999</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((getTotal() / 999) * 100, 100)}%` }}
                      className={`h-full transition-colors duration-500 ${getTotal() >= 999 ? "bg-emerald-500" : "bg-blue-500"}`}
                    />
                 </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} strokeWidth={1} className="text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold tracking-tight">Your bag is empty</p>
                    <p className="text-sm text-white/40 uppercase tracking-widest font-medium">
                      Start adding some gear to your kit.
                    </p>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex space-x-4 group">
                        <div className="relative w-24 h-24 glass rounded-xl border border-white/10 overflow-hidden shrink-0">
                          {item.images[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/20">
                              {item.name.substring(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-bold tracking-tight text-sm uppercase">
                                {item.name}
                              </h3>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-white/20 hover:text-white transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-medium mt-1">
                              {item.category}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="font-bold tracking-tighter">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upsell Section */}
                  {upsellProducts.length > 0 && (
                    <div className="space-y-6 pt-12 border-t border-white/5">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Complete Your Kit</h3>
                        <div className="space-y-4">
                            {upsellProducts.map(prod => (
                                <div key={prod.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[8px] font-black text-white/10 uppercase tracking-tighter">
                                            {prod.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">{prod.name}</p>
                                            <p className="text-[10px] font-bold text-white/40">₹{prod.price}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(prod as Product)}
                                        className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-white/10 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-white/40 uppercase tracking-widest font-black">Subtotal</span>
                    <span className="text-4xl font-black tracking-tighter">₹{getTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">
                    Shipping & taxes calculated at checkout
                  </p>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full flex items-center justify-center space-x-3 hover:bg-white/90 transition-all shadow-2xl"
                >
                  <span>Begin Checkout</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
