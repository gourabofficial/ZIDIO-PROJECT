import React from 'react';
import SectionHeading from '../common/SectionHeading';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';
import ViewAllButton from './ViewAllButton';

const FeaturedProducts = () => {
  return (
    <section className="py-16 relative overflow-hidden bg-[#0f172a]">
      <div className="absolute inset-0 starry-bg opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading 
          title="NEW ARRIVALS" 
          description="Discover our latest collection of premium streetwear designed for those who appreciate distinctive style" 
        />
        
        <CategoryFilter />
        
        <ProductGrid />
        
        <ViewAllButton />
      </div>
    </section>
  );
};

export default FeaturedProducts;