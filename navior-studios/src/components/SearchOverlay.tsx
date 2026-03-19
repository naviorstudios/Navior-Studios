"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";
import { Search, X, ArrowRight, Smartphone, Zap, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { Product } from "@/store/useCartStore";

const SearchOverlay = () => {
  const { isSearchOpen: isOpen, setSearchOpen: setIsOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Using a custom hook or global state for search visibility
  // For now, let's assume we can trigger it from Navbar
  
  // Real-time search from API
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        try {
          const { data } = await axios.get(`/api/products`, {
            params: { search: query }
          });
          setResults(data);
        } catch (error) {
          console.error("Search Sync Error:", error);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex flex-col items-center pt-40 px-6"
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-12 right-12 p-4 hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={32} strokeWidth={1} />
          </button>

          <div className="w-full max-w-4xl space-y-12">
            <div className="relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={40} strokeWidth={1} />
              <input
                ref={inputRef}
                autoFocus
                type="text"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-8 pl-20 pr-12 text-4xl md:text-6xl font-black tracking-tighter uppercase focus:outline-none focus:border-white transition-all placeholder:text-white/5"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {/* Results */}
              <div className="space-y-8">
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20">Results</h3>
                <div className="space-y-4">
                  {results.length > 0 ? (
                    results.map(prod => (
                      <Link 
                        key={prod.id} 
                        href={`/product/${prod.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-white/20">
                                {prod.name.substring(0, 2)}
                            </div>
                            <div>
                                <p className="font-black uppercase tracking-tight">{prod.name}</p>
                                <p className="text-[10px] uppercase tracking-widest text-white/40">{prod.category}</p>
                            </div>
                        </div>
                        <ArrowRight size={20} className="text-white/20 group-hover:text-white transition-all group-hover:translate-x-1" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-white/10 uppercase tracking-widest text-xs italic">
                        {query.length > 1 ? "No results found." : "Search by name or category."}
                    </p>
                  )}
                </div>
              </div>

              {/* Suggestions / Popular */}
              <div className="space-y-8">
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20">Popular Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {["iPhone 16 Pro", "Titanium", "Chargers", "New Drops"].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-6 py-3 bg-white/5 rounded-full border border-white/5 hover:border-white/20 transition-all text-[10px] uppercase tracking-widest font-black"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
