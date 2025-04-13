import React, { useState, useEffect } from 'react';
import SectionHeading from '../common/SectionHeading';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';

// Sample hotlist products data - expanded
const hotlistProductsData = [
  {
    id: 1,
    title: "Cosmic Guardian Helmet",
    price: 1299.99,
    compareAtPrice: 1799.99,
    image: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=500",
    category: "armor",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 2,
    title: "Stellar Force Shield",
    price: 899.99,
    compareAtPrice: 1299.99, 
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=500",
    category: "weapons",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 3,
    title: "Nebula Blade 3000",
    price: 1599.99,
    compareAtPrice: null,
    image: "https://images.unsplash.com/photo-1623501097816-03faeef1ad34?q=80&w=500",
    category: "weapons",
    rating: 5.0,
    inStock: true,
  },
  {
    id: 4,
    title: "Quantum Gauntlets",
    price: 799.99,
    compareAtPrice: 999.99,
    image: "https://images.unsplash.com/photo-1532188362424-afbbaaa4aa1e?q=80&w=500",
    category: "armor",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 5,
    title: "Galactic Ranger Boots",
    price: 649.99,
    compareAtPrice: null,
    image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=500",
    category: "gear",
    rating: 4.3,
    inStock: false,
  },
  {
    id: 6,
    title: "Astral Soul Enhancer",
    price: 2499.99,
    compareAtPrice: 2999.99,
    image: "https://images.unsplash.com/photo-1626285061836-2158fb0e72f3?q=80&w=500",
    category: "consumables",
    rating: 4.9,
    inStock: true,
  },
];

const HotItems = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setError(null);
    
    try {
      setTimeout(() => {
        // Filter products based on category
        let filteredProducts = 
          activeCategory === 'all' 
            ? hotlistProductsData 
            : hotlistProductsData.filter(product => product.category === activeCategory);
        
            
        setProducts(filteredProducts);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load hot items. Please try again later.');
      setIsLoading(false);
    }
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <section className="py-16 relative overflow-hidden bg-[#0c0e16]">
      {/* Decorative elements */}
      <div className="absolute inset-0 starry-bg opacity-20 pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-900/10 blur-3xl rounded-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading 
          title="HOT ITEMS" 
          description="Check out our hottest items that are trending right now. Don't miss out on these must-have pieces!" 
        />
        
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        
        {error ? (
          <div className="text-center py-10 bg-red-900/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <ProductGrid 
            products={products} 
            isLoading={isLoading} 
          />
        )}
        
      </div>
    </section>
  );
};

export default HotItems;