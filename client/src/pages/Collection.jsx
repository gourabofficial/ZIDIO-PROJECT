import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiChevronDown, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';

// Using the same mock data from your original component
const mockCollectionProducts = {
  'all': [
    {
      id: 1,
      handle: 'ashura-t-shirt-preorder',
      title: 'Ashura T-shirt (Preorder)',
      price: 1749.00,
      compareAtPrice: 2199.00,
      image: 'https://ext.same-assets.com/1329671863/2325432086.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/769031796.jpeg',
    },
    {
      id: 2,
      handle: 'anti-magic-doc-sleeves-washed-tshirt-preorder',
      title: 'Anti Magic - Doc Sleeves Washed T-shirt (Preorder)',
      price: 1999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/3830187826.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/663859985.jpeg',
    },
    {
      id: 3,
      handle: 'monster-shirt',
      title: 'Monster Shirt',
      price: 2499.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/1493282078.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/2964396753.jpeg',
    },
    {
      id: 4,
      handle: 'malevolent-body-waffle-fabric-full-sleeve-t-shirt',
      title: 'Malevolent Body - Waffle Fabric Full Sleeve T-shirt (Preorder)',
      price: 1999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/2020819799.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/3898858674.jpeg',
    },
    {
      id: 5,
      handle: 'kaiju-v1-anime-oversized-t-shirt',
      title: 'Kaiju V1 - Anime Oversized T-shirt',
      price: 1699.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
      hoverImage: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
    },
    {
      id: 6,
      handle: 'berserking-menace',
      title: 'Berserking Menace',
      price: 2999.00,
      compareAtPrice: 3199.00,
      image: 'https://ext.same-assets.com/3510445368/722506443.jpeg',
      hoverImage: 'https://ext.same-assets.com/3510445368/2142829974.jpeg',
    },
    {
      id: 7,
      handle: 'pillar-of-stone-anime-oversized-t-shirt-with-patchwork',
      title: 'Pillar Of Stone - Anime oversized T-shirt with Patchwork',
      price: 1499.00,
      compareAtPrice: 1699.00,
      image: 'https://ext.same-assets.com/3510445368/626229588.jpeg',
      hoverImage: 'https://ext.same-assets.com/3510445368/626229588.jpeg',
    },
    {
      id: 8,
      handle: 'invincible-loose-fit-denim-jeans',
      title: 'Invincible - Loose Fit Denim Jeans',
      price: 2499.00,
      compareAtPrice: 2599.00,
      image: 'https://ext.same-assets.com/3510445368/1274537114.jpeg',
      hoverImage: 'https://ext.same-assets.com/3510445368/1274537114.jpeg',
    }
  ],
  'tshirt': [
    {
      id: 1,
      handle: 'ashura-t-shirt-preorder',
      title: 'Ashura T-shirt (Preorder)',
      price: 1749.00,
      compareAtPrice: 2199.00,
      image: 'https://ext.same-assets.com/1329671863/2325432086.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/769031796.jpeg',
    },
    {
      id: 2,
      handle: 'anti-magic-doc-sleeves-washed-tshirt-preorder',
      title: 'Anti Magic - Doc Sleeves Washed T-shirt (Preorder)',
      price: 1999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/3830187826.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/663859985.jpeg',
    },
    {
      id: 3,
      handle: 'monster-shirt',
      title: 'Monster Shirt',
      price: 2499.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/1493282078.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/2964396753.jpeg',
    },
    {
      id: 5,
      handle: 'kaiju-v1-anime-oversized-t-shirt',
      title: 'Kaiju V1 - Anime Oversized T-shirt',
      price: 1699.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
      hoverImage: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
    }
  ],
  'nox-collection-ss1-0': [
    {
      id: 1,
      handle: 'ashura-t-shirt-preorder',
      title: 'Ashura T-shirt (Preorder)',
      price: 1749.00,
      compareAtPrice: 2199.00,
      image: 'https://ext.same-assets.com/1329671863/2325432086.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/769031796.jpeg',
    },
    {
      id: 2,
      handle: 'anti-magic-doc-sleeves-washed-tshirt-preorder',
      title: 'Anti Magic - Doc Sleeves Washed T-shirt (Preorder)',
      price: 1999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/3830187826.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/663859985.jpeg',
    },
    {
      id: 3,
      handle: 'monster-shirt',
      title: 'Monster Shirt',
      price: 2499.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/1493282078.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/2964396753.jpeg',
    },
    {
      id: 4,
      handle: 'malevolent-body-waffle-fabric-full-sleeve-t-shirt',
      title: 'Malevolent Body - Waffle Fabric Full Sleeve T-shirt (Preorder)',
      price: 1999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/2020819799.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/3898858674.jpeg',
    }
  ]
};

