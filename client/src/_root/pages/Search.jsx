import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiPackage } from 'react-icons/fi';
// import { getSearchProducts } from '../../Api/product';
import ProductCard from '../../components/ProductCard/ProductCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  });
  
  // Categories for filter dropdown
  const categories = ['Gaming', 'Audio', 'Accessories', 'Laptops', 'Phones'];
  
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    if (query) {
      performSearch(query, filters);
    }
  }, [query]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value.trim();
    console.log('Search submitted with value:', searchValue);
    if (searchValue) {
      setSearchParams({ q: searchValue });
    } else {
      setSearchParams({});
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = () => {
    performSearch(query, filters);
    setShowFilters(false);
  };
  
  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance'
    });
  };
  
  const performSearch = async (searchQuery, filterOptions) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Create params object for API
      const params = {
        query: searchQuery,
        ...filterOptions
      };
      
      // Call search API
      const response = await getSearchProducts(params);
      
      if (response.success) {
        setProducts(response.data || []);
        setCollections(response.collections || []);
        setOffers(response.offers || []);
      } else {
        console.error("Search failed:", response.message);
        setProducts([]);
        setCollections([]);
        setOffers([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
      setCollections([]);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full h-fit px-4 md:px-8 lg:px-30 mt-20 min-h-screen bg-[#0c0e16] ">
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-10">
        <div className="flex gap-2 max-w-xl mx-auto bg-[#1e293b]/70 backdrop-blur-sm p-2 rounded-full">
          <input
            type="text"
            name="search"
            defaultValue={query}
            placeholder="Search products, collections, offers..."
            className="flex-1 p-3 bg-transparent border-none rounded-full focus:outline-none text-white placeholder-gray-400"
            autoFocus
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center gap-2"
          >
            <span>Search</span>
            <FiSearch className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            {query ? `Search results for "${query}"` : 'Search Products'}
          </h1>
          
          {query && products.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-md text-white hover:bg-[#2d3748] transition-colors"
            >
              <FiFilter />
              <span>Filters</span>
            </button>
          )}
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-[#1e293b] rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Filter Products</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full bg-[#121828] border border-gray-700 rounded-md px-3 py-2 text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Range Filters */}
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full bg-[#121828] border border-gray-700 rounded-md px-3 py-2 text-white"
                  placeholder="Min"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full bg-[#121828] border border-gray-700 rounded-md px-3 py-2 text-white"
                  placeholder="Max"
                  min="0"
                />
              </div>
              
              {/* Sort By Filter */}
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Sort By</label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full bg-[#121828] border border-gray-700 rounded-md px-3 py-2 text-white"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low_high">Price: Low to High</option>
                  <option value="price_high_low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-white hover:text-gray-300"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Results Sections */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="mb-4">
              <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-purple-400 font-medium">Finding results for you...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Products ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            {collections?.length > 0 && (
              <div className="mt-10 w-full h-fit">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Collections ({collections.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collections.map(collection => (
                    <Link
                      key={collection._id || collection.id || collection.slug}
                      to={`/collections/${collection.slug}`}
                      className="transition-transform hover:scale-[1.02]"
                    >
                      <div className="bg-[#1e293b] rounded-lg overflow-hidden">
                        <img
                          src={collection.bannerImageUrl || 'https://via.placeholder.com/600x300'}
                          alt={collection.name || "Collection"}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                          {collection.description && (
                            <p className="text-gray-400 text-sm mt-1">{collection.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {offers?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold mb-6 text-purple-400">Offers ({offers.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {offers.map(offer => (
                    <div
                      key={offer._id || offer.id}
                      className="border border-purple-500/30 bg-[#1e293b] p-5 rounded-lg transition-all hover:scale-[1.02]"
                    >
                      <h3 className="text-lg font-bold text-purple-400 mb-2">{offer.offerName}</h3>
                      {offer.description && (
                        <p className="text-sm text-gray-400 mb-3">{offer.description}</p>
                      )}
                      {offer.discountPercent && (
                        <div className="inline-block bg-purple-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {offer.discountPercent}% OFF
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          query ? (
            <div className="text-center py-16 rounded-lg">
              <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any matches for "{query}"
              </p>
              <p className="text-gray-500 max-w-md mx-auto">
                Try checking for typos or using more general terms.
              </p>
            </div>
          ) : (
            <div className="text-center py-16 rounded-lg">
              <svg className="w-20 h-20 mx-auto text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Start searching</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Type in the search box above to discover products, collections and special offers.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;