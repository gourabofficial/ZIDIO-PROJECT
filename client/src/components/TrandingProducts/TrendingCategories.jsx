import React from 'react';

const TrendingCategories = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
              activeCategory === category.id 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-[#1e293b] text-slate-300 hover:bg-[#334155]'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingCategories;