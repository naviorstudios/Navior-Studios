"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = true,
}) => {
  const baseClasses = "bg-white/10";

  const variantClasses = {
    text: "rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  const skeletonElement = (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );

  if (!animation) return skeletonElement;

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {skeletonElement}
    </motion.div>
  );
};

// Pre-built skeleton components for common use cases
export const ProductCardSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton variant="rectangular" height={300} className="w-full" />
    <div className="space-y-2">
      <Skeleton variant="text" height={20} width="80%" />
      <Skeleton variant="text" height={16} width="60%" />
      <Skeleton variant="text" height={24} width="40%" />
    </div>
  </div>
);

export const CheckoutFormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <Skeleton variant="text" height={12} width="30%" />
      <Skeleton variant="rectangular" height={48} className="w-full" />
    </div>
    <div className="space-y-4">
      <Skeleton variant="text" height={12} width="25%" />
      <Skeleton variant="rectangular" height={48} className="w-full" />
    </div>
    <div className="space-y-4">
      <Skeleton variant="text" height={12} width="35%" />
      <Skeleton variant="rectangular" height={48} className="w-full" />
    </div>
    <Skeleton variant="rectangular" height={56} className="w-full" />
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <Skeleton variant="text" height={16} width="20%" />
      <Skeleton variant="text" height={80} width="70%" />
      <Skeleton variant="text" height={60} width="50%" />
    </div>
    <div className="flex space-x-4">
      <Skeleton variant="rectangular" width={160} height={56} />
      <Skeleton variant="rectangular" width={120} height={56} />
    </div>
  </div>
);

export const CartItemSkeleton: React.FC = () => (
  <div className="flex space-x-4 py-4">
    <Skeleton variant="rectangular" width={80} height={80} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" height={20} width="60%" />
      <Skeleton variant="text" height={16} width="40%" />
      <Skeleton variant="text" height={18} width="30%" />
    </div>
    <Skeleton variant="rectangular" width={32} height={32} />
  </div>
);

export const OrderHistorySkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="border border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <Skeleton variant="text" height={20} width="30%" />
            <Skeleton variant="text" height={16} width="25%" />
          </div>
          <Skeleton variant="text" height={18} width="20%" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" height={16} width="50%" />
          <Skeleton variant="text" height={16} width="40%" />
        </div>
      </div>
    ))}
  </div>
);