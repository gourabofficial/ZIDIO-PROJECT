import React, { useState, useEffect, useRef } from 'react';
import CropTopsHeader from './CroptopHeader';
import CropTopsCategories from './CropTopsCategories';
import CropTopsProductGrid from './CroptopProductGrid';
import ViewAllButton from '../common/ViewAllButton';


import { cropTopsProducts, cropTopsCategories } from './CroptopData';

const CropTopsPage = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const starsContainerRef = useRef(null);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      // Filter products based on category
      const filteredProducts = 
        activeCategory === 'all' 
          ? cropTopsProducts 
          : cropTopsProducts.filter(product => product.category.includes(activeCategory));
      
      setProducts(filteredProducts);
      setIsLoading(false);
    }, 600);

    // Create subtle stars
    createStars();
  }, [activeCategory]);

  const createStars = () => {
    if (starsContainerRef.current) {
      starsContainerRef.current.innerHTML = '';
      
      // Create a smaller number of stars (120 instead of 200+)
      for (let i = 0; i < 120; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 1.5 + 0.5; // Smaller stars (0.5px to 2px)
        
        star.className = 'absolute rounded-full bg-white';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        // Very light opacity (0.05 to 0.15)
        star.style.opacity = Math.random() * 0.5 + 0.5;
        
        starsContainerRef.current.appendChild(star);
      }
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="relative min-h-screen bg-[#0c0e16] overflow-hidden">
      {/* Very subtle stars */}
      <div ref={starsContainerRef} className="absolute inset-0 z-0 pointer-events-none"></div>
      
      {/* Nebula effects */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-purple-900/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-pink-900/5 blur-3xl"></div>
      <div className="absolute top-40 left-1/4 w-60 h-60 rounded-full bg-indigo-900/5 blur-3xl"></div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <CropTopsHeader />
        
        <CropTopsCategories 
          categories={cropTopsCategories} 
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <CropTopsProductGrid 
          products={products} 
          isLoading={isLoading} 
        />
      </div>
      <ViewAllButton text='VIEW ALL PRODUCT' url='/crop-top' />
    </div>
  );
};

export default CropTopsPage;