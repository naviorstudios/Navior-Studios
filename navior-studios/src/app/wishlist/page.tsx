"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useWishlist } from "@/context/WishlistContext";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, X, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCartStore();

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pb-32">
      <Navbar />

      <section className="pt-40 pb-20 px-6 container mx-auto max-w-[1400px]">
        <div className="space-y-6 mb-20">
            <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.6em] font-black text-white/20">
              <span className="w-8 h-px bg-white/10" />
              <span>Personal Portal</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase underline decoration-white/5 underline-offset-[20px]">
              Saved <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500/80 to-red-900/40">G.E.A.R.</span>
            </h1>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Card Container */}
                  <div className="relative aspect-[4/5] bg-white/5 border border-white/5 rounded-[40px] overflow-hidden group-hover:border-white/20 transition-all">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-white/5 to-transparent flex items-center justify-center">
                           <Zap size={64} className="text-white/5" />
                        </div>
                      )}
                    </div>

                    {/* Meta Controls */}
                    <div className="absolute top-8 right-8 flex flex-col space-y-4">
                       <button 
                         onClick={() => removeFromWishlist(product.id)}
                         className="w-12 h-12 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group/btn"
                       >
                         <X size={18} className="translate-y-0.5" />
                       </button>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent pt-32">
                       <div className="flex justify-between items-end gap-6">
                          <div className="space-y-4">
                             <div className="space-y-1">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{product.name}</h3>
                                <p className="text-[10px] uppercase tracking-widest font-black text-white/40">{product.category}</p>
                             </div>
                             <p className="text-3xl font-black italic tracking-tighter">₹{product.price.toLocaleString('en-IN')}</p>
                          </div>
                          
                          <button 
                            onClick={() => handleMoveToCart(product)}
                            className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl group/move"
                          >
                             <ShoppingBag size={20} className="group-hover/move:-translate-y-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 text-center space-y-10 bg-white/[0.01] rounded-[60px] border border-dashed border-white/5">
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/5">
              <Heart size={48} className="text-white/10 animate-pulse" strokeWidth={1} />
            </div>
            <div className="space-y-4">
              <p className="text-4xl font-black italic tracking-tighter uppercase">Neutral Archive</p>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 italic max-w-xs mx-auto text-center">
                Your tactical selection is current empty. Discover units in the collection to manifest them here.
              </p>
            </div>
            <Link 
               href="/collection"
               className="inline-block px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-neutral-200 transition-all shadow-xl"
            >
               Browse Station
            </Link>
          </div>
        )}
      </section>

      <footer className="p-20 text-center border-t border-white/5">
        <p className="text-[9px] uppercase tracking-[1em] font-black text-white/10 italic">
          Navior Studios Wishlist Port | Terminal 03
        </p>
      </footer>
    </main>
  );
};

export default WishlistPage;
