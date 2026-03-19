"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Product, useCartStore } from "@/store/useCartStore";
import { Shield, Zap, Package, ArrowLeft, ArrowRight, Plus, Minus, Share2, Sparkles, Cpu, Globe, Heart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductContentProps {
  initialProduct: Product;
}

const ProductContent: React.FC<ProductContentProps> = ({ initialProduct }) => {
  const router = useRouter();
  const [product] = useState<Product>(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCartStore();
  const { success: showSuccess } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    showSuccess("Unit Sync'd", `${quantity} x ${product.name} added to your deployment bag.`);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="pt-32 pb-40 px-6 container mx-auto max-w-[1400px]">
        {/* Back Navigation */}
        <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center space-x-3 text-white/20 hover:text-white transition-all mb-16 group"
        >
            <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black italic">Return to Station</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
          
          {/* Left: Cinematic Visuals */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
               layoutId={`image-${product.id}`}
               className="aspect-[4/5] bg-white/[0.02] rounded-[60px] border border-white/5 overflow-hidden relative flex items-center justify-center group"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-white via-transparent to-transparent" />
                   <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 1.1, rotateY: -20 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full flex items-center justify-center p-12 md:p-24"
                  >
                    {product.images?.[selectedImage] ? (
                        <Image
                            src={product.images[selectedImage]}
                            alt={product.name}
                            fill
                            priority
                            className="object-contain drop-shadow-[0_40px_80px_rgba(255,255,255,0.05)] transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="text-white/[0.03] font-black text-[20rem] tracking-tighter uppercase select-none italic -rotate-12">
                            {product.name.split(' ')[0]}
                        </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Perspective Badge */}
                <div className="absolute bottom-12 right-12 flex items-center space-x-4">
                   <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white/40 italic">
                      Series 01 // V.1.0
                   </div>
                </div>
            </motion.div>

            {/* Thumbnail Switcher */}
            <div className="flex justify-center space-x-6">
                {(product.images?.length > 1 ? product.images : [null, null, null]).map((img, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(i)}
                        className={`w-28 h-28 rounded-3xl border transition-all overflow-hidden shrink-0 flex items-center justify-center bg-white/[0.02] relative group ${
                            selectedImage === i ? "border-white" : "border-white/5 hover:border-white/10"
                        }`}
                    >
                        {img ? (
                          <Image src={img} alt="" fill className="object-contain p-4 grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                        ) : (
                          <div className="text-white/5 font-black text-2xl italic tracking-tighter">{i+1}</div>
                        )}
                        {selectedImage === i && (
                           <motion.div layoutId="thumb-active" className="absolute bottom-1 w-8 h-0.5 bg-white rounded-full" />
                        )}
                    </motion.button>
                ))}
            </div>
          </div>

          {/* Right: Technical Specifications & Commerce */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <header className="space-y-8 mb-16">
              <div className="flex items-center space-x-4">
                 <div className="bg-white/5 border border-white/10 rounded-full px-5 py-2 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Synchronized</span>
                 </div>
                 <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/30 hover:text-white">
                    <Share2 size={16} />
                </button>
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] italic underline decoration-white/5 underline-offset-[20px]"
              >
                {product.name.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-transparent block mt-2" : "block"}>
                        {word}
                    </span>
                ))}
              </motion.h1>

              <div className="flex items-end space-x-6 pt-4">
                <div className="space-y-1">
                   <p className="text-[9px] uppercase tracking-[0.6em] font-black text-white/20 italic">Unit Price</p>
                   <span className="text-6xl font-black tracking-tighter italic">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-2xl flex items-center space-x-2 mb-2">
                   <Zap size={14} className="animate-bounce" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Instant Ship</span>
                </div>
              </div>
            </header>

            <div className="space-y-12">
                <p className="text-xl text-white/40 leading-relaxed font-medium max-w-lg italic">
                    {product.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-6 pb-12 border-b border-white/5">
                    <div className="p-8 bg-white/[0.02] rounded-[40px] border border-white/5 space-y-4 group hover:bg-white/[0.04] transition-all">
                        <Shield size={28} className="text-white/20 group-hover:text-white transition-colors" />
                        <div className="space-y-1">
                           <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20">Durability</p>
                           <p className="text-sm font-black uppercase italic tracking-tight">Reinforced Composite</p>
                        </div>
                    </div>
                    <div className="p-8 bg-white/[0.02] rounded-[40px] border border-white/5 space-y-4 group hover:bg-white/[0.04] transition-all">
                        <Cpu size={28} className="text-white/20 group-hover:text-white transition-colors" />
                        <div className="space-y-1">
                           <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20">Technology</p>
                           <p className="text-sm font-black uppercase italic tracking-tight">AeroSync V2.0</p>
                        </div>
                    </div>
                </div>

                {/* Purchase Area */}
                <div className="space-y-8 pt-4">
                   <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex items-center space-x-8 bg-white/5 border border-white/5 p-2 rounded-3xl w-full md:w-fit md:px-4">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-14 h-14 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all"
                            >
                                <Minus size={18} className="text-white/40 hover:text-white" />
                            </button>
                            <span className="text-2xl font-black w-8 text-center italic">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-14 h-14 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all"
                            >
                                <Plus size={18} className="text-white/40 hover:text-white" />
                            </button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 w-full py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-[10px] rounded-[30px] hover:bg-neutral-200 active:scale-95 transition-all shadow-[0_20px_80px_rgba(255,255,255,0.1)] group flex items-center justify-center space-x-4"
                        >
                            <span>Initialize Deployment</span>
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                        <button 
                            onClick={() => {
                                const prod = {
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    images: product.images,
                                    category: product.category,
                                    compatibility: [],
                                    description: product.description || ""
                                };
                                isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(prod as any);
                            }}
                            className={`w-24 bg-${isInWishlist(product.id) ? 'red-500' : 'white/5'} border border-white/5 rounded-[30px] flex items-center justify-center transition-all hover:bg-white/10`}
                        >
                           <Heart size={20} fill={isInWishlist(product.id) ? "white" : "none"} className={isInWishlist(product.id) ? "text-white" : "text-white/40"} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-[9px] uppercase tracking-[0.4em] font-black text-white/20">
                       <div className="flex items-center space-x-3">
                          <Globe size={14} />
                          <span>Airborne Logistics</span>
                       </div>
                       <div className="flex items-center space-x-3">
                          <Package size={14} />
                          <span>Archive Quality</span>
                       </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive */}
        <section className="mt-60 pt-40 border-t border-white/5">
            <div className="flex items-center space-x-4 text-white/10 mb-20 overflow-hidden">
               <span className="text-[12vw] font-black tracking-tighter uppercase italic select-none">ARCHITECTURE</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <div className="space-y-16">
                    <h2 className="text-7xl font-black tracking-tighter uppercase leading-[0.85] italic">
                        Forged in the <br />
                        <span className="text-white/10">Future.</span>
                    </h2>
                    <div className="space-y-10 text-white/40 text-xl leading-relaxed font-medium italic">
                        <p>
                            The {product.name} isn't a commodity; it's a structural masterpiece. 
                            Each unit is calibrated for peak protection and thermal optimization.
                        </p>
                        <p>
                            We've utilized high-density graphene composites to ensure the 
                            structural integrity remains uncompromised under extreme 
                            gravitational or thermal stress.
                        </p>
                    </div>
                    <div className="flex space-x-12">
                       <div className="space-y-2">
                          <p className="text-4xl font-black italic tracking-tighter">0.3mm</p>
                          <p className="text-[10px] uppercase tracking-widest font-black text-white/20">Precision Edge</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-4xl font-black italic tracking-tighter">100%</p>
                          <p className="text-[10px] uppercase tracking-widest font-black text-white/20">Recyclable Payload</p>
                       </div>
                    </div>
                </div>
                <div className="relative aspect-square bg-white/[0.02] rounded-[80px] overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center p-32">
                        <Sparkles className="w-full h-full text-white/[0.03] group-hover:text-white/[0.08] transition-all" strokeWidth={0.5} />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-1 border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                </div>
            </div>
        </section>

        {/* Peer Feedback Archive (Reviews) - Amazon Tier Integration */}
        <section className="mt-60 space-y-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
               <div className="space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 italic">Peer Feedback Archive</span>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                     Field <br />
                     <span className="text-white/10 italic">Reports.</span>
                  </h2>
               </div>
               <div className="flex items-center space-x-8 pb-4">
                  <div className="text-right">
                     <p className="text-4xl font-black italic tracking-tighter">4.9</p>
                     <p className="text-[9px] uppercase tracking-widest font-black text-white/20">Operational Rating</p>
                  </div>
                  <div className="flex space-x-1">
                     {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  { user: "ARCHIVIST_01", date: "2026.03.12", comment: "The structural integrity is beyond anything in the civilian sector. Elite deployment ready.", rating: 5 },
                  { user: "PILOT_X", date: "2026.03.05", comment: "Zero thermal leakage. The haptic response on the buttons is synchronized perfectly.", rating: 5 },
                  { user: "NOMAD_SURGE", date: "2026.02.28", comment: "Visual manifest is stunning. Protection level: Absolute.", rating: 4 }
               ].map((review, i) => (
                  <div key={i} className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 space-y-8 hover:bg-white/[0.04] transition-all group">
                     <div className="flex justify-between items-start">
                        <div className="flex space-x-1">
                           {Array(review.rating).fill(0).map((_, j) => (
                              <div key={j} className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
                           ))}
                        </div>
                        <span className="text-[9px] font-black text-white/10">{review.date}</span>
                     </div>
                     <p className="text-lg font-medium italic text-white/60 leading-[1.4] line-clamp-3">
                        &quot;{review.comment}&quot;
                     </p>
                     <div className="flex items-center space-x-4 border-t border-white/5 pt-6">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                           <User size={12} className="text-white/20" />
                        </div>
                        <span className="text-[10px] font-black tracking-widest uppercase italic text-white/20">{review.user}</span>
                     </div>
                  </div>
               ))}
            </div>
        </section>

        {/* Synchronized Assets (Related Products) - Amazon Tier Exploration */}
        <section className="mt-80 space-y-20 border-t border-white/5 pt-40 px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
               <div className="space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 italic">Compatibility Protocol</span>
                  <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                     Synchronized <br />
                     <span className="text-white/10 italic">Assets.</span>
                  </h2>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-[0.2em] italic max-w-sm">Elite members often synchronize these units for comprehensive deployment protection.</p>
               </div>
               <Link href="/collection" className="text-[10px] uppercase font-black tracking-[0.5em] text-white/20 hover:text-white transition-all pb-4 border-b border-white/5">Examine Collection</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               {[
                  { name: "Orbital Nexus Case", type: "ACCESSORY", price: "₹2,499", icon: Cpu },
                  { name: "Titan Shield v2", type: "PROTECTION", price: "₹5,499", icon: Shield },
                  { name: "Aero Command Strut", type: "CASE", price: "₹8,999", icon: Zap },
                  { name: "Neural Link Band", type: "SYNC", price: "₹1,299", icon: Globe }
               ].map((asset, i) => (
                  <div key={i} className="group p-10 rounded-[50px] bg-white/[0.02] border border-white/5 space-y-10 hover:bg-white/[0.05] transition-all cursor-pointer">
                     <div className="aspect-square bg-white/5 rounded-[40px] flex items-center justify-center relative overflow-hidden group-hover:bg-white/10 transition-colors">
                        <asset.icon size={48} className="text-white/10 group-hover:text-white transition-all scale-100 group-hover:scale-110" />
                        <div className="absolute top-6 left-6">
                           <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{asset.type}</span>
                        </div>
                     </div>
                     <div className="space-y-2 text-center">
                        <h4 className="text-xl font-black italic tracking-tighter uppercase group-hover:italic transition-all">{asset.name}</h4>
                        <p className="text-2xl font-black tracking-tighter italic text-white/60">{asset.price}</p>
                     </div>
                  </div>
               ))}
            </div>
        </section>
      </div>

      <footer className="p-20 text-center border-t border-white/5">
        <p className="text-[9px] uppercase tracking-[1em] font-black text-white/10 italic">
          Navior Studios Research Lab | Series 01.v2
        </p>
      </footer>
    </main>
  );
};

export default ProductContent;
