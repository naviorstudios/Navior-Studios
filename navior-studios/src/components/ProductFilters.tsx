"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, ChevronUp, Sliders, Zap, Crosshair } from "lucide-react";

export interface FilterOptions {
  category: string[];
  priceRange: [number, number];
  compatibility: string[];
  sortBy: "name" | "price-low" | "price-high" | "newest";
}

interface ProductFiltersProps {
  products: Product[];
  onFilteredProducts: (filtered: Product[]) => void;
  categories: string[];
  compatibilities: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  products,
  onFilteredProducts,
  categories,
  compatibilities,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: [0, 50000],
    compatibility: [],
    sortBy: "name",
  });

  useEffect(() => {
    let filtered = [...products];

    if (filters.category.length > 0) {
      filtered = filtered.filter(product =>
        filters.category.includes(product.category)
      );
    }

    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (filters.compatibility.length > 0) {
      filtered = filtered.filter(product =>
        product.compatibility?.some(comp => filters.compatibility.includes(comp))
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "newest": return b.id.localeCompare(a.id);
        case "name":
        default: return a.name.localeCompare(b.name);
      }
    });

    onFilteredProducts(filtered);
  }, [products, filters, onFilteredProducts]);

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const toggleCompatibility = (compatibility: string) => {
    setFilters(prev => ({
      ...prev,
      compatibility: prev.compatibility.includes(compatibility)
        ? prev.compatibility.filter(c => c !== compatibility)
        : [...prev.compatibility, compatibility]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 50000],
      compatibility: [],
      sortBy: "name",
    });
  };

  const activeFiltersCount =
    filters.category.length +
    filters.compatibility.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? 1 : 0);

  return (
    <div className="mb-20">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/5">
        <div className="flex items-center space-x-8">
           <button
             onClick={() => setIsOpen(!isOpen)}
             className="flex items-center space-x-4 group"
           >
             <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${isOpen ? "bg-white text-black border-white" : "bg-white/5 border-white/5 hover:border-white/20"}`}>
                <Sliders size={18} className={isOpen ? "" : "text-white/40 group-hover:text-white transition-colors"} />
             </div>
             <div className="text-left">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black italic block mb-0.5">Parameters</span>
                <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/20 italic">
                   {activeFiltersCount > 0 ? `${activeFiltersCount} Active Protocols` : "All Signals Active"}
                </span>
             </div>
           </button>

           <div className="h-8 w-px bg-white/5 hidden md:block" />

           {/* Quick Sort - Premium Styled Select */}
           <div className="hidden md:flex items-center space-x-6">
              <span className="text-[9px] uppercase tracking-[0.5em] font-black text-white/10 italic">Sequence:</span>
              <div className="flex space-x-4">
                 {[
                   { id: "newest", label: "New" },
                   { id: "price-low", label: "Value" },
                   { id: "price-high", label: "Premium" }
                 ].map((opt) => (
                    <button
                       key={opt.id}
                       onClick={() => setFilters(prev => ({ ...prev, sortBy: opt.id as any }))}
                       className={`text-[8px] uppercase tracking-[0.4em] font-black italic px-4 py-2 rounded-xl border transition-all ${
                          filters.sortBy === opt.id ? "bg-white/5 border-white/20 text-white" : "border-transparent text-white/20 hover:text-white"
                       }`}
                    >
                       {opt.label}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 text-[8px] uppercase tracking-[0.4em] font-black text-red-500/40 hover:text-red-500 transition-colors italic"
          >
            <X size={12} />
            <span>Flush Protocols</span>
          </button>
        )}
      </div>

      {/* Expandable Filter Lab */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-20">
              
              {/* Categories */}
              <div className="space-y-8">
                 <div className="flex items-center space-x-3">
                    <Zap size={14} className="text-white/20" />
                    <h3 className="text-[10px] uppercase tracking-[0.5em] font-black italic">Classification</h3>
                 </div>
                 <div className="flex flex-col space-y-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`text-left text-sm font-black uppercase tracking-widest italic transition-all flex items-center space-x-4 group ${
                          filters.category.includes(category) ? "text-white" : "text-white/10 hover:text-white/40"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full border border-white/20 transition-all ${filters.category.includes(category) ? "bg-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent group-hover:border-white/40"}`} />
                        <span>{category}</span>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Compatibility */}
              <div className="space-y-8">
                 <div className="flex items-center space-x-3">
                    <Crosshair size={14} className="text-white/20" />
                    <h3 className="text-[10px] uppercase tracking-[0.5em] font-black italic">Platform Sync</h3>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    {compatibilities.map((compatibility) => (
                      <button
                        key={compatibility}
                        onClick={() => toggleCompatibility(compatibility)}
                        className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest italic border transition-all ${
                          filters.compatibility.includes(compatibility)
                            ? "bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                            : "bg-white/5 text-white/20 border-white/5 hover:border-white/10 hover:text-white/40"
                        }`}
                      >
                        {compatibility}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Price Calibration */}
              <div className="space-y-8">
                 <div className="flex items-center space-x-3">
                    <Sliders size={14} className="text-white/20" />
                    <h3 className="text-[10px] uppercase tracking-[0.5em] font-black italic">Value Range</h3>
                 </div>
                 <div className="space-y-8">
                    <div className="relative pt-6">
                       <input 
                          type="range" 
                          min="0" 
                          max="50000" 
                          step="1000"
                          value={filters.priceRange[1]}
                          onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                          className="w-full h-1 bg-white/5 appearance-none rounded-full cursor-pointer accent-white"
                       />
                       <div className="flex justify-between mt-4">
                          <div className="space-y-1">
                             <p className="text-[8px] uppercase tracking-widest font-black text-white/10">Ceiling</p>
                             <p className="text-xl font-black italic tracking-tighter">₹{filters.priceRange[1].toLocaleString()}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};