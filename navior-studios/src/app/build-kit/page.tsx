"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Product, useCartStore } from "@/store/useCartStore";
import { Smartphone, Laptop, Tablet, Plus, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DevicePreview from "@/components/DevicePreview";

const devices = [
  { id: "iphone", name: "iPhone 16 Pro", icon: Smartphone },
  { id: "macbook", name: "MacBook Pro M3", icon: Laptop },
  { id: "ipad", name: "iPad Pro M4", icon: Tablet },
] as const;

type DeviceType = typeof devices[number]["id"];

const BuildYourKit = () => {
  const [selectedDevice, setSelectedDevice] = useState<typeof devices[number]>(devices[0]);
  const [selectedAccessories, setSelectedAccessories] = useState<Product[]>([]);
  const { addToCart } = useCartStore();

  const accessories: Product[] = [
    {
      id: "case-1",
      name: "Titan Shield Case",
      price: 2499,
      images: [],
      category: "Cases",
      compatibility: ["iPhone 16 Pro"],
      description: "Ultra-premium titanium protection."
    },
    {
      id: "charger-1",
      name: "Lunar MagSafe Charger",
      price: 1899,
      images: [],
      category: "Power",
      compatibility: ["iPhone 16 Pro"],
      description: "Fast wireless charging."
    },
    {
      id: "lens-1",
      name: "Quantum Camera Lens",
      price: 999,
      images: [],
      category: "Accessories",
      compatibility: ["iPhone 16 Pro"],
      description: "Scratch-resistant sapphire glass."
    }
  ];

  const toggleAccessory = (accessory: Product) => {
    if (selectedAccessories.find((a) => a.id === accessory.id)) {
      setSelectedAccessories(selectedAccessories.filter((a) => a.id !== accessory.id));
    } else {
      setSelectedAccessories([...selectedAccessories, accessory]);
    }
  };

  const addAllToCart = () => {
    selectedAccessories.forEach((a) => addToCart(a));
    setSelectedAccessories([]);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="pt-32 pb-20 container mx-auto px-6 max-w-7xl">
        <header className="mb-20 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white/30">
                Customized Protection
            </span>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
                Build <br />
                <span className="text-white/10 italic">Your Kit.</span>
            </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Step 1: Select Device */}
            <div className="lg:col-span-3 space-y-12">
                <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-black text-[10px]">01</div>
                        <h2 className="text-sm font-black uppercase tracking-widest">Select Platform</h2>
                    </div>
                    <div className="space-y-3">
                        {devices.map((device) => (
                            <button
                                key={device.id}
                                onClick={() => setSelectedDevice(device)}
                                className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between group ${
                                    selectedDevice.id === device.id
                                        ? "bg-white text-black border-white"
                                        : "bg-white/5 text-white border-white/5 hover:border-white/20"
                                }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <device.icon size={20} strokeWidth={selectedDevice.id === device.id ? 2.5 : 1.5} />
                                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{device.name}</span>
                                </div>
                                {selectedDevice.id === device.id && <div className="w-2 h-2 bg-black rounded-full" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-white/10 text-white rounded-full flex items-center justify-center font-black text-[10px]">02</div>
                        <h2 className="text-sm font-black uppercase tracking-widest">Add Gear</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {accessories.map((accessory) => {
                            const isSelected = selectedAccessories.find((a) => a.id === accessory.id);
                            return (
                                <button
                                    key={accessory.id}
                                    onClick={() => toggleAccessory(accessory)}
                                    className={`w-full p-6 rounded-3xl border transition-all text-left flex flex-col space-y-4 ${
                                        isSelected
                                            ? "bg-white/10 border-white"
                                            : "bg-white/5 border-white/5 hover:border-white/20"
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-black text-xs tracking-tight uppercase">{accessory.name}</p>
                                            <p className="text-[8px] text-white/40 uppercase tracking-widest font-black">{accessory.category}</p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? "bg-white text-black rotate-45" : "bg-white/10"}`}>
                                            <Plus size={14} />
                                        </div>
                                    </div>
                                    <span className="text-xl font-black tracking-tighter">₹{accessory.price.toLocaleString('en-IN')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 3D Preview Center */}
            <div className="lg:col-span-6 relative aspect-square lg:aspect-auto h-[600px] bg-[#050505] rounded-[48px] border border-white/5 overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedDevice.id}
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full"
                    >
                        <DevicePreview type={selectedDevice.id as DeviceType} />
                    </motion.div>
                </AnimatePresence>
                
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-2 pointer-events-none">
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/40">Lab Environment v1.0</p>
                    <p className="text-[8px] uppercase tracking-[1em] font-black text-white/10">360 CONFIGURATOR ACTIVE</p>
                </div>
            </div>

            {/* Config Summary Card */}
            <div className="lg:col-span-3">
                <AnimatePresence>
                    {selectedAccessories.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white p-10 rounded-[48px] text-black h-fit flex flex-col justify-between space-y-12 shadow-[0_0_50px_rgba(255,255,255,0.1)] sticky top-32"
                        >
                            <div className="space-y-8">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Your Configuration</span>
                                <div className="space-y-4">
                                    <p className="text-4xl font-black tracking-tighter leading-none">
                                        ₹{selectedAccessories.reduce((total, a) => total + a.price, 0).toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                        {selectedAccessories.length} Items for {selectedDevice.name}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-8 border-t border-black/5">
                                    {selectedAccessories.map(acc => (
                                        <div key={acc.id} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span>{acc.name}</span>
                                            <span className="opacity-40">₹{acc.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <button
                                onClick={addAllToCart}
                                className="w-full py-6 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                            >
                                <span>Inject to Bag</span>
                                <ArrowRight size={14} />
                            </button>
                        </motion.div>
                    ) : (
                        <div className="h-full border border-white/5 rounded-[48px] p-10 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                                <Plus size={16} className="text-white/20" />
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 leading-relaxed">
                                Start adding gear <br /> to see summary
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </main>
  );
};

export default BuildYourKit;
