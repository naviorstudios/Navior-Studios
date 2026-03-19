"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Zap, User, Clock } from "lucide-react";
import axios from "axios";

// Mock Fallback if API fails
const MOCK_FALLBACK = [
  { name: "Robin", location: "Mumbai, IN", product: "S_01 Titan Shield", time: "2 mins ago", type: "DEPLOYMENT" },
];

const MarketActivity = () => {
  const [activities, setActivities] = useState(MOCK_FALLBACK);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/market-activity');
        if (data && data.length > 0) setActivities(data);
      } catch (err) {
        console.warn("Market Beacon Offline - Using Fallback Protocols");
      }
    };

    fetchActivities();
    const refreshTimer = setInterval(fetchActivities, 60000); // Refresh every minute

    // Show after 3 seconds, hide after 4, repeat every 9s
    const displayTimer = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
      setIndex((prev) => (prev + 1) % activities.length);
    }, 9000); 

    return () => {
      clearInterval(refreshTimer);
      clearInterval(displayTimer);
    };
  }, [activities.length]);

  const activity = activities[index] || MOCK_FALLBACK[0];

  return (
    <div className="fixed bottom-12 left-12 z-50 pointer-events-none hidden md:block">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, scale: 0.8, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="p-5 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[35px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center space-x-5 min-w-[340px] relative transition-all"
          >
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0">
               <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
               <ShoppingBag size={24} className="text-blue-500" />
            </div>
            
            <div className="flex-1 space-y-1">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Verified Peer</span>
                     <div className="bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[7px] font-black text-emerald-400 italic tracking-[0.2em]">AUTHENTIC</div>
                  </div>
                  <div className="flex items-center space-x-1 text-[8px] font-bold text-white/10 uppercase italic">
                     <Clock size={8} />
                     <span>{activity.time}</span>
                  </div>
               </div>
               <p className="text-xs font-black uppercase tracking-tight leading-tight">
                  <span className="text-blue-400 italic underline decoration-blue-400/20 underline-offset-2">{activity.name}</span> in {activity.location} <br />
                  <span className="text-white/60">locked in</span> <span className="text-white">{activity.product}</span>
               </p>
            </div>

            {/* Micro Ping Signal */}
            <div className="absolute -top-1 -right-1 flex">
               <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-blue-400 opacity-20"></span>
               <div className="bg-blue-500 w-3 h-3 rounded-full border-2 border-black relative z-10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketActivity;
