import { FiX } from 'react-icons/fi';

const FilterPanel = ({ activeFilters, togglePriceFilter, toggleSizeFilter, onClose, clearFilters }) => {
  return (
    <div className="mb-8 p-6 bg-[#1e293b] rounded-lg shadow-lg transition-all duration-300 slide-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Filter Products</h3>
        <button onClick={onClose} className="text-[#cbd5e1] hover:text-white transition-colors">
          <FiX size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PriceFilter activeFilters={activeFilters.price} togglePriceFilter={togglePriceFilter} />
        <SizeFilter activeFilters={activeFilters.size} toggleSizeFilter={toggleSizeFilter} />
      </div>

      <ActiveFilters 
        activeFilters={activeFilters} 
        togglePriceFilter={togglePriceFilter}
        toggleSizeFilter={toggleSizeFilter}
        clearFilters={clearFilters}
      />
      
      <div className="mt-6 flex justify-center">
        <button className="btn btn-primary">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const PriceFilter = ({ activeFilters, togglePriceFilter }) => {
  const priceRanges = ['Under Rs. 1,000', 'Rs. 1,000 - Rs. 2,000', 'Over Rs. 2,000'];
  
  return (
    <div>
      <h4 className="text-[#c4b5fd] font-medium mb-4">Price Range</h4>
      <div className="space-y-3">
        {priceRanges.map((range) => (
          <label key={range} className="flex items-center cursor-pointer group">
            <input 
              type="checkbox" 
              className="sr-only"
              checked={activeFilters.includes(range)}
              onChange={() => togglePriceFilter(range)}
            />
            <div className={`w-5 h-5 mr-3 rounded border transition-colors ${
              activeFilters.includes(range) 
                ? 'bg-[#c4b5fd] border-[#c4b5fd]' 
                : 'bg-transparent border-[#cbd5e1] group-hover:border-white'
            }`}>
              {activeFilters.includes(range) && (
                <svg className="w-5 h-5 text-[#0f172a]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-sm transition-colors ${
              activeFilters.includes(range) ? 'text-white' : 'text-[#cbd5e1] group-hover:text-white'
            }`}>
              {range}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const SizeFilter = ({ activeFilters, toggleSizeFilter }) => {
  const sizes = ['S', 'M', 'L', 'XL', '2XL'];
  
  return (
    <div>
      <h4 className="text-[#c4b5fd] font-medium mb-4">Size</h4>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => toggleSizeFilter(size)}
            className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ${
              activeFilters.includes(size)
                ? 'bg-[#c4b5fd] text-[#0f172a] font-medium'
                : 'bg-[#334155] text-[#cbd5e1] hover:bg-[#475569] hover:text-white'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

const ActiveFilters = ({ activeFilters, togglePriceFilter, toggleSizeFilter, clearFilters }) => {
  const hasActiveFilters = activeFilters.price.length > 0 || activeFilters.size.length > 0;
  
  if (!hasActiveFilters) return null;
  
  return (
    <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {activeFilters.price.map(filter => (
          <div key={filter} className="bg-[#334155] text-sm rounded-full px-3 py-1 flex items-center">
            <span className="mr-1">{filter}</span>
            <button onClick={() => togglePriceFilter(filter)} className="text-[#cbd5e1] hover:text-white">
              <FiX size={14} />
            </button>
          </div>
        ))}
        {activeFilters.size.map(size => (
          <div key={size} className="bg-[#334155] text-sm rounded-full px-3 py-1 flex items-center">
            <span className="mr-1">Size: {size}</span>
            <button onClick={() => toggleSizeFilter(size)} className="text-[#cbd5e1] hover:text-white">
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <button 
        className="text-sm text-[#c4b5fd] hover:text-white transition-colors"
        onClick={clearFilters}
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterPanel;