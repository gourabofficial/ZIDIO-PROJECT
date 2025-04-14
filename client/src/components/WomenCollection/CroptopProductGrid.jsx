import React from 'react';
import ProductCard from '../ProductCard/ProductCard';

const ProductSkeleton = () => {
  return (
    <div className="bg-[#151828] rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="h-72 bg-[#1e293b]"></div>
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

const CropTopsProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-[#1e293b] inline-block p-6 rounded-lg">
          <p className="text-xl text-[#c4b5fd] font-medium mb-2">No trending products found</p>
          <p className="text-[#cbd5e1]">Try selecting a different category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="opacity-0 animate-fadeIn" 
          style={{animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards'}}
        >
          <ProductCard product={product} />
        </div>
      ))}

      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CropTopsProductGrid;
