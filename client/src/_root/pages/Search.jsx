import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchProducts } from '../../Api/ProductApi'; 
import ProductCard from '../../components/ProductCard/ProductCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    if (query) {
      setInputValue(query);
      performSearch(query);
    }
  }, [query]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value.trim();
    if (searchValue) {
      setSearchParams({ q: searchValue });
    } else {
      setSearchParams({});
    }
  };
  
  const clearSearch = () => {
    setInputValue('');
    setSearchParams({});
  };
  
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchProducts({
        query: searchQuery
      });
      
      if (response.success) {
        setProducts(response.products || []);
        setCollections(response.collections || []);
      } else {
        setProducts([]);
        setCollections([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search form with cosmic styling */}
        <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-full blur-sm"></div>
            <div className="relative flex gap-2 bg-[#13141f]/70 backdrop-blur-md p-2 rounded-full border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.15)]">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search heroes, collections..."
                  className="w-full pl-12 pr-10 py-3 bg-transparent border-none rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all duration-300"
                  autoFocus
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="group relative overflow-hidden px-6 py-3 rounded-full transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600"></span>
                <span className="relative flex items-center justify-center text-white font-medium">
                  Search
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            {query ? `Cosmic results for "${query}"` : 'Search the Cosmos'}
          </h1>
        </div>
        
        {/* Results Sections */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-r-indigo-500 border-t-purple-500 rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-300 text-lg font-medium">
              Searching the cosmos...
            </p>
          </div>
        ) : products.length > 0 ? (
          <div 
            className="animate-fadeIn opacity-0" 
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            {/* Products Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3 shadow-sm shadow-purple-500/30">
                  <span className="text-white font-bold">{products.length}</span>
                </div>
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                  Heroes Found
                </span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((product, index) => {
                  const transformedProduct = {
                    id: product._id || product.product_id,
                    title: product.name,
                    price: product.price,
                    compareAtPrice: product.discount ? product.price + product.discount : null,
                    image: product.images && product.images.length > 0 
                      ? product.images[0].imageUrl 
                      : "https://via.placeholder.com/300",
                    category: product.category,
                    inStock: true,
                    handle: product.id || product.product_id
                  };
                  
                  return (
                    <div
                      key={transformedProduct.id}
                      className="group transform transition-all duration-300 hover:scale-105 hover:-rotate-1 animate-fadeIn"
                      style={{
                        animationDelay: `${0.1 * index}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <ProductCard product={transformedProduct} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collections Section */}
            {collections?.length > 0 && (
              <div 
                className="mt-12 animate-fadeIn opacity-0" 
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3 shadow-sm shadow-pink-500/30">
                    <span className="text-white font-bold">{collections.length}</span>
                  </div>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Collections Found
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map((collection, index) => (
                    <Link
                      key={collection._id || collection.id || collection.slug}
                      to={`/collections/${collection.slug}`}
                      className="group transition-all duration-300 hover:scale-[1.02] relative animate-fadeIn"
                      style={{ animationDelay: `${0.1 * index + 0.5}s`, animationFillMode: "forwards" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-900/5 relative z-10">
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={collection.bannerImageUrl || 'https://via.placeholder.com/600x300'}
                            alt={collection.name || "Collection"}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#13141f] to-transparent opacity-70"></div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">{collection.name}</h3>
                          {collection.description && (
                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{collection.description}</p>
                          )}
                          <div className="mt-3 flex justify-end">
                            <span className="text-xs text-purple-400 group-hover:text-purple-300 transition-colors duration-300 flex items-center">
                              Explore collection
                              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          query ? (
            <div className="backdrop-blur-md bg-black/30 border border-purple-900/30 rounded-xl p-10 max-w-2xl mx-auto text-center animate-fadeIn">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-md"></div>
                <div className="relative w-full h-full">
                  <svg className="w-full h-full text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-3">
                No cosmic heroes found
              </h3>
              <p className="text-gray-300 mb-6">
                We couldn't find any matches for "{query}" in our universe
              </p>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Try checking for typos or using more general terms to expand your search across the cosmos.
              </p>
              <button
                onClick={clearSearch}
                className="relative group overflow-hidden px-6 py-2.5 rounded-lg"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600"></span>
                <span className="relative flex items-center justify-center text-white font-medium">
                  <FiX className="w-4 h-4 mr-2" />
                  Clear Search
                </span>
              </button>
            </div>
          ) : (
            <div className="backdrop-blur-md bg-black/20 border border-purple-900/20 rounded-xl p-12 max-w-2xl mx-auto text-center animate-fadeIn">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-md"></div>
                <div className="relative w-full h-full">
                  <svg className="w-full h-full text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-4">
                Explore the Cosmic Heroes Universe
              </h3>
              <p className="text-gray-300 mb-2 text-lg">
                Begin your cosmic journey
              </p>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Type in the search box above to discover rare heroes and legendary collections across the galaxy.
              </p>
              <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                {['Batman', 'Spiderman', 'Avengers', 'X-Men', 'Superman', 'Wonder Woman'].map(term => (
                  <button 
                    key={term}
                    onClick={() => {
                      setInputValue(term);
                      setSearchParams({ q: term });
                    }}
                    className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-800/40 border border-indigo-600/30 rounded-full text-sm text-indigo-300 transition-all duration-300 hover:shadow-md hover:shadow-indigo-900/30"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Search;