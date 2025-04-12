import { useState } from 'react';
import { categories } from './ProductData'; // Adjust the import path as necessary

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  return (
    <div className="flex flex-wrap justify-center mt-8 mb-4 gap-2 md:gap-4">
      {categories.map(category => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === category.id
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-[#1e293b] text-[#cbd5e1] hover:bg-[#334155]'
          }`}
          onClick={() => setActiveCategory(category.id)}
          style={{ color: activeCategory === category.id ? '#ffffff' : '#cbd5e1' }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;