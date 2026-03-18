"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/store/useCartStore";
import { useToast } from "./ToastContext";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

const WISHLIST_STORAGE_KEY = "navior-wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { success, error, info } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsedWishlist = JSON.parse(stored);
        setWishlist(parsedWishlist);
      }
    } catch (err) {
      console.error("Error loading wishlist from localStorage:", err);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.error("Error saving wishlist to localStorage:", err);
    }
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      // Check if product already exists
      if (prev.some(item => item.id === product.id)) {
        info("Already in Wishlist", `${product.name} is already in your wishlist`);
        return prev;
      }

      success("Added to Wishlist", `${product.name} has been added to your wishlist`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => {
      const product = prev.find(item => item.id === productId);
      if (product) {
        success("Removed from Wishlist", `${product.name} has been removed from your wishlist`);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    info("Wishlist Cleared", "All items have been removed from your wishlist");
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};