"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Cpu, Zap, Shield, Sparkles } from "lucide-react";

const AITerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "AI TERMINAL ONLINE. I am the Navior Intelligence Agent. How can I assist your deployment today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate AI Response
    setTimeout(() => {
      let aiResponse = "Consulting the archive... ";
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("shipping")) aiResponse = "Airborne Logistics are operational. Free deployment is unlocked above ₹999.";
      else if (lowInput.includes("sale")) aiResponse = "Series 01 is currently in a high-demand phase. Some archives are reaching zero-point stock.";
      else if (lowInput.includes("best")) aiResponse = "The S_01 Titan Shield is currently our most synchronized unit for maximum protection.";
      else aiResponse = "My neural processors suggest exploring the Collection manifest for the latest S_01 gear.";

      setMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-12 z-50 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-90 transition-all group"
      >
         <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20 group-hover:opacity-40" />
         <Cpu size={24} className="relative z-10" />
         <div className="absolute -top-1 -right-1 bg-blue-500 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
         </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(20px)" }}
            className="fixed bottom-32 right-12 z-50 w-96 max-h-[600px] h-[80vh] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 relative">
                     <Cpu size={20} className="text-white/60" />
                     <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                  <div>
                     <h3 className="text-xs font-black uppercase tracking-widest leading-none">AI Terminal</h3>
                     <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest italic animate-pulse">Sync Active</span>
                  </div>
               </div>
               <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
               >
                  <X size={18} className="text-white/40" />
               </button>
            </div>

            {/* Chat Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl text-[11px] font-medium leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-white text-black rounded-tr-none' 
                          : 'bg-white/5 border border-white/5 text-white/60 rounded-tl-none italic font-mono'
                    }`}>
                        {msg.content}
                    </div>
                 </div>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
               <div className="relative">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Enter command..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs font-mono focus:outline-none focus:border-white/20 transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                     <Send size={14} />
                  </button>
               </div>
               <div className="mt-4 flex items-center justify-between text-[7px] font-black text-white/10 uppercase tracking-[0.2em] italic">
                  <span>Navior_AI_v4.2</span>
                  <div className="flex space-x-2">
                     <span className="flex items-center space-x-1"><Shield size={6}/> <span>Secure</span></span>
                     <span className="flex items-center space-x-1"><Zap size={6}/> <span>Fast</span></span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITerminal;
