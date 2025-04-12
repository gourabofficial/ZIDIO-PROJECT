import React from 'react';

const TrendingProductSkeleton = () => {
  return (
    <div className="bg-[#151828] rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="h-64 bg-[#1e293b]"></div>
      <div className="p-4">
        <div className="h-5 bg-[#1e293b] rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-[#1e293b] rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-[#1e293b] rounded w-1/3"></div>
          <div className="h-8 bg-[#1e293b] rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProductSkeleton;