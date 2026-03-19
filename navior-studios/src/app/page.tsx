"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import axios from "axios";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/context/ToastContext";
import { Truck, ShieldCheck, RotateCcw, Zap, Star, Shield, Sparkles, Cpu, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { addToCart } = useCartStore();
  const { success: showSuccess } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await axios.post("/api/newsletter", { email });
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (prod: any) => {
    addToCart({
        id: `hero-${prod.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: prod.name,
        price: prod.price,
        images: [],
        category: prod.cat,
        compatibility: [],
        description: "Premium Navior Essential."
    });
    showSuccess("Unit Sync'd", "Item has been added to your bag.");
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />
      <Hero />
      
      {/* Trust Badges - Amazon/Flipkart Vibe */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
              { icon: Truck, title: "FREE DEPLOYMENT", sub: "On orders above ₹999", color: "text-blue-400" },
              { icon: ShieldCheck, title: "SECURE TERMINAL", sub: "100% Encrypted Payments", color: "text-emerald-400" },
              { icon: RotateCcw, title: "7-DAY ARCHIVE", sub: "Hassle-free returns", color: "text-rose-400" },
              { icon: Zap, title: "PRIME PRIORITY", sub: "Dispatch within 24 hours", color: "text-amber-400" }
           ].map((badge, i) => (
             <div key={i} className="flex items-center space-x-4 group cursor-default">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${badge.color} group-hover:bg-white group-hover:text-black transition-all duration-500`}>
                   <badge.icon size={20} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest">{badge.title}</span>
                   <span className="text-[8px] font-medium uppercase tracking-widest text-white/20">{badge.sub}</span>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-40 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white/30">
              The Essentials
            </span>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
              Daily <br />
              <span className="text-white/10 italic">Essentials.</span>
            </h2>
          </div>
          <p className="text-white/40 max-w-xs text-xs leading-relaxed uppercase tracking-widest font-bold italic">
            Curated protection for the modern minimalist. Designed in Mumbai, built for the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { name: "Titan Shield Pro", price: 2499, cat: "Cases", rating: 4.8, revs: "4.2k", best: true },
            { name: "Lunar Magsafe", price: 1899, cat: "Power", rating: 4.9, revs: "1.8k", best: false },
            { name: "Obsidian Buds", price: 6999, cat: "Audio", rating: 4.7, revs: "852", best: true }
          ].map((prod, i) => (
            <div key={i} className="group relative bg-[#0a0a0a] rounded-[45px] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_50px_rgba(255,255,255,0.02)]">
              {/* Product Label */}
              {prod.best && (
                <div className="absolute top-8 left-8 z-10">
                   <div className="bg-white text-black px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-2xl">
                      <Sparkles size={10} />
                      <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">Best Seller</span>
                   </div>
                </div>
              )}

              <div className="aspect-square bg-[#111] flex items-center justify-center p-16 overflow-hidden relative">
                <div className="w-full h-full bg-white/[0.02] rounded-[40px] border border-white/5 group-hover:scale-105 transition-transform duration-700 shadow-2xl flex items-center justify-center">
                  <span className="text-white/5 font-black text-6xl uppercase select-none tracking-[0.2em] -rotate-12">NAVIOR</span>
                </div>
                {/* Overlay Details */}
                <div className="absolute bottom-6 right-8 opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="flex items-center space-x-2">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black italic">{prod.rating}</span>
                      <span className="text-[9px] font-black text-white/20">({prod.revs})</span>
                   </div>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 italic">{prod.cat}</p>
                  <h3 className="text-3xl font-black tracking-tighter uppercase group-hover:italic transition-all">{prod.name}</h3>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/20 line-through italic font-medium">₹{(prod.price * 1.25).toFixed(0)}</span>
                    <span className="text-3xl font-black tracking-tighter italic">₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(prod)}
                    className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-neutral-200 transition-all shadow-xl active:scale-95"
                  >
                    Sync Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Nexus - Flipkart Vibe */}
      <section className="py-20 bg-[#050505]">
          <div className="container mx-auto px-6">
              <div className="flex items-center space-x-4 mb-12">
                 <div className="w-10 h-[1px] bg-white/10" />
                 <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/20">Categorical Nexus</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                    { name: "S_01 CASES", icon: Cpu, count: 12 },
                    { name: "POWER CORE", icon: Zap, count: 8 },
                    { name: "AUDIO UNITS", icon: Globe, count: 5 },
                    { name: "APPAREL X", icon: Shield, count: 14 }
                 ].map((cat, i) => (
                    <Link href={`/collection?category=${cat.name.split(' ')[1] || cat.name}`} key={i} className="group p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white hover:text-black transition-all duration-500 flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-black/5 transition-colors">
                           <cat.icon size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-[11px] font-black uppercase tracking-widest italic">{cat.name}</h4>
                           <p className="text-[8px] font-bold text-white/20 group-hover:text-black/40 uppercase tracking-widest">{cat.count} Units Avail.</p>
                        </div>
                    </Link>
                 ))}
              </div>
          </div>
      </section>

      {/* Flash Sale Banner - Amazon Tier Vibe */}
      <section className="py-20 container mx-auto px-6">
         <div className="relative rounded-[60px] bg-white text-black p-12 md:p-24 overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-8 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                     <div className="px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse">Live Mission</div>
                     <span className="text-[10px] font-black uppercase tracking-widest italic text-black/40">Flash Deployment Alpha</span>
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                     40% OFF <br />
                     <span className="text-black/10">PREMIUM GEAR.</span>
                  </h2>
                  <div className="flex items-center justify-center md:justify-start space-x-8">
                     <div className="flex flex-col">
                        <span className="text-4xl font-black italic tracking-tighter">04</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/40">Hours</span>
                     </div>
                     <div className="text-4xl font-black italic opacity-20">:</div>
                     <div className="flex flex-col border-x border-black/5 px-8">
                        <span className="text-4xl font-black italic tracking-tighter">22</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/40">Mins</span>
                     </div>
                     <div className="text-4xl font-black italic opacity-20">:</div>
                     <div className="flex flex-col">
                        <span className="text-4xl font-black italic tracking-tighter">15</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/40">Secs</span>
                     </div>
                  </div>
                  <Link href="/collection" className="inline-block px-12 py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-transform">
                     Access Archive
                  </Link>
               </div>
               
               <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/[0.03] rounded-full animate-[spin_30s_linear_infinite] border border-black/5" />
                  <Cpu size={180} className="text-black/5" strokeWidth={0.5} />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Zap size={60} className="text-black animate-bounce" />
                  </div>
               </div>
            </div>
            
            {/* Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-black/[0.02] italic tracking-tighter pointer-events-none select-none">
               FLASH
            </div>
         </div>
      </section>

      {/* Community Gallery Section */}
      <section className="py-40 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6 space-y-20">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white/30">
                Community
              </span>
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
                Join the <br />
                <span className="text-white/10 italic">Lab.</span>
              </h2>
            </div>
            <p className="text-white/40 max-w-xs text-xs leading-relaxed uppercase tracking-widest font-bold">
              Follow us @naviorstudios. Share your daily carry and get featured.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group relative aspect-square bg-[#111111] rounded-[32px] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500">
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/5 font-black text-4xl uppercase select-none group-hover:scale-110 transition-transform duration-700">
                    LIFESTYLE 0{i}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-[8px] uppercase tracking-[0.3em] font-black text-white/60">@navior_user_{i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-40 bg-white text-black">
        <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-12">
                <div className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/30">
                        Stay Connected
                    </span>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                        Join the <br />
                        <span className="text-black/20 italic">Drop List.</span>
                    </h2>
                    <p className="text-black/60 max-w-md mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">
                        Be the first to know about new gear drops, laboratory experiments, and limited editions.
                    </p>
                </div>

                <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center gap-4 max-w-2xl mx-auto">
                    <input 
                        type="email" 
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-black/5 border border-black/10 rounded-full py-6 px-10 text-sm font-bold focus:outline-none focus:border-black/30 transition-all placeholder:text-black/20"
                    />
                    <button 
                      disabled={loading}
                      className="w-full md:w-auto px-12 py-6 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-transform shadow-2xl disabled:opacity-50"
                    >
                      {loading ? "Subscribing..." : "Subscribe"}
                    </button>
                </form>

                {status === "success" && (
                  <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500">
                    Welcome to the list. You&apos;re in.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-[10px] uppercase tracking-widest font-black text-rose-500">
                    Something went wrong. Try again.
                  </p>
                )}

                <p className="text-[10px] uppercase tracking-widest font-black text-black/20">
                    No spam. Just high-grade updates.
                </p>
            </div>
        </div>
      </section>

      {/* Navior E-commerce Footer - Professional Tier */}
      <footer className="pt-32 pb-20 bg-black border-t border-white/5">
         <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16">
            {/* Brand Desk */}
            <div className="col-span-2 space-y-8">
               <h3 className="text-3xl font-black tracking-tighter italic">NAVIOR <span className="opacity-20 italic">STUDIOS.</span></h3>
               <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] leading-relaxed font-bold italic max-w-sm">
                  Architecting premium gear for the global citizen. Designed in the lab, deployed worldwide.
               </p>
               <div className="flex space-x-6 opacity-40">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"><Globe size={14} /></div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"><Cpu size={14} /></div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"><Shield size={14} /></div>
               </div>
            </div>

            {/* Quick Archives */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">The Archive</h4>
               <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
                  <li><Link href="/collection" className="hover:italic hover:translate-x-1 transition-all inline-block">S_01 Cases</Link></li>
                  <li><Link href="/collection" className="hover:italic hover:translate-x-1 transition-all inline-block">Essential Power</Link></li>
                  <li><Link href="/collection" className="hover:italic hover:translate-x-1 transition-all inline-block">Audio Units</Link></li>
                  <li><Link href="/collection" className="hover:italic hover:translate-x-1 transition-all inline-block">Limited Drops</Link></li>
               </ul>
            </div>

            {/* User Console */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Member Station</h4>
               <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
                  <li><Link href="/dashboard" className="hover:italic hover:translate-x-1 transition-all inline-block">Command Center</Link></li>
                  <li><Link href="/order-history" className="hover:italic hover:translate-x-1 transition-all inline-block">Mission History</Link></li>
                  <li><Link href="/wishlist" className="hover:italic hover:translate-x-1 transition-all inline-block">Wishlist Vault</Link></li>
                  <li><Link href="/auth" className="hover:italic hover:translate-x-1 transition-all inline-block">Access Points</Link></li>
               </ul>
            </div>

            {/* Logistics Support */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Technical Support</h4>
               <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
                  <li className="hover:italic hover:translate-x-1 transition-all inline-block cursor-pointer">Deployment Status</li>
                  <li className="hover:italic hover:translate-x-1 transition-all inline-block cursor-pointer">Return Protocol</li>
                  <li className="hover:italic hover:translate-x-1 transition-all inline-block cursor-pointer">Contact Architects</li>
                  <li className="hover:italic hover:translate-x-1 transition-all inline-block cursor-pointer">Lab Legal</li>
               </ul>
            </div>
         </div>
         <div className="container mx-auto px-6 mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[8px] uppercase tracking-[1em] font-black text-white/10 italic">
               © 2026 Navior Studios | Station 0.1v
            </p>
            <div className="flex items-center space-x-8 text-[8px] font-black uppercase tracking-widest text-white/10">
               <span className="cursor-pointer hover:text-white transition-colors">Privacy Ops</span>
               <span className="cursor-pointer hover:text-white transition-colors">Safety Matrix</span>
               <span className="cursor-pointer hover:text-white transition-colors">Cookie Data</span>
            </div>
         </div>
      </footer>
    </main>
  );
}
