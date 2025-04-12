import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import TrendingProductSkeleton from './TrandingProductSeleton';

const TrendingProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <TrendingProductSkeleton key={index} />
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

export default TrendingProductGrid;