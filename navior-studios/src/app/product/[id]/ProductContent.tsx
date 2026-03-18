"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Product, useCartStore } from "@/store/useCartStore";
import { Shield, Zap, Package, ArrowLeft, Plus, Minus, Share2, Sparkles, Cpu, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";

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