// Collection titles
const collectionTitles = {
  'all': 'All Products',
  'tshirt': 'T-Shirts',
  'sweatshirt': 'Sweatshirts',
  'hoodies': 'Hoodies',
  'bottoms': 'Bottoms',
  'co-ord-set': 'Co-ord Sets',
  'sleeveless-vest': 'Sleeveless Vests',
  'nox-collection-ss1-0': 'NOX SS1.0 Collection',
  'yuki-collection': 'YUKI Collection',
  'takeover-collection-summer-phase-ii': 'Takeover Collection - Summer Phase II',
  'winter-2023-collection': 'Winter 2023 Collection',
  'summer-collection-phase-i-1': 'Summer Collection - Phase I'
};

const Collection = () => {
  const { collectionHandle } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('best-selling');
  const [activeFilters, setActiveFilters] = useState({
    price: [],
    size: []
  });

  useEffect(() => {
    // Simulate loading collection data
    setIsLoading(true);
    setTimeout(() => {
      // Get the collection products or default to all
      const handle = collectionHandle || 'all';
      const collectionProducts = mockCollectionProducts[handle] || mockCollectionProducts['all'];

      let sortedProducts = [...collectionProducts];

      // Sort products based on selection
      switch(sortBy) {
        case 'price-low-high':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'title-a-z':
          sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-z-a':
          sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
          break;
        // best-selling is default, no sorting needed
        default:
          break;
      }

      setProducts(sortedProducts);
      setIsLoading(false);
    }, 500);
  }, [collectionHandle, sortBy]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const togglePriceFilter = (range) => {
    setActiveFilters(prev => {
      const newPriceFilters = prev.price.includes(range) 
        ? prev.price.filter(item => item !== range)
        : [...prev.price, range];
        
      return { ...prev, price: newPriceFilters };
    });
  };

  const toggleSizeFilter = (size) => {
    setActiveFilters(prev => {
      const newSizeFilters = prev.size.includes(size)
        ? prev.size.filter(item => item !== size)
        : [...prev.size, size];
        
      return { ...prev, size: newSizeFilters };
    });
  };

  // Get collection title
  const title = collectionTitles[collectionHandle] || 'All Products';

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h1>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-[#1e293b] rounded-md hover:bg-[#334155] transition-colors"
          onClick={toggleFilter}
        >
          <FiFilter size={18} />
          <span>Filter</span>
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-[#1e293b] p-1 rounded-md">
            <button
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#0f172a] text-white' : 'text-[#cbd5e1] hover:text-white'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              <FiGrid size={18} />
            </button>
            <button
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#0f172a] text-white' : 'text-[#cbd5e1] hover:text-white'}`}
              onClick={() => setViewMode('list')}
              aria-label="List View"
            >
              <FiList size={18} />
            </button>
          </div>

          <div className="relative">
            <select
              className="appearance-none px-4 py-2 pr-8 bg-[#1e293b] text-white rounded-md border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#c4b5fd] focus:border-transparent"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="best-selling">Best selling</option>
              <option value="price-low-high">Price, low to high</option>
              <option value="price-high-low">Price, high to low</option>
              <option value="title-a-z">Alphabetically, A-Z</option>
              <option value="title-z-a">Alphabetically, Z-A</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <FiChevronDown className="text-white text-opacity-70" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mb-8 p-6 bg-[#1e293b] rounded-lg shadow-lg transition-all duration-300 slide-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Filter Products</h3>
            <button onClick={toggleFilter} className="text-[#cbd5e1] hover:text-white transition-colors">
              <FiX size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[#c4b5fd] font-medium mb-4">Price Range</h4>
              <div className="space-y-3">
                {['Under Rs. 1,000', 'Rs. 1,000 - Rs. 2,000', 'Over Rs. 2,000'].map((range) => (
                  <label key={range} className="flex items-center cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={activeFilters.price.includes(range)}
                      onChange={() => togglePriceFilter(range)}
                    />
                    <div className={`w-5 h-5 mr-3 rounded border transition-colors ${
                      activeFilters.price.includes(range) 
                        ? 'bg-[#c4b5fd] border-[#c4b5fd]' 
                        : 'bg-transparent border-[#cbd5e1] group-hover:border-white'
                    }`}>
                      {activeFilters.price.includes(range) && (
                        <svg className="w-5 h-5 text-[#0f172a]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${
                      activeFilters.price.includes(range) ? 'text-white' : 'text-[#cbd5e1] group-hover:text-white'
                    }`}>
                      {range}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[#c4b5fd] font-medium mb-4">Size</h4>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSizeFilter(size)}
                    className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ${
                      activeFilters.size.includes(size)
                        ? 'bg-[#c4b5fd] text-[#0f172a] font-medium'
                        : 'bg-[#334155] text-[#cbd5e1] hover:bg-[#475569] hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {activeFilters.price.length > 0 && activeFilters.price.map(filter => (
                <div key={filter} className="bg-[#334155] text-sm rounded-full px-3 py-1 flex items-center">
                  <span className="mr-1">{filter}</span>
                  <button onClick={() => togglePriceFilter(filter)} className="text-[#cbd5e1] hover:text-white">
                    <FiX size={14} />
                  </button>
                </div>
              ))}
              {activeFilters.size.length > 0 && activeFilters.size.map(size => (
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
              onClick={() => setActiveFilters({ price: [], size: [] })}
              disabled={activeFilters.price.length === 0 && activeFilters.size.length === 0}
            >
              Clear All Filters
            </button>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#334155] border-t-[#c4b5fd] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-[#0f172a] rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "flex flex-col space-y-6"
        }>
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="opacity-0" 
              style={{
                animation: 'fadeIn 0.5s forwards',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {viewMode === 'grid' ? (
                <ProductCard product={product} />
              ) : (
                <div className="flex bg-[#1e293b] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-1/3">
                    <div className="aspect-w-1 aspect-h-1 h-full">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">{product.title}</h3>
                      <div className="flex items-center mb-4">
                        <span className="text-[#c4b5fd] font-medium mr-2">Rs. {product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                          <>
                            <span className="line-through text-[#94a3b8] text-sm">Rs. {product.compareAtPrice.toFixed(2)}</span>
                            <span className="ml-2 text-xs bg-[#c4b5fd] text-[#0f172a] px-2 py-0.5 rounded-full font-medium">
                              {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn btn-secondary flex-1 py-2">View Details</button>
                      <button className="btn btn-primary flex-1 py-2">Add to Cart</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {products.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="bg-[#1e293b] inline-block p-6 rounded-lg">
            <p className="text-xl text-[#c4b5fd] font-medium mb-2">No products found</p>
            <p className="text-[#cbd5e1]">Try adjusting your filter criteria</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center mt-12">
          <div className="inline-flex rounded-md">
            <button className="px-4 py-2 rounded-l-md bg-[#c4b5fd] text-[#0f172a] font-medium">1</button>
            <button className="px-4 py-2 bg-[#1e293b] text-white hover:bg-[#334155] transition-colors">2</button>
            <button className="px-4 py-2 bg-[#1e293b] text-white hover:bg-[#334155] transition-colors">3</button>
            <button className="px-4 py-2 bg-[#1e293b] text-white hover:bg-[#334155] transition-colors">...</button>
            <button className="px-4 py-2 rounded-r-md bg-[#1e293b] text-white hover:bg-[#334155] transition-colors">5</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;