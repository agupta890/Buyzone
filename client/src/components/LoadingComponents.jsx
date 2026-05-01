import React from "react";

// ✅ Skeleton Loader with Shimmer Effect
export const ProductSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm overflow-hidden relative">
    <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
    </div>
    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
    </div>
    <div className="h-4 bg-gray-100 rounded w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
    </div>
  </div>
);

// ✅ Top Progress Bar
export const TopProgressBar = () => (
  <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-gray-100/50 overflow-hidden">
    <div className="absolute h-full bg-amber-500 animate-loading-bar"></div>
  </div>
);
