import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import { mockProducts } from './ProductData';

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => {
        if (activeCategory === 'preorder') {
          return product.title.toLowerCase().includes('preorder');
        }
        return product.title.toLowerCase().includes(activeCategory.toLowerCase());
      });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {filteredProducts.map((product, index) => (
        <div 
          key={product.id}
          className="featured-product-item"
          style={{
            animation: `slideUp 0.6s forwards ${index * 0.1}s`,
            opacity: 0,
            transform: 'translateY(20px)'
          }}
        >
          
          
          <ProductCard
            
            product={product} />
          
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;