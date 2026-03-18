"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/store/useCartStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { X, Heart, ShoppingCart, Plus, Minus, Star } from "lucide-react";
import Link from "next/link";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success } = useToast();

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    success("Added to Cart", `${quantity} x ${product.name} added to your cart`);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : ["/placeholder-product.jpg"]; // Fallback image

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-black border border-white/10 rounded-2xl z-50 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Product Images */}
              <div className="relative bg-white/5 p-8">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Main Image */}
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-white/5">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-product.jpg";
                    }}
                  />
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index
                            ? "border-white"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-product.jpg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-8 flex flex-col">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {product.name}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < 4 ? "text-yellow-400 fill-current" : "text-white/20"}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-white/60">(4.5)</span>
                      </div>
                    </div>

                    <button
                      onClick={handleWishlistToggle}
                      className={`p-2 rounded-full transition-colors ${
                        isInWishlist(product.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/20"
                      }`}
                    >
                      <Heart
                        size={20}
                        className={isInWishlist(product.id) ? "fill-current" : ""}
                      />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-white/80 leading-relaxed">
                      {product.description || "Premium protection and accessories designed for the modern lifestyle. Engineered for durability and style."}
                    </p>
                  </div>

                  {/* Compatibility */}
                  {product.compatibility && product.compatibility.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-white/60 mb-2">Compatible with:</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.compatibility.map((comp) => (
                          <span
                            key={comp}
                            className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-white/60 mb-3">Quantity</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-white/5 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-3 text-white/60 hover:text-white transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-3 text-white font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-3 text-white/60 hover:text-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-white/60 text-sm">
                        Total: ₹{(product.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart - ₹{(product.price * quantity).toLocaleString()}</span>
                  </button>

                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="block w-full py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors text-center"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};