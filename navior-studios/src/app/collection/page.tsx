"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Filter, SlidersHorizontal, ArrowRight, Zap, Shield, Sparkles, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";

const CATEGORIES = ["All", "Cases", "Accessories", "Protection", "Apparel"];
const SORT_OPTIONS = [
  { label: "LATEST ARCHIVE", value: "createdAt", order: "desc" },
  { label: "PRICE: LOW TO HIGH", value: "price", order: "asc" },
  { label: "PRICE: HIGH TO LOW", value: "price", order: "desc" }
];

const CollectionPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price");
  const [order, setSortOrder] = useState<"asc" | "desc">("asc");
  const { addToCart } = useCartStore();
  const { success: showSuccess } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortBy, order]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/products`, {
        params: { category: activeCategory, sortBy, order }
      });
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch collection", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: [product.image],
      category: product.category,
      compatibility: product.compatibility || [],
      description: product.description || ""
    });
    showSuccess("Unit Sync'd", "Item has been added to your bag.");
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pb-32">
      <Navbar />

      {/* Hero Section - Boutique Style */}
      <section className="pt-40 pb-20 px-6 container mx-auto">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.6em] font-black text-white/20"
            >
              <span className="w-8 h-px bg-white/10" />
              <span>Series 01 Collection</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-none italic"
            >
              GEAR <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white/10">STATION.</span>
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-widest font-black text-white/30">Archives Found</span>
              <span className="text-xl font-bold tracking-tighter italic">00{products.length} Units</span>
            </div>
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl">
               <SlidersHorizontal size={20} className="text-black" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Filter Menu */}
      <nav className="sticky top-24 z-40 py-4 px-6 container mx-auto mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-6 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-[11px] uppercase tracking-[0.4em] font-black transition-all px-8 py-4 rounded-2xl border whitespace-nowrap ${
                  activeCategory === category 
                    ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                    : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Sort Hub - Amazon Feature */}
          <div className="flex items-center space-x-6 w-full md:w-auto justify-end">
             <div className="hidden sm:flex items-center space-x-3 text-[10px] uppercase tracking-widest font-black text-white/20 italic">
                <SlidersHorizontal size={12} />
                <span>Sort Manifest</span>
             </div>
             
             <div className="relative group">
                <select 
                  onChange={(e) => {
                    const opt = SORT_OPTIONS.find(o => o.label === e.target.value);
                    if (opt) {
                       setSortBy(opt.value);
                       setSortOrder(opt.order as "asc" | "desc");
                    }
                  }}
                  className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-10 py-4 text-[11px] font-black uppercase tracking-[0.3em] focus:outline-none focus:border-white/20 transition-all cursor-pointer pr-16 italic"
                >
                   {SORT_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.label} className="bg-[#111] text-white py-4">{opt.label}</option>
                   ))}
                </select>
                <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white pointer-events-none transition-colors" />
             </div>
          </div>
        </div>
      </nav>

      {/* Product Grid - Premium Staggered Look */}
      <section className="px-6 container mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <AnimatePresence mode="popLayout">
            {loading ? (
               Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-white/5 rounded-[40px] animate-pulse" />
              ))
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group ${index % 2 !== 0 ? "md:mt-32" : ""}`}
                >
                  {/* Luxury Card Container */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                    />
                    {/* Controls */}
                    <div className="absolute top-8 right-8 flex flex-col space-y-4">
                       <button 
                         onClick={(e) => {
                           e.preventDefault();
                           const wishlistProd = {
                               id: product.id,
                               name: product.name,
                               price: product.price,
                               images: [product.image],
                               category: product.category,
                               compatibility: [],
                               description: product.description || ""
                           };
                           isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(wishlistProd as any);
                         }}
                         className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-3xl border transition-all ${
                           isInWishlist(product.id) 
                             ? "bg-red-500 border-red-500 text-white" 
                             : "bg-black/40 border-white/10 text-white/40 hover:text-white hover:bg-black"
                         }`}
                       >
                         <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                       </button>
                    </div>
                    <div className="absolute top-8 left-8 flex flex-col space-y-2">
                       {product.featured && (
                         <div className="bg-white text-black px-4 py-1.5 rounded-full flex items-center space-x-2 w-fit">
                           <Sparkles size={12} />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] italic underline decoration-black/30">Limited</span>
                         </div>
                       )}
                       <div className="bg-black/80 backdrop-blur-md text-white/60 px-4 py-1.5 rounded-full flex items-center space-x-2 w-fit border border-white/10">
                         <Zap size={10} />
                         <span className="text-[9px] font-black uppercase tracking-[0.3em] font-mono italic">#{product.id.split('-')[1] || "ARC"}</span>
                       </div>
                    </div>

                    {/* Reveal Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToCart(product)}
                          className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center shadow-2xl overflow-hidden relative group/btn"
                        >
                           <ShoppingBag size={24} className="relative z-10 transition-transform group-hover/btn:-translate-y-12" />
                           <ArrowRight size={24} className="absolute inset-0 m-auto translate-y-12 transition-transform group-hover/btn:translate-y-0" />
                        </motion.button>
                    </div>

                    {/* Corner Detail */}
                    <div className="absolute bottom-10 right-10 flex items-end">
                       <span className="text-4xl font-black italic tracking-tighter mix-blend-difference">
                        ₹{product.price.toLocaleString('en-IN')}
                       </span>
                    </div>
                  </div>

                  {/* Metadata Below Card */}
                    <div className="mt-8 flex justify-between items-start px-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 mb-2">
                           <div className="flex text-amber-400">
                              <Sparkles size={10} fill="currentColor" />
                              <Sparkles size={10} fill="currentColor" />
                              <Sparkles size={10} fill="currentColor" />
                              <Sparkles size={10} fill="currentColor" />
                              <Sparkles size={10} fill="currentColor" opacity={0.2} />
                           </div>
                           <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">852 Reviews</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase group-hover:italic transition-all duration-300">{product.name}</h3>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">{product.category}</p>
                      </div>
                      <Link 
                        href={`/product/${product.id}`}
                        className="text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-white transition-colors border-b border-white/0 hover:border-white/40 pb-1"
                      >
                        Specifications
                      </Link>
                    </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center space-y-6">
                 <Shield size={48} className="mx-auto text-white/10" />
                 <p className="text-[10px] uppercase tracking-[0.6em] font-black text-white/20 italic">No matches detected in archives.</p>
                 <button 
                  onClick={() => setActiveCategory("All")}
                  className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white"
                 >Reset Filters</button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Why Navior - Trust Protocol */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-white/5 py-24 bg-white/[0.01] rounded-[60px] px-12">
            {[
              { icon: Shield, title: "ARMORED SHIPMENT", sub: "Dispatched in 2-layer tactical packaging to ensure zero-point entry damage." },
              { icon: Zap, title: "INSTANT DEPLOY", sub: "Mumbai Hub orders dispatched within 6 mission-hours of confirmation." },
              { icon: Sparkles, title: "LIFETIME RECALL", sub: "Register your unit for lifetime structural integrity support and hardware upgrades." }
            ].map((trust, i) => (
              <div key={i} className="space-y-6 text-center md:text-left group">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <trust.icon size={20} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-widest italic">{trust.title}</h4>
                    <p className="text-[9px] font-bold text-white/20 leading-relaxed uppercase tracking-widest">{trust.sub}</p>
                 </div>
              </div>
            ))}
        </div>

        {/* Load More - Amazon Feature */}
        {!loading && products.length > 0 && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="mt-32 flex flex-col items-center space-y-10"
           >
              <button className="px-12 py-6 bg-white/5 border border-white/5 rounded-3xl text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all group">
                 <span className="group-hover:italic">Expand Manifest</span>
              </button>
           </motion.div>
        )}
      </section>

      {/* Abstract Background Detail */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 -rotate-90 text-[10vw] font-black text-white/[0.02] pointer-events-none select-none italic tracking-tighter">
        NAVIOR ARCHIVE
      </div>
    </main>
  );
};

export default CollectionPage;
