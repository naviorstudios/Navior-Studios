"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, Zap, Cpu, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";

const Navbar = () => {
  const { cart } = useCartStore();
  const { user } = useAuth();
  const { isCartOpen, setCartOpen, isMobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && !(event.target as Element).closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? "py-4" : "py-8"
      }`}
    >
      <div className={`container mx-auto px-6 flex items-center justify-between transition-all duration-500 max-w-[1400px] ${
          scrolled ? "bg-black/60 backdrop-blur-2xl py-4 px-10 rounded-[30px] border border-white/5 mx-6 md:mx-auto" : ""
      }`}>
        <Link href="/" className="group flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black rounded-xl transition-transform group-hover:rotate-12 group-active:scale-90">
             N
          </div>
          <span className="text-xl font-black tracking-tighter italic uppercase group-hover:tracking-widest transition-all">
            Navior
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-12">
          {["Collection", "Durability", "Build Kit"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className="text-[10px] uppercase tracking-[0.4em] font-black italic text-white/40 hover:text-white transition-all relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center space-x-4">
          <button 
             onClick={() => setSearchOpen(true)}
             className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/40 hover:text-white"
          >
             <Search size={18} />
          </button>
          
          <div className="relative user-menu">
            <button 
              onClick={() => user ? setUserMenuOpen(!userMenuOpen) : window.location.href = '/auth'}
              className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all relative group"
            >
              <User size={18} className={user ? "text-white" : "text-white/40"} />
              {user && <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-black" />}
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-60 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                >
                  <div className="px-4 py-4 border-b border-white/5 mb-2">
                     <p className="text-[8px] uppercase tracking-widest font-black text-white/20 mb-1">Authenticated As</p>
                     <p className="text-xs font-black italic truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 px-4 py-4 text-[10px] font-black uppercase tracking-widest italic hover:bg-white/5 rounded-2xl transition-all"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Cpu size={14} className="text-white/20" />
                    <span>Lab Dashboard</span>
                  </Link>
                  <Link
                    href="/order-history"
                    className="flex items-center space-x-3 px-4 py-4 text-[10px] font-black uppercase tracking-widest italic hover:bg-white/5 rounded-2xl transition-all"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <ShieldCheck size={14} className="text-white/20" />
                    <span>Asset Archive</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setCartOpen(!isCartOpen)}
            className="p-3 bg-white text-black rounded-2xl hover:bg-neutral-200 transition-all relative group"
          >
            <ShoppingBag size={18} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black shadow-lg">
                {cartItemCount}
              </span>
            )}
          </button>
          
          <button
            className="md:hidden p-3 bg-white/5 rounded-2xl transition-all"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black z-[200] flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-20">
              <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black rounded-xl">N</div>
              <button
                className="p-4 bg-white/5 rounded-2xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-12">
              {["Collection", "Durability", "Build Kit"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-6xl font-black tracking-tighter uppercase italic block hover:text-white/40 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
